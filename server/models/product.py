from sqlalchemy import Column, Integer, String, DECIMAL, Float, BLOB, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base, get_session
from util import is_float, get_random_string

class Product(Base):
    __tablename__ = "restaurant_products"
    id              =   Column(Integer, primary_key=True)
    name            =   Column(String(64))
    description     =   Column(String(128))
    price           =   Column(DECIMAL(18, 2, asdecimal=False))
    restaurant_id   =   Column(Integer, ForeignKey('restaurants.id'))
    restaurant      =   relationship("Restaurant")
    category_id     =   Column(Integer, ForeignKey('restaurant_categories.id'))
    category        =   relationship("Category")

    @staticmethod
    def get_from_category(category):
        session = get_session()
        return session.query(Product).filter(Product.category_id == category.id).all()

    @staticmethod
    def get_from_id(id):
        session = get_session()
        result = session.query(Product).filter(Product.id == id).all()

        if (len(result) > 0):
            return result[0]

    def add(name, description, price, restaurant, category):
        product = Product(
            name = name,
            description = description,
            price = price,
            restaurant_id = restaurant.id,
            category_id = category.id,
        )

        session = get_session()
        session.add(product)
        session.commit()

        return category
    
    def remove(self):
        session = get_session()
        session.delete(self)
        session.commit()