# Ese Pedidos

### DISCLAIMER: This project was meant to go live in my city, as there's nothing similar there. Due to personal issues I was unable to do this. Therefore, I decided to upload it to GitHub so it wouldn't go to waste.

This project is meant to facilitate ordering food from restaurants. Instead of calling or texting a specific number for ordering food you have an app with a list of restaurants to choose from.

# How would it work?

There are 2 apps, one is for the clients and the other one is for the restaurants.

On the clients app, you will be presented with a choice of restaurants. After picking one, you can then select what food you will order and the delivery destination. Upon issuing an order. it will be marked as 'Pending', this means you have to to wait until the restaurant processes (i.e, confirms) your order.

Once your order is confirmed by the restaurant, you only have to wait for it to be delivered to the location you specified earlier. The payment is made when the order arrives.

# Frameworks Used

Frontend:

Angular 4\
SocketIO\
Ionic 2\
Flask\
Flask SocketIO\
SQLAlchemy\

# Live Demo

[Clients App][http://siwka.net/ese-pedidos/client]\
[Restaurants App][http://siwka.net/ese-pedidos/restaurant]

# Things that don't work / TODO

## Phone verification
Since this is a paid service and there are many providers with different implementations, I decided to skip this. So you can just log in with any phone number as if it was a separate client account.

## Changing the logo of a restaurant (TODO)

# Building


