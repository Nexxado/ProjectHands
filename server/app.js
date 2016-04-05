var express = require('express');
var app = express();
var mongoUtil = require('./mongoUtils');


app.use(express.static(__dirname + '/../client')); //Static route for client side
app.use('/vendor', express.static(__dirname + '/../node_modules/')); //Static Route for node_modules


app.io = require('./socketio');
module.exports = app;
