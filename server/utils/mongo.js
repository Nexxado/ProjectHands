/**
 * The matter of mongoUtils is to provide CRUD methods towards the DB such:
 * 1- insert
 * 2- update
 * 3- delete
 * 4- query
 */


var MongoClient = require('mongodb').MongoClient;
var _db;

var debug = require('debug')('mongoUtils');


module.exports = {
    connect: function (url) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                debug("Error connecting to Mongo: ", err);
                return;
            }
            debug("connected to Mongo");
            _db = db;
        });
    },


    /**
     * @param collectionName : the name of the wanted collection
     * */
    getCollection(collectionName)
    {
        return _db.collection(collectionName);


    },

    /**
     * Insert data into collection
     * @param collectionName : the collection the data exists in
     * @param data : the data to be inserted to that collection
     * callback will be executed when finish , and with null if any errors
     * */
    insert(collectionName,data,callback)
    {
        _db.collection(collectionName).insert(data,function(error,result)
        {
            if(error)
            {
                // debug(error);
                callback(null);

            }
            else
            {
                debug('Inserted %d document into the %s collection. The document inserted is ', result.insertedCount,collectionName , result);
                callback(result);
            }

        });

    },
    /**
     * update data in the collection
     * @param collectionName : the collection the data exists in
     * @param query : the search criteria
     * @param updatedData : the new data to be replaced by yjr new data, {$set:{THE DATA}} to update and not to override
     * @param options : check mongo update options
     * callback will be executed when finish , and with null if any errors
     * */
    update(collectionName ,query, updatedData, options, callback)
    {
        _db.collection(collectionName).update(query, updatedData, options, function (error, result) {
            if (error)
            {
                debug(error);
                callback(null);
                return;
            }
            else if (result)
            {
                debug('Updated Successfully %d document(s).', result.result.n );
            } else
            {
                debug('No document found with defined "find" criteria!');

            }
            callback(result);

        });

    },
    /**
     * delete data from collection
     * @param collectionName : the collection the data exists in
     * @param query : the search criteria
     * callback will be executed when finish , and with null if any errors
     * */
    delete(collectionName,query,callback)
    {
        _db.collection(collectionName).remove(query ,function (error,result)
        {
            if(error)
            {
                debug(error);
                callback(null);

            }
            else
            {
                debug("Removed  %d doc(s)",result.result.n);
                callback(result);
            }


        });

    },
    /**
     * get data from collection
     * @param collectionName : the collection the data exists in
     * @param query : the search criteria
     * @param callback : method that will be executed when data is retrieved
     * callback will be executed when finish , and with null if any errors
     * */
    query(collectionName,query,callback)
    {
        _db.collection(collectionName).find(query).toArray(function (error,result)
        {
            if(error)
            {
                debug(error);
                callback(null);
            }
            else
            {
                debug("The result is : ",result);
                callback(result);
            }
        });
    }




};
