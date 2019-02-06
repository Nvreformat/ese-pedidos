from sqlalchemy import Column, Integer, String, DECIMAL, Float, BLOB, ForeignKey, Boolean, JSON, TEXT, BigInteger
from sqlalchemy.orm import relationship
from database import Base, get_session
from models.product import Product
from models.orderitem import OrderItem
from models.orderchat import OrderChat
from util import is_float, get_random_string
import json
import time

class Order(Base):
    __tablename__ = "orders"
    id              =   Column(Integer, primary_key=True)
    address         =   Column(String(64))
    price           =   Column(DECIMAL(18, 2, asdecimal=False))
    latitude        =   Column(Float)
    longitude       =   Column(Float)
    comments        =   Column(String(512), default="")
    status          =   Column(Integer, default=0)
    date            =   Column(BigInteger, default=time.time())
    fee             =   Column(DECIMAL(18, 2, asdecimal=False))
    chat_json       =   Column(TEXT, default="[]")
    client_id       =   Column(Integer, ForeignKey('clients.id'))
    client          =   relationship("Client")
    restaurant_id   =   Column(Integer, ForeignKey('restaurants.id'))
    restaurant      =   relationship("Restaurant")

    @staticmethod
    def get_from_restaurant(restaurant):
        session = get_session()
        return session.query(Order).filter(Order.restaurant_id == restaurant.id).all()

    @staticmethod
    def get_from_client(client):
        session = get_session()
        return session.query(Order).filter(Order.client_id == client.id).all()

    @staticmethod
    def get_from_id(id):
        session = get_session()
        result = session.query(Order).filter(Order.id == id).all()

        if (len(result) > 0):
            return result[0]

    @staticmethod
    def add(address, price, comments, products, coords, client, restaurant):
        session = get_session()

        # Checking if the client's requested products actually exist
        for clientProduct in products:
            product = Product.get_from_id(clientProduct["id"])

            if (product is None):
                return None

        order = Order(
            address = address,
            price = price,
            comments = comments,
            latitude = coords[0],
            longitude = coords[1],
            fee = price * 0.079,
            date = time.time(),
            status = 0,
            restaurant_id = restaurant.id,
            client_id = client.id,
        )

        session.add(order)
        session.commit()
        
        for clientProduct in products:
            product = Product.get_from_id(clientProduct["id"])
            orderItem = OrderItem(
                name = product.name,
                price = product.price,
                count = clientProduct["count"],
                order_id = order.id,
            )
            session.add(orderItem)

        session.commit()

        return order
    
    def remove(self):
        session = get_session()
        session.delete(self)
        session.commit()

    def get_products(self):
        session = get_session()
        items_ret = []
        items = session.query(OrderItem).filter(OrderItem.order_id == self.id).all()

        # Return only the relevant fields from the db
        for item in items:
            items_ret.append({
                "name": item.name,
                "price": item.price,
                "count": item.count,
            })

        return items_ret

    def add_chat(self, message, from_client):
        session = get_session()

        order_chat = OrderChat(
            message = message,
            from_client = from_client,
            date = time.time(),
            order_id = self.id,
        )
        
        session.add(order_chat)
        session.commit()

    def get_chat(self):
        session = get_session()
        chats_ret = []
        chats = session.query(OrderChat).filter(OrderChat.order_id == self.id).all()

        # Return only the relevant fields from the db
        for chat in chats:
            chats_ret.append({
                "message": chat.message,
                "fromClient": chat.from_client,
                "date": chat.date,
            })

        return chats_ret