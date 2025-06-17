import models, json
import sqlalchemy as db
from fastapi import FastAPI, Request
from database import SessionLocal, engine
from sqlalchemy.orm import Session
from pydantic import BaseModel
from models import Item
import sqlite3

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

class Add(BaseModel):
    id : int
    item_name : str
    brand : str
    date_added : str
    quantity : int

def add():
    a = int(input("Enter the id number you would like to add: "))
    b = str(input("Enter the name of the item: "))
    c = str(input("Enter the brand of the item: "))
    d = str(input("Enter the date of this added item: "))
    e = int(input("Enter the amount of your item you would like to add: "))

    #assigns user inputs to objects within class
    return Add(id=a, item_name=b, brand=c, date_added=d, quantity=e)

def delete():
    # Connect to the database
    conn = sqlite3.connect('items.db')
    cur = conn.cursor()

    item_id = int(input("Enter the ID number of the item you want to delete: "))

    cur.execute("SELECT * FROM items WHERE id = ?", (item_id,))
    result = cur.fetchone()

    if result:
        cur.execute("DELETE FROM items WHERE id = ?", (item_id,))
        conn.commit()
        print("Item deleted successfully.")
    conn.close()

inventory = {}
def main():
    choice = int(input("Enter 1 if you want to add something to database, enter 2 if you want to delete something from it: "))
    if choice == 1:
        item_data = add()

        #inventory will have a key thats added via object id to be assigned to attributes within add function
        inventory[item_data.id] = item_data

        # create a table based off methods of objects develpoed within "class Item"
        item = Item(
            id = item_data.id,
            item_name = item_data.item_name,
            brand = item_data.brand,
            date_added = item_data.date_added,
            quantity = item_data.quantity
        )

        # open and insert session
        db_session = SessionLocal()
        db_session.add(item)
        db_session.commit()

        # Retrieve all items and export to JSON
        items = db_session.query(Item).all()
        convert_list = [{
            "id": i.id,
            "item_name": i.item_name,
            "brand": i.brand,
            "date_added": i.date_added,
            "quantity": i.quantity
        } for i in items]

        with open("storage.json", "w") as outfile:
            json.dump(convert_list, outfile, indent=4)
        db_session.close()

        with open('storage.json') as file:
            data = json.load(file)
        printer = json.dumps(data, indent=4)
        print(printer)

    if choice == 2:
        delete()

main()

if __name__ == "__main__":
    main()