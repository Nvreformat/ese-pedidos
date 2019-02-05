# Ese Pedidos

##### DISCLAIMER: This project was meant to go live in my city, as there's nothing similar there. Due to personal issues I was unable to do this. Therefore I decided to upload it to GitHub so it wouldn't go to waste. It is NOT intended to be a general purpose solution, it was something that made sense under a very specific context (a small city).

This project is meant to ease the process of ordering food from restaurants. Instead of calling or texting a specific number for ordering food you get an app with a list of restaurants to choose from.

### This has some advantages:
* You don't need to have as many restaurant numbers in your contact list. In fact, you don't need to have any numbers at all.
* You get the full restaurant menu, with descriptions of foods and prices.
* You can order from restaurants you didn't know of, trying new food.
* Theoretically, since phone numbers are verified, you (as a restaurant) have the possiblity to ban numbers that make fake orders

# How would it work?

There are 2 apps, one for the clients and another one for the restaurants.

On the clients app, you will be presented with a choice of restaurants. After picking one, you can then select what food you will order and the delivery destination. Upon issuing an order. it will be marked as 'Pending', this means you have to to wait until the restaurant processes (i.e, confirms) your order.

When the restaurant sees your order, it will verify that it's valid (i.e you didn't order +100 units of the same kind and have a valid delivery address) and then will mark your order as 'Confirmed'.

Now, you only have to wait for it to be delivered to the location you specified earlier. The payment is made when the order arrives and the order is marked as 'Finished'.

# Features

### Location on map
Aside from the address, the clients are required to submit a delivery location when issuing an order. This is easily done with the Maps API, it only takes a few taps.\
In the city I wanted to implement this, finding a place only by address can sometimes be... tricky. By attaching a location to the order, we can make the delivery process more efficient.

### Chat
When you make an order, a chat between the client and the restaurant is created. This chat is specific to the order.\
This is useful when a restaurant can't deliver an order on time. This way, they can tell the client how long they have to wait for their order.\
Another use case is that sometimes they may be missing a specific ingredient for the food, in which case they can tell the client if they want to continue the order or cancel it altogether.

### Restaurant Fees
My idea for monetizing this project was to charge restaurants a small fee (say 5%) on every order. At the end of every month I would go personally to each restaurant to collect the fees that were charged.\
Every restaurant has a stats page where they can see how much fees they have to pay. They also have a record of all the orders they had, allowing them to check their if the fees actually match the orders.

# Frameworks Used

### Frontend:

Angular 4\
SocketIO\
Ionic 2\
Google Maps JS

### Backend:

Flask\
Flask SocketIO\
SQLAlchemy\
MariaDB (on live demo server)

# Live Demo

[Clients App](http://siwka.net/ese-pedidos/client)\
[Restaurants App](http://siwka.net/ese-pedidos/restaurant)

# Things that don't work

## Phone verification
I originally intended to send an SMS with a code to the phone being verified and make the user enter this code on the app. Since sending SMS is a paid service and there are many providers with different implementations, I decided to skip this. This means you can just log in with any phone number and it will work as if it was a different client account. You'll have to implement this yourself.

## Changing the logo of a restaurant
TODO

# Building
### Client/Restaurant Apps
First, make sure you have npm installed.

Install cordova and ionic
>sudo npm -g install cordova ionic

Put your Maps API key on src/index.html of each project:
><script src="https://maps.googleapis.com/maps/api/js?key=YourAPIKey&callback=initMap"async defer></script>

Then just go to any app folder (either client or restaurant) and run this command to build and test:
>ionic serve --lab

NOTE: The first build may take a few minutes as ionic downloads dependencies, so be patient.

### Server
Install python dependencies:
>pip3 install flask flask_restful flask_socketio flask_cors flask_jsonpify mysqlclient sqlalchemy passlib 

Next, enter your DB info in config.ini:\
>[Database]\
Host = host\
database = dbname\
username = user\
password = pass

Run the server:
> python3 main.py




