from flask_restful import Resource
from flask_jsonpify import jsonify
from flask import request, abort
from database import get_session
from flask import Flask
from passlib.hash import pbkdf2_sha256
from models.client import Client
from models.category import Category
from models.orders import Order
from models.product import Product
from models.restaurants import Restaurant
from models.user import User
from util import *
import datetime
import time
import json

app = Flask(__name__)

@app.route("/clients/verify_phone")
def verify_phone():
    number = get_header("number")

    if (number):
        client = Client.get_from_number(number)

        if (client):
            return jsonify({"token" : client.token})
        else:
            return jsonify({"token" : Client.add(number).token})
    else:
        abort(400)

@app.route("/clients/cancel_order")
def cancel_order():
    client = get_client()

    if (client):
        orderId = get_header_int("orderId")

        if (orderId):
            order = Order.get_from_id(orderId)

            if (order):
                if (order.status != 2 and order.status != -1):
                    if (order.client_id == client.id):
                        order.status = -1
                        get_session().commit()

                        return "true"
                    else:
                        abort(401)
                else:
                    abort(401)
            else:
                abort(404)
        else:
            abort(400)
    else:
        abort(401)

@app.route("/clients/create_order")
def create_order():
    client = get_client()

    if (client):
        restaurantId = get_header_int("restaurantId")
        address = get_header("address")
        comments = get_header("comments")
        coords = json.loads(get_header("coords"))
        products = json.loads(get_header("products"))

        if (restaurantId and address and products):
            if (len(products) > 0):
                price = 0

                for productData in products:
                    product = Product.get_from_id(productData["id"])

                    if (product):
                        price = price + (product.price * productData["count"])
                    else:
                        abort(402)

                restaurant = Restaurant.get_from_id(restaurantId)

                if (restaurant):
                    order = Order.add(address, price, comments, products, coords, client, restaurant)

                    if (order):
                        return "true"
                    else:
                        abort(402)
                else:
                    abort(404)
            else:
                abort(401)
        else:
            abort(400)
    else:
        abort(401)

@app.route("/clients/get_data")
def get_data():
    client = get_client()

    if (client):
        response = {}

        if (get_header("orders")):
            clientOrders = Order.get_from_client(client)
            response["orders"] = []

            for clientOrder in clientOrders:
                response["orders"].append(get_order_data(clientOrder))

            response["orders"].reverse()

        if (get_header("restaurants")):
            restaurants = Restaurant.get_all()
            response["restaurants"] = []

            for restaurant in restaurants:
                response["restaurants"].append(get_restaurant_data(restaurant))

        return jsonify(response)
    else:
        abort(401)

@app.route("/restaurants/auth")
def auth():
    username = get_header("username")
    password = get_header("password")

    if (username and password):
        user = User.get_from_name_password(username, password)

        if (user):
            return jsonify({"token" : user.token})
        else:
            abort(401)
    else:
        abort(400)

def get_order_restaurant(user):
    orderId = get_header_int("orderId")

    if (is_int(orderId)):
        order = Order.get_from_id(orderId)

        if (order):
            if (order.restaurant_id == user.restaurant_id):
                return order


@app.route("/restaurants/add_update_product")
def restaurant_add_update_product():
    user = get_user()     

    if (user):
        restaurant = Restaurant.get_from_id(user.restaurant_id)

        if (restaurant):
            name = get_header("name")
            description = get_header("description")
            price = get_header_float("price")
            id = get_header_int("id")

            
            if (is_int(id)):
                product = Product.get_from_id(id)

                if (product):
                    if (get_header("remove")):
                        product.remove()
                    else:
                        if (name and description and is_float(price) and len(name) <= 50 and len(description) <= 100):
                            product.name = name
                            product.description = description
                            product.price = price
                            get_session().commit()
                        else:
                            abort(400)

                    return "true"
                else:
                    abort(404)
            else:
                categoryId = get_header_int("category")
                    
                if (is_int(categoryId) and len(name) <= 50 and len(description) <= 100):
                    category = Category.get_from_id(restaurant, categoryId)

                    if (category):
                        Product.add(name, description, price, restaurant, category)

                        return "true"
                    else:
                        abort(404)
                else:
                    abort(400) 
            
        else:
            abort(404)
    else:
        abort(404)

@app.route("/restaurants/add_update_category")
def restaurant_add_update_category():
    user = get_user()     

    if (user):
        restaurant = Restaurant.get_from_id(user.restaurant_id)

        if (restaurant):
            name = get_header("name")
            id = get_header_int("id")
    
            if (name and len(name) <= 50):
                if (is_int(id)):
                    category = Category.get_from_id(restaurant, id)

                    if (category):
                        if (get_header("remove")):
                            category.remove()
                        else:
                            category.name = name
                            get_session().commit()

                        return "true"
                    else:
                        abort(404)
                else:
                    Category.add(name, restaurant)

                    return "true"
            else:
                abort(400)
            
        else:
            abort(404)
    else:
        abort(404)

@app.route("/restaurants/update_profile")
def restaurant_update_profile():
    user = get_user()     

    if (user):
        restaurant = Restaurant.get_from_id(user.restaurant_id)

        if (restaurant):
            name = get_header("name")
            description = get_header("description")

            if (name and len(name) <= 50 and description and len(description) <= 100):
                restaurant.name = name
                restaurant.description = description

                get_session().commit()

                return "true"
            else:
                abort(400)
        else:
            abort(404)
    else:
        abort(404)

