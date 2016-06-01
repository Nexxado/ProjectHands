/**
 * The matter of mongoUtils is to provide CRUD methods towards the DB such:
 * 1- insert
 * 2- update
 * 3- delete
 * 4- query
 */


var MongoClient = require('mongodb').MongoClient;
var debug = require('debug')('mongoUtils');
var COLLECTIONS = require('../../config.json').COLLECTIONS;
var _db;

function ensureConstraints() {

    _db.collection(COLLECTIONS.SIGNUPS).ensureIndex({createdAt: 1},
        {expireAfterSeconds: 86400}, // 24 hours
        function (error, indexName) {
            debug('SignUp Expire indexName', indexName);
            debug('SignUp Expire error', error);
        });

    _db.collection(COLLECTIONS.USERS).ensureIndex({phone: 1, email: 1},
        {unique: true, sparse: true},
        function (error, indexName) {
            debug('Users indexName', indexName);
            debug('Users error', error);
        });

    _db.collection(COLLECTIONS.TEAMS).ensureIndex({name: 1},
        {unique: true, sparse: true},
        function (error, indexName) {
            debug('Teams indexName', indexName);
            debug('Teams error', error);
        });
}


module.exports = {
    /**
     * Connect to MongoDB
     * @param url {string}
     */
    connect: function (url) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                debug("Error connecting to Mongo: ", err);
                process.exit();
            }
            debug("connected to Mongo");
            _db = db;
            ensureConstraints();
        });
    },


    /**
     * @param collectionName {string} : the name of the wanted collection
     * */
    getCollection: function (collectionName) {
        return _db.collection(collectionName);
    },

    /**
     * Insert data into collection
     * @param collectionName {string}  : the collection the data exists in
     * @param data {object} : the data to be inserted to that collection
     * @param callback {function}
     * callback will be executed when finish , and with null if any errors
     * */
    insert: function (collectionName, data, callback) {
        _db.collection(collectionName).insert(data, function (error, result) {
            if (error) {
                debug('error', error);
                callback(error, result);

            }
            else {
                debug('Inserted %d document into the %s collection. The document inserted is ', result.insertedCount, collectionName, result);
                callback(error, result);
            }

        });

    },
    /**
     * update data in the collection
     * @param collectionName {string} : collection the data exists in
     * @param query {object} : database search criteria
     * @param updatedData {object} : new data to be replaced by yjr new data, {$set:{THE DATA}} to update and not to override
     * @param options {object} : according to MongoDB update options, such as: upsert, multi, writeConcern
     * @param callback {function}
     * callback will be executed when finish , and with null if any errors
     * */
    update: function (collectionName, query, updatedData, options, callback) {
        _db.collection(collectionName).update(query, updatedData, options, function (error, result) {
            if (error) {
                debug(error);
                callback(error, result);
                return;
            }
            else if (result) {
                debug('Updated Successfully %d document(s).', result.result.n);
            } else {
                debug('No document found with defined "find" criteria!');

            }
            callback(error, result);

        });

    },
    /**
     * delete data from collection
     * @param collectionName {string} : the collection the data exists in
     * @param query {object} : search criteria
     * @param callback {function}
     * callback will be executed when finish , and with null if any errors
     * */
    delete: function (collectionName, query, callback) {
        _db.collection(collectionName).remove(query, function (error, result) {
            if (error) {
                debug(error);
                callback(error, result);

            }
            else {
                debug("Removed  %d doc(s)", result.result.n);
                callback(error, result);
            }


        });

    },
    /**
     * get data from collection
     * @param collectionName {string} : the collection the data exists in
     * @param query {object} : the search criteria
     * @param callback {function} : method that will be executed when data is retrieved
     * callback will be executed when finish , and with null if any errors
     * */
    query: function (collectionName, query, callback) {
        _db.collection(collectionName).find(query).toArray(function (error, result) {
            if (error) {
                debug(error);
                callback(error, result);
            }
            else {
                debug("The result is : ", result);
                callback(error, result);
            }
        });
    }


};
