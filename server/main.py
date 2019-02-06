#!/usr/bin/env python3
from flask import Flask
from flask_restful import Api
from routes import app
from flask_cors import CORS
from socket_server import run_socket_server
import database
import random

if __name__ == '__main__':
    random.seed(3)
    api = Api(app)
    CORS(app)

    database.setup()
    #api.add_resource(Employees_Name, '/employees/<employee_id>')

    app.run(host = '0.0.0.0', port='1337', debug=True, use_reloader=False)
