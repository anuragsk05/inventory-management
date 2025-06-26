"""Models for the database."""
from sqlalchemy import Boolean, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String, unique=False, index=True)
    brand = Column(String, unique=False, index=True)
    date_added = Column(String, unique=False, index=True)
    quantity = Column(Integer, unique=False, index=True)

class User(Base):
    __tablename__ = "users"

    user_id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=False, index=True)
    password = Column(String, unique=False, index=True)
    