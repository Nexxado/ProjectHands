var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/../client')); //Static route for client side
app.use('/vendor', express.static(__dirname + '/../node_modules/')); //Static Route for node_modules
app.use('/api/database', require('./routes/database'));
app.use('/api/user', require('./routes/user'));



app.io = require('./socketio');
module.exports = app;
