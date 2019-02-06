from sqlalchemy import Column, Integer, String, DECIMAL, Float, BLOB, ForeignKey, Boolean, JSON, TEXT, BigInteger
from sqlalchemy.orm import relationship
from database import Base, get_session
from util import is_float, get_random_string
import time

class OrderChat(Base):
    __tablename__ = "order_chat"
    id          =  Column(Integer, primary_key=True)
    message    =   Column(String(64))
    from_client =   Column(Boolean)
    date            =   Column(BigInteger, default=time.time())
    order_id   =   Column(Integer, ForeignKey('orders.id'))
    order      =   relationship("Order")
    