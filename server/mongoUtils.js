var MongoClient = require('mongodb').MongoClient;
var config = require('../config.json');
var _db;

var url = process.env.MONGODB_URL || config.mongoDBUrl;

module.exports = {
    connect() {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log("Error connecting to Mongo: ", err);
                return;
            }
            console.log("connected to Mongo");
            _db = db;
        });
    },
    renovations() {
        return _db.collection('renovations');
    },
    users() {
        return _db.collection('users');
    },
    chat() {
        return _db.collection('chat');
    }
};
