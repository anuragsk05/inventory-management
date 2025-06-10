from sqlalchemy import Boolean, Column, Integer, String
from database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String, unique=False, index=True)
    brand = Column(String, unique=False, index=True)
    date_added = Column(String, unique=False, index=True)
    quantity = Column(Integer, unique=False, index=True)