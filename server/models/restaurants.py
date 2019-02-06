from sqlalchemy import Column, Integer, String, DECIMAL, Float, BLOB, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base, get_session
from models.user import User

from util import is_float, get_random_string

class Restaurant(Base):
    __tablename__ = "restaurants"
    id          =   Column(Integer, primary_key=True)
    name        =   Column(String(64))
    description =   Column(String(128))
    paid_fees   =   Column(Integer, default=0)

    @staticmethod
    def get_all():
        session = get_session()
        return session.query(Restaurant).all()

    @staticmethod
    def get_from_id(id):
        session = get_session()
        result = session.query(Restaurant).filter(Restaurant.id == id).all()

        if (len(result) > 0):
            return result[0]

    def add(name, description):
        restaurant = Restaurant(
            name = name,
            description = description,
        )

        session = get_session()
        session.add(restaurant)
        session.commit()

        return restaurant
    
    def remove(self):
        session = get_session()
        session.delete(self)
        session.commit()

    def get_users(self):
        session = get_session()
        return session.query(User).filter(User.restaurant_id == self.id)
