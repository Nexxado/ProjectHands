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
     * */
    insert(collectionName,data)
    {
        _db.collection(collectionName).insert(data,function(error,result)
        {
            if(error)
            {
               // console.log(error);
                return error;

            }
            else
            {
                console.log('Inserted %d document into the %s collection. The document inserted is ', result.insertedCount,collectionName , result);
            }

        });

    },
    /**
     * update data in the collection
     * @param collectionName : the collection the data exists in
     * @param query : the search criteria
     * @param updatedData : the new data to be replaced by
     * @isUpdateAll : true to update all the matches , false to update the first match
     * */
    update(collectionName,query,updatedData,isUpdateAll)
    {
        _db.collection(collectionName).update(query, {$set: updatedData},{multi : isUpdateAll}, function (error, numUpdated) {
            if (error) {
                console.log(error);
            } else if (numUpdated) {
                console.log('Updated Successfully %d document(s).', numUpdated.result.n );
            } else {
                console.log('No document found with defined "find" criteria!');
            }

        });

    },
    /**
     * @param collectionName : the collection the data exists in
     * @param query : the search criteria
     * */
    delete(collectionName,query)
    {
        _db.collection(collectionName).remove(query ,!isDeleteAll,function (error,result)
        {
            if(error)
            {
                console.log(error);
            }
            else
            {
                console.log("Removed  %d doc(s)",result.result.n);
            }


        })

    }



};
