var express = require('express');
var app = express();
var mongoUtil = require('./mongoUtils');

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/../client')); //Static route for client side
app.use('/vendor', express.static(__dirname + '/../node_modules/')); //Static Route for node_modules


module.exports = app;