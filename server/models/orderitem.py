from sqlalchemy import Column, Integer, String, DECIMAL, Float, BLOB, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base, get_session
from util import is_float, get_random_string

class OrderItem(Base):
    __tablename__ = "order_items"
    id          =   Column(Integer, primary_key=True)
    """
    I don't feel comfortable storing the product name in the db every time
    an order is issued, but this is necessary. Let's say you want to know what you
    sold on a really old order, but one of the products doesn't exist anymore.
    Congratulations, you just broke the db!
    So, instead we just store anything relevant to the product here, fixing that issue.
    """
    name        =   Column(String(64))
    price       =   Column(DECIMAL(18, 2, asdecimal=False))
    count       =   Column(Integer)
    order_id   =   Column(Integer, ForeignKey('orders.id'))
    order      =   relationship("Order")

    @staticmethod
    def add(name, price, count, order):
        orderItem = OrderItem(
            name = name,
            price = price,
            count = count,
            order_id = order.id,
        )

        session = get_session()
        session.add(orderItem)
        session.commit()

        return orderItem
    
    def remove(self):
        session = get_session()
        session.delete(self)
        session.commit()