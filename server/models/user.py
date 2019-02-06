from sqlalchemy import Column, Integer, String, DECIMAL, Float, BLOB, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base, get_session
from util import is_float, is_int, get_random_string
from passlib.hash import pbkdf2_sha256

class User(Base):
    __tablename__ = "users"
    id             =   Column(Integer, primary_key=True)
    username       =   Column(String(64))
    password       =   Column(String(64))
    token          =   Column(String(64))
    access_level   =   Column(Integer, default=0)  
    restaurant_id  =   Column(Integer, ForeignKey('restaurants.id'))
    restaurant     =   relationship("Restaurant")

    @staticmethod
    def add(username, password, access_level, restaurant):
        if (username and password and is_int(access_level) and restaurant):
            user = User(
                username = username,
                password = password,
                access_level = access_level,
                token = get_random_string(64),
                restaurant_id = restaurant.id
            )

            session = get_session()
            session.add(user)
            session.commit()

            return user
    
    def remove(self, remover):
        session = get_session()
        session.delete(self)
        session.commit()
    
    @staticmethod
    def get_from_token(token):
        session = get_session()
        result = session.query(User).filter(User.token == token).all()

        if (len(result) > 0):
            return result[0]

    @staticmethod
    def get_from_name_password(username, password):
        session = get_session()
        hashedPassword = pbkdf2_sha256.hash(password)
        result = session.query(User).filter(User.username == username).filter(User.password == password).all()

        if (len(result) > 0):
            return result[0]
