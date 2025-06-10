import models
from fastapi import FastAPI, Request
from database import SessionLocal, engine
from sqlalchemy.orm import Session
app = FastAPI()

models.Base.metadata.create_all(bind=engine)