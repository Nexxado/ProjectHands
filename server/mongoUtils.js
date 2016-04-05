var MongoClient = require('mongodb').MongoClient;
var config = require('../config.json');
var _db;

var url = process.env.MONGODB_URL || config.mongoDBUrl;

module.exports = {
    connect: function () {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log("Error connecting to Mongo: ", err);
                return;
            }
            console.log("connected to Mongo");
            _db = db;
        });
    },
    renovations: function () {
        return _db.collection('renovations');
    },
    users: function () {
        return _db.collection('users');
    },
    chats: function () {
        return _db.collection('chats');
    },
    teams: function () {
        return _db.collection('teams');
    }
};
