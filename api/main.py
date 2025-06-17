import json
import sqlalchemy as db
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .database import SessionLocal, engine
from sqlalchemy.orm import Session
from pydantic import BaseModel
from .models import Item
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from . import models
models.Base.metadata.create_all(bind=engine)


session_user_id = "root"
session_password = "password"

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

@app.get("/users/{session_user_id}/items/")
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

@app.post("/users/{session_user_id}/items/")
def add_item(item: ItemModel):
    conn = sqlite3.connect('items.db')
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO items (id, item_name, brand, date_added, quantity) 
        VALUES (?, ?, ?, ?, ?)
    """, (item.id, item.item_name, item.brand, item.date_added, item.quantity))
    
    conn.commit()
    conn.close()

@app.get("/users/{session_user_id}/items/{item_id}")
def get_item(item_id: int):
    conn = sqlite3.connect('items.db')
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM items WHERE id = ?", (item_id,))

    row = cursor.fetchone()
    
    conn.close()
    
    if row:
        return {
            "id": row[0],
            "item_name": row[1],
            "brand": row[2],
            "date_added": row[3],
            "quantity": row[4]
        }
    else:
        return {"error": "Item not found"}

@app.put("/users/{session_user_id}/items/{item_id}")
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

@app.delete("/users/{session_user_id}/items/{item_id}")
def delete_item(item_id: int):
    conn = sqlite3.connect('items.db')
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM items WHERE id = ?", (item_id,))
    
    conn.commit()
    conn.close()


@app.get("/users/{session_user_id}")
def login_user(session_user_id: str):

@app.get("/users/{session_user_id}/")
def get_user(session_user_id: str):

@app.post("/users/")
def create_user(user: UserModel):

@app.delete("/users/{session_user_id}/")
def delete_user(session_user_id: str):


@app.put("/users/{session_user_id}/")
def update_user(session_user_id: str, user: UserModel):