import random
import string
import time
import json
from flask import request, abort

def sleepTime():
    time.sleep(0)

def get_header(name):
    if (name in request.headers):
        return request.headers[name]
    else:
        return None

def get_header_int(name):
    value = get_header(name)

    if (value is not None and is_int(value)):
        return int(value)

def get_header_float(name):
    value = get_header(name)

    if (value is not None and is_float(value)):
        return float(value)

def get_header_json(name):
    return json.loads(get_header(name))

def get_client():
    from models.client import Client
    token = get_header("token")
    if (token):
        return Client.get_from_token(token)

    return None

def get_user():
    from models.user import User
    token = get_header("token")
    if (token):
        return User.get_from_token(token)

    return None

def is_int(value):
    if (value == None):
        return None

    try:
        val = int(value)

        return True
    except ValueError:
        return None

def is_float(value):
    if (value == None):
        return None

    try:
        val = float(value)

        return True
    except ValueError:
        return None

def get_random_string(size=64, chars=string.ascii_uppercase + string.digits + string.ascii_lowercase):
    return ''.join(random.choice(chars) for x in range(size))