@app.route("/restaurants/get_stats")
def restaurant_get_stats():
    user = get_user()     

    if (user):
        restaurant = Restaurant.get_from_id(user.restaurant_id)

        if (restaurant):
            orders = Order.get_from_restaurant(restaurant)
            date = datetime.date.today()
            resp = {
                "stats": {
                    "paidFees": restaurant.paid_fees,
                    "month": {
                        'orderCount': 0,
                        'grossIncome': 0,
                        'fee': 0,
                        'netIncome': 0,
                    },
                    "all": {
                        'orderCount': 0,
                        'grossIncome': 0,
                        'fee': 0,
                        'netIncome': 0,
                    },
                }
            }

            for order in orders:
                if (order.status == 2):
                    orderDate = datetime.date.fromtimestamp(order.date)

                    resp["stats"]["all"]["orderCount"] += 1
                    resp["stats"]["all"]["grossIncome"] += order.price
                    resp["stats"]["all"]["fee"] += order.fee
                    resp["stats"]["all"]["netIncome"] += (order.price - order.fee)

                    if (orderDate.month == date.month and orderDate.year == date.year):
                        resp["stats"]["month"]["orderCount"] += 1
                        resp["stats"]["month"]["grossIncome"] += order.price
                        resp["stats"]["month"]["fee"] += order.fee
                        resp["stats"]["month"]["netIncome"] += (order.price - order.fee)

            return jsonify(resp)
        else:
            abort(404)
    else:
        abort(401)           

@app.route("/restaurants/finish_order")
def restaurant_finish_order():
    user = get_user() 

    if (user):
        order = get_order_restaurant(user)

        if (order):
            if (order.status == 1):
                order.status = 2
                get_session().commit()

                return "true"
            else:
                abort(401)
        else:
            abort(404)
    else:
        abort(401)

@app.route("/restaurants/confirm_order")
def restaurant_confirm_order():
    user = get_user() 

    if (user):
        order = get_order_restaurant(user)

        if (order):
            if (order.status == 0):
                order.status = 1
                get_session().commit()

                return "true"
            else:
                abort(401)
        else:
            abort(404)
    else:
        abort(401)

@app.route("/restaurants/cancel_order")
def restaurant_cancel_order():
    user = get_user() 

    if (user):
        order = get_order_restaurant(user)

        if (order):
            if (order.status >= 0 and order.status < 2):
                order.status = -1
                get_session().commit()

                return "true"
            else:
                abort(401)
        else:
            abort(404)
    else:
        abort(401)

@app.route("/restaurants/get_my_restaurant")
def get_my_restaurant():
    user = get_user() 

    if (user):
        restaurant = Restaurant.get_from_id(user.restaurant_id)

        if (restaurant):
            response = {}
            response["restaurant"] = get_restaurant_data(restaurant)
            
            return jsonify(response)
        else:
            abort(404)
    else:
        abort(400)

@app.route("/restaurants/get_orders")
def get_orders():
    user = get_user() 
    filters = get_header_json("orderType")

    if (user and filters):
        restaurant = Restaurant.get_from_id(user.restaurant_id)

        if (restaurant):
            response = {}
            response["orders"] = []
            restaurantOrders = Order.get_from_restaurant(restaurant)

            for restaurantOrder in restaurantOrders:
                if (restaurantOrder.status in filters):
                    response["orders"].append(get_order_data(restaurantOrder))

            response["orders"].reverse()

            response["restaurant"] = get_restaurant_data(restaurant)
            
            return jsonify(response)
        else:
            abort(404)
    else:
        abort(400)


def get_restaurant_data(restaurant):
    rest = {}
    rest["id"] = restaurant.id
    rest["name"] = restaurant.name
    rest["description"] = restaurant.description
    rest["menu"] = []

    categories = Category.get_from_restaurant(restaurant)

    for category in categories:
        cat = {}
        cat["id"] = category.id
        cat["name"] = category.name
        cat["products"] = []

        products = Product.get_from_category(category)

        for product in products:
            prod = {}
            prod["id"] = product.id
            prod["name"] = product.name
            prod["description"] = product.description
            prod["price"] = product.price

            cat["products"].append(prod)

        rest["menu"].append(cat)

    return rest

def get_order_data(restaurantOrder):
    order = {}
    order["id"] = restaurantOrder.id
    order["restaurantId"] = restaurantOrder.restaurant_id
    order["address"] = restaurantOrder.address
    order["price"] = restaurantOrder.price
    order["status"] = restaurantOrder.status
    order["location"] = [restaurantOrder.latitude, restaurantOrder.longitude]
    order["comments"] = restaurantOrder.comments
    order["minutesSinceOrdered"] = int((time.time() - restaurantOrder.date) / 60)
    order["date"] = restaurantOrder.date
    order["products"] = restaurantOrder.get_products()
    order["chat"] = restaurantOrder.get_chat()
    order["fee"] = restaurantOrder.fee

    return order

@app.before_request
def before_request():
    sleepTime()

@app.after_request
def after_request(response):
    if (hasattr(request, "session")):
        request.session.close()

    return response