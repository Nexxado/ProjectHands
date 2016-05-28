var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var config = require('../config.json');

app.use(express.static(__dirname + '/../client')); //Static route for client side
app.use('/vendor', express.static(__dirname + '/../node_modules/')); //Static Route for node_modules

app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || config.SECRETS.sessionSecret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

require('./passport')(passport);


app.use('/api/database', require('./routes/database'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/photos', require('./routes/photos'));


//Fix express rewrites since UI Router is in html5Mode
app.all('*', function (request, response, next) {
    // Just send the index.html for other files to support HTML5Mode
    response.sendFile('index.html', {root: __dirname + '/../client'});
});


//Redirect any unmatched urls (404 Not Found). keep this as the last app.use()
app.use(function (request, response) {
    response.redirect('/');
});

app.io = require('./socketio');

module.exports = app;
