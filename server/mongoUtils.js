var MongoClient = require('mongodb').MongoClient;
var _db;

module.exports = {
    connect: function (url) {
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
