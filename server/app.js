var express = require('express');
var app = express();
var io = require('socket.io')();
var mongoUtil = require('./mongoUtils');

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/../client')); //Static route for client side
app.use('/vendor', express.static(__dirname + '/../node_modules/')); //Static Route for node_modules


io.on("connection", function (socket) {
    console.log("A user connected");
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});




app.io = io;
module.exports = app;
