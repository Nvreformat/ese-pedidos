from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base
import sqlalchemy
from random import randint
from flask import has_request_context, request
import time
import random
import os
import configparser

Base = declarative_base()

def get_url():
    config = configparser.ConfigParser()
    config.read(os.getcwd() + "/config.ini")
    host = config.get("Database", "host")
    database = config.get("Database", "database")
    username = config.get("Database", "username")
    password = config.get("Database", "password")
    path = config.get("Database", "path")
    url = "mysql+mysqldb://" + username + ":" + password + "@" + host + "/" + database + "?unix_socket=" + path
    return url

engine = create_engine(get_url(), pool_recycle=3600, pool_pre_ping=True)
get_session = scoped_session(sessionmaker(bind=engine))

def setup(search_for):
    connection = engine.connect()
    if (not engine.dialect.has_table(connection, search_for)):
        first_run()

# Setup tables and user on first run
def first_run():
    from models.client import Client
    from models.category import Category
    from models.orders import Order
    from models.product import Product
    from models.restaurants import Restaurant
    from models.user import User
    meta = sqlalchemy.MetaData(engine)
    meta.reflect()
    #meta.drop_all()

    print("First run, please wait while the db is being populated...")

    # Create tables
    Base.metadata.create_all(engine)

    testClient = Client.add("6977988551")
    testClient2 = Client.add("8891155521")

    restaurant = Restaurant.add("Restaurant 1", "The best food you'll find in the city\nWe make sandwiches, salads and burgers")

    sandwichesCategory = Category.add("Sandwiches", restaurant)
    Product.add("Pulled Pork", "With tangy barbecue sauce on an onion knot", 9.50, restaurant, sandwichesCategory)
    Product.add("Turkey Club", "Roasted turkey breast, bacon, lettuce, avocado and tomato on baguette", 8, restaurant, sandwichesCategory)
    Product.add("Reuben", "Corned beef, melted swiss, sauerkraut and thousand island on marbled rye", 8, restaurant, sandwichesCategory)
    Product.add("Shrimp Cilantro Wrap", "Shrimp, avocado, mixed greens, salsa, cilantro and may on a tomato tortilla", 8.5, restaurant, sandwichesCategory)

    burgerCategory = Category.add("Burgers", restaurant)
    Product.add("Grass-fed Beef Burger", "With sharp cheddar, heirloom tomatoes and caramelized onions", 9.5, restaurant, burgerCategory)
    Product.add("Mushroom Swiss Burger", "With sautéed mushrooms and melted swiss on a home-baked roll", 10, restaurant, burgerCategory)
    Product.add("Hickory Burger", "Topped with cheddar, hickory smoked bacon and smoked barbecue sauce", 10, restaurant, burgerCategory)
    Product.add("Chicken Burger", "Grilled chicken breast with heirloom tomatoes, avocado and sprouts on a home-baked roll", 9, restaurant, burgerCategory)

    saladCategory = Category.add("Salads", restaurant)
    Product.add("Caesar Salad", "Romaine, fresh parmesan, seasoned croutons and black pepper with garlic anchovy dressing", 6.75, restaurant, saladCategory)
    Product.add("Red Iceberg Salad", "With sweet corn, blackberries, goat cheese and fresh basil", 9.25, restaurant, saladCategory)
    Product.add("House Salad", "With green olives, green peppers, onions, cucumbers, and tomato", 6.75, restaurant, saladCategory)
    Product.add("Blue Chicken Salad", "Mesclun greens, apple, grilled chicken, gorgonzola, chesse and balsamic vinagrette", 9.25, restaurant, saladCategory)

    # Add an user for the restaurant we just created
    User.add("restaurant1", "restaurant1", 0, restaurant)

    streets = ["Oak Street", "Madison Avenue", "Bridle Lane", "Jefferson Street", "Lafayette Avenue", "Grove Street", "Chestnut Avenue"]

    # Simulate some orders on a different client
    originalDate = time.time() - 57600000
    for i in range(87):
        productCount = randint(1, 2)
        used = {}
        products = []
        price = 0

        originalDate += randint(376000, 576000)

        for y in range(productCount):
            id = randint(0, 11)
            while (id in used):
               id = randint(0, 11)

            used[id] = True
            amount = randint(1, 2)
            products.append({"id":id + 1, "count":amount})
            product = Product.get_from_id(id + 1)
            price += amount * product.price

        order = Order.add(random.choice(streets) + " " + str(randint(1, 5000)), price, "", products, [-34.601874, -58.432611], testClient2, restaurant)
        order.date = originalDate
        order.status = 2
        get_session().commit()

    Order.add("Bridle Lane 1775", 9.50, "", [{'id':1, 'count':1}], [-34.601874, -58.432611], testClient, restaurant)

