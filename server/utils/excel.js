var xlsx =require("node-xlsx")
var fs = require("fs");
var mongoUtils = require('./mongo');

/**
 * The matter of the util is to provide a way to export and import data as excel format
 * */

/** for local testing
 * To be removed
 * */
exportCollection("users",{});

/**
 * Exports a collection for the DB as excel sheet
 *
 * @param collectionName : the name of the wanted collection to export
 * @param query : the wanted data to export
 * @example : exportCollection("users",{});
 */
function exportCollection(collectionName,query)
{
    /** for local testing
     * To be removed
     * */
    mongoUtils.connect("mongodb://127.0.0.1:27017/hands")
    setTimeout(function() {
        mongoUtils.query("users",query,function (error,result) {
            if(!error && result.length>0)
            {
                /** the excel sheet data*/
                var body = [];
                /** the cols names*/
                var headers = Object.keys(result[0]); // TODO : how to get all the headers names
                body.push(headers);
                /** filling the rows*/
                for (var i = 0; i < result.length; i++) {
                    var row = [];
                    for(var j = 0; j < headers.length; j++)
                    {
                        row.push((result[i])[headers[j]]);
                    }
                    body.push(row);
                }
                /** writing the file*/
                var buffer = xlsx.build([{name: collectionName, data: body}]); // Returns a buffer
                var writer = fs.createWriteStream(collectionName+'.xlsx');
                writer.write(buffer);
                writer.end();
                console.log("done writing");
            }

        });
    }, 2000);

}

module.exports = {

exportCollection:exportCollection,
importCollection:function(collectionName,query)
{

}

}
