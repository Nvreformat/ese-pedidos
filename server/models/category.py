from sqlalchemy import Column, Integer, String, DECIMAL, Float, BLOB, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base, get_session
from util import is_float, get_random_string

class Category(Base):
    __tablename__ = "restaurant_categories"
    id          =   Column(Integer, primary_key=True)
    name        =   Column(String(64), unique=True)
    restaurant_id   =   Column(Integer, ForeignKey('restaurants.id'))
    restaurant      =   relationship("Restaurant")

    @staticmethod
    def get_from_restaurant(restaurant):
        session = get_session()
        return session.query(Category).filter(Category.restaurant_id == restaurant.id).all()

    @staticmethod
    def get_from_id(restaurant, id):
        session = get_session()
        result = session.query(Category).filter(Category.id == id).filter(Category.restaurant_id == restaurant.id).all()

        if (len(result) > 0):
            return result[0]

    def add(name, restaurant):
        category = Category(
            name = name,
            restaurant_id = restaurant.id,
        )

        session = get_session()
        session.add(category)
        session.commit()

        return category
    
    def remove(self):
        for product in Product.get_from_category(self):
            product.remove()

        session = get_session()
        session.delete(self)
        session.commit()
