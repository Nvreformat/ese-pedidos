
from sqlalchemy import Column, Integer, String, DECIMAL, Float, BLOB, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base, get_session
from util import is_float, get_random_string

class Client(Base):
    __tablename__ = "clients"
    id          =   Column(Integer, primary_key=True)
    number      =   Column(String(64))
    token       =   Column(String(64))
    banned      =   Column(Boolean, default=False)  

    @staticmethod
    def add(number):
        if (number):
            client = Client(
                number = number,
                token = get_random_string(64),
            )

            session = get_session()
            session.add(client)
            session.commit()

            return client
    
    def remove(self):
        session = get_session()
        session.delete(self)
        session.commit()
    
    @staticmethod
    def get_from_id(id):
        session = get_session()
        result = session.query(Client).filter(Client.id == id).all()

        if (len(result) > 0):
            return result[0]
    
    @staticmethod
    def get_from_token(token):
        session = get_session()
        result = session.query(Client).filter(Client.token == token).all()

        if (len(result) > 0):
            return result[0]

    @staticmethod
    def get_from_number(number):
        session = get_session()
        result = session.query(Client).filter(Client.number == number).all()

        if (len(result) > 0):
            return result[0]

