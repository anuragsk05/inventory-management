import json
import sqlite3
import bcrypt
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Item
from cryptography.fernet import Fernet
import os
import models

app = FastAPI()

#to run use "uvicorn main:app --reload"
#if already used use "lsof -i :8000"
# to run interactive ui use "http://127.0.0.1:8000/docs"

#passwords been hashed, however data recored within is not, use cryptography to encrypt data post user login and storage
# encrypt user input before storing into sqlite database, decrypt when showcasing it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)


if not os.path.exists("secret.key"):
    key = Fernet.generate_key()
    with open("secret.key", "wb") as key_file:
        key_file.write(key)
else:
    with open("secret.key", "rb") as key_file:
        key = key_file.read()

back_end_key = Fernet(key)
class UserModel(BaseModel):
    user_id: str
    name : str
    password: str

class ItemModel(BaseModel):
    id: int
    item_name: str
    brand: str
    date_added: str
    quantity: int
    user_id: str



@app.get("/users/{id}/items/")
def get_all_items():
    conn = sqlite3.connect('items.db')
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM items")
    rows = cursor.fetchall()
    
    result = []
    for row in rows:
        result.append({
            "id": row[0],
            "item_name": row[1],
            "brand": row[2],
            "date_added": row[3],
            "quantity": row[4]
            
        })
    
    conn.close()
    return result

#encryption will occur within add function post user login, before storing data within sqlite databse we need to encrypt it first
@app.post("/users/{id}/items/")
def add_item(item: ItemModel):
    conn = sqlite3.connect('items.db')
    cursor = conn.cursor()
    encrypted_item_name = back_end_key.encrypt(item.item_name.encode()).decode()
    encrypted_brand = back_end_key.encrypt(item.brand.encode())
    encrypted_date_added = back_end_key.encrypt(item.date_added.encode()).decode()
    encrypted_quantity = back_end_key.encrypt(item.quantity.encode()).decode()

    cursor.execute("""
        INSERT INTO items (id, item_name, brand, date_added, quantity, user_id) 
        VALUES (?, ?, ?, ?, ?, ?)
    """, (item.id, encrypted_item_name, encrypted_brand, encrypted_date_added, encrypted_quantity, item.user_id))
    
    
    conn.commit()
    conn.close()

@app.get("/users/{id}/items/{item_id}")

#reaccess encrypted key and then decrypt it
def get_item(item_id: int):
    conn = sqlite3.connect('items.db')
    cursor = conn.cursor()
    decrypted_item_name = back_end_key.decrypt(row[1].encode()).decode()
    decrypted_brand = back_end_key.decrypt(row[2].encode()).decode()
    decrypted_date_added = back_end_key.decrypt(row[3].encode()).decode()
    decrypted_quantity = back_end_key.decrypt(row[4].encode()).decode()

    cursor.execute("SELECT * FROM items WHERE id = ?", (item_id,))
    row = cursor.fetchone()

    
    
    conn.close()
    
    if row:
        return {
            "id": row[0],
            "item_name": decrypted_item_name,
            "brand": decrypted_brand,
            "date_added": decrypted_date_added,
            "quantity": decrypted_quantity
        }
    else:
        return {"error": "Item not found"}

@app.put("/users/{user_id}/items/{item_id}")
def update_item(item_id: int, item: ItemModel):
    conn = sqlite3.connect('items.db')
    cursor = conn.cursor()
    
    cursor.execute("""
        UPDATE items 
        SET item_name = ?, brand = ?, date_added = ?, quantity = ? 
        WHERE id = ?
    """, (item.item_name, item.brand, item.date_added, item.quantity, item_id))
    
    conn.commit()
    conn.close()

@app.delete("/users/{user_id}/items/{item_id}")
def delete_item(item_id: int):
    conn = sqlite3.connect('items.db')
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM items WHERE id = ?", (item_id,))

    conn.commit()
    conn.close()

@app.post("/login/")
def login_user(user: UserModel):  # user comes in via JSON body
    conn = sqlite3.connect('items.db')
    cursor = conn.cursor()

    # Step 1: Retrieve hashed password from DB
    cursor.execute("SELECT password FROM users WHERE user_id = ?", (user.user_id,))
    result = cursor.fetchone()      #grab user inputdata stored under login of username and password

    if result is None:
        raise HTTPException(status_code=404, detail="User not found")

    stored_hashed_pw = result[0]  # stored hash in DB

    # Step 2: Compare using bcrypt
    if bcrypt.checkpw(user.password.encode('utf-8'), stored_hashed_pw.encode('utf-8')):
        return {"message": "Login successful"}
    
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/users/{session_user_id}/")
def get_user(session_user_id: str):
    conn = sqlite3.connect('items.db')
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE user_id = ?", (session_user_id,))
    user = cursor.fetchone()
    conn.close()

    if user:
        return {"user_id": user[0], "name": user[1]}

@app.post("/users/")
def create_user(user: UserModel):
    conn = sqlite3.connect('items.db')
    cursor = conn.cursor()

    # Step 1: Hash the password
    hashed_pw = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    try:
        # Step 2: Insert user into database
        cursor.execute(
            "INSERT INTO users (user_id, name, password) VALUES (?, ?, ?)",
            (user.user_id, user.name, hashed_pw)
        )
        conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="User ID already exists")
    finally:
        conn.close()
    return {"message": "account created"}

@app.delete("/users/{session_user_id}/")
def delete_user(session_user_id: str):
    conn = sqlite3.connect('items.db')
    cursor = conn.cursor()

    #meant to constrain foreign keys
    cursor.execute("PRAGMA foreign_keys = ON;")
    cursor.execute("DELETE FROM users WHERE user_id = ?", (session_user_id,))

    conn.commit()
    conn.close()

    return {"message": f"User {session_user_id} and their items have been deleted."}