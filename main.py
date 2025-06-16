import models
import sqlalchemy as db
from fastapi import FastAPI, Request
from database import SessionLocal, engine
from sqlalchemy.orm import Session
from pydantic import BaseModel
from models import Item
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
    return a, b, c, d, e
    
#call add function
a, b, c, d, e = add()

    #will return user input
inventory = {}
call = Add(id=a, item_name=b, brand=c, date_added=d, quantity=e)

#new key assigned with value from called function
#id number is whats will be connected to all other properties
inventory[a] = call


def deletion():
    key_del = int(input("Enter an the numnber of the id you want to delete"))
    if key_del in inventory:
        inventory.pop(key_del)

#calls instance of object to be used
item = Item(id=a, item_name=b, brand=c, date_added=d, quantity=e)

#can now create function to insert into sqlite via alchemy
#method now inserts table into sqlite
db.add(item)