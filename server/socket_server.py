from flask_socketio import SocketIO, emit
from routes import app
from models.client import Client
from models.category import Category
from models.orders import Order
from models.product import Product
from models.restaurants import Restaurant
from models.user import User
import json
import time
from flask import request, abort
from flask_jsonpify import jsonify
from random import randint

socketio = SocketIO(app)
socketIds = {}

def run_socket_server():
    socketio.run(app, port=1337)

def get_client():
    if (request.sid in socketIds.keys()):
        return Client.get_from_token(socketIds[request.sid])

def get_user():
    if (request.sid in socketIds.keys()):
        return User.get_from_token(socketIds[request.sid])

def get_sockets_from_token(token):
    ret = []

    for key in socketIds:
        if (socketIds[key] == token):
            ret.append(key)

    return ret
    
@socketio.on('disconnect')
def disconnect():
    if (request.sid in socketIds.keys()):
        del socketIds[request.sid]

@socketio.on('connect')
def connect():
    print("connected")
    socketio.emit("connect",{}, room=request.sid)

@socketio.on('login')
def login(token):
    print(str(token) + " adfadf")
    client = Client.get_from_token(token)
    user = User.get_from_token(token)

    if (client or user):
        request.token = token
        socketIds[request.sid] = token

@socketio.on('send_message')
def get_messages(data):
    client = get_client()
    user = get_user()
    orderId = data["orderId"]
    message = data["message"]

    if ((client or user) and isinstance(orderId, int) and message and len(message) <= 100):
        order = Order.get_from_id(orderId)

        if (order and ((client and order.client_id == client.id) or (user and order.restaurant_id == user.restaurant_id))):
            restaurant = Restaurant.get_from_id(order.restaurant_id)

            if (restaurant):
                if (order.status != 2 and order.status != -1):
                    order.add_chat(message, True if client else False)
                    pushMessages(client, restaurant, order)

def pushMessages(client, restaurant, order):
    if (not client):
        client = Client.get_from_id(order.client_id)

    sockets = []

    sockets.extend(get_sockets_from_token(client.token))

    for user in restaurant.get_users():
        sockets.extend(get_sockets_from_token(user.token))

    for socket in sockets:
        socketio.emit("push_messages", {"messages":order.get_chat(), "orderId":order.id}, room=socket)

@socketio.on('get_messages')
def get_messages(orderId):
    client = get_client()
    user = get_user()

    if ((client or user) and isinstance(orderId, int)):
        order = Order.get_from_id(orderId)

        if (order and ((client and order.client_id == client.id) or (user and order.restaurant_id == user.restaurant_id))):
            socketio.emit("push_messages", {"messages":order.get_chat(), "orderId":order.id}, room=request.sid)