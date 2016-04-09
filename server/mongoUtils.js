var MongoClient = require('mongodb').MongoClient;
var config = require('../config.json');
var assert = require('assert');

var _db;

var url = process.env.MONGODB_URL || config.mongoDBUrl;
/*
 // to get A ref for the collection
 function collection(collectionName)
 {
 _db.collection(collectionName,{},function (error,collection)
 {
 if(error)
 {
 console.log("No such collection");
 assert.equal(null,error);
 }
 else
 {
 return collection;

 }

 });

 }*/


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
                // console.log(error);
                callback(null);

            }
            else
            {
                console.log('Inserted %d document into the %s collection. The document inserted is ', result.insertedCount,collectionName , result);
                callback(result);
            }

        });

    },
    /**
     * update data in the collection
     * @param collectionName : the collection the data exists in
     * @param query : the search criteria
     * @param updatedData : the new data to be replaced by
     * @param isUpdateAll : true to update all the matches , false to update the first match
     * callback will be executed when finish , and with null if any errors
     * */
    update(collectionName,query,isUpdateAll,updatedData,callback)
    {
        _db.collection(collectionName).update(query, {$set: updatedData},{multi : isUpdateAll}, function (error, result) {
            if (error)
            {
                console.log(error);
                callback(null);
                return;
            }
            else if (result)
            {
                console.log('Updated Successfully %d document(s).', result.result.n );
            } else
            {
                console.log('No document found with defined "find" criteria!');

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
                console.log(error);
                callback(null);

            }
            else
            {
                console.log("Removed  %d doc(s)",result.result.n);
                callback(result);
            }


        })

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
                console.log(error);
                callback(null);
            }
            else
            {
                console.log("The result is : ",result);
                callback(result);
            }
        })

    }




};
