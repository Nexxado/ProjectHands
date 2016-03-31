var MongoClient = require('mongodb').MongoClient;
var config = require('../config.json');
var _db;



module.exports = {
    connect() {
        MongoClient.connect(config.mongoDBUrl, function (err, db) {
            if (err) {
                console.log("Error connecting to Mongo: ", err);
                process.exit(1);
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
