var xlsx =require("node-xlsx")
var fs = require("fs");
var mongoUtils = require('./mongo');
var debug = require('debug')('utils/excel');

const HeadersRow = 3;


/**
 * The matter of the util is to provide a way to export and import data as excel format
 * */

/** for local testing
 * To be removed
 * */
//exportCollection("users",{});
mongoUtils.connect("mongodb://127.0.0.1:27017/hands");
setTimeout(function() {
importWorkBook("table.xlsx");},3000);

/**
 * Fills unKnown in each cell where date is missing
 * @param sheets : the workbook sheets
 * @param sheetIndex : the number of being processed sheet
 * @param rowIndex : the number of being processed row
 * @param numberOfHeaders : total length of each row
 */
function fillMissingData(sheets, sheetIndex, rowIndex , numberOfHeaders) {
    for (var k = 0; k < numberOfHeaders; k++) {
        if (sheets[sheetIndex].data[rowIndex][k] === undefined) {
            sheets[sheetIndex].data[rowIndex][k] = "UnKnown";
        }
    }
}
function importWorkBook(workBooPath,callback) {
    /**
     * Format :
     * the headers in row 4
     * data start from row 5
     *
     * */
    const sheets = xlsx.parse(workBooPath);
    var sheetsFaildToImportName = "";
    /** the first sheet not needed */
    for (var i = 1; i < sheets.length; i++)
    {
        var sheetName = sheets[i].name;
        var headers = sheets[i].data[HeadersRow];
        var dataToBeInserted =[];
        var collectionName="";
        switch (sheetName)
        {
            case "תרומות" :
                collectionName = "donations";
                /**  donatorId	donatorName<ignored>	dateFrom	dateTo	amount	overallTotal	type	paymentMethod */
                for(var j =HeadersRow+1 ; j < sheets[i].data.length;j++)
                   {
                       /** we check if we have ref id for the donator*/
                       var donatorId = sheets[i].data[j][0];
                       if(donatorId === undefined)
                           continue;
                        fillMissingData(sheets, i, j,headers.length);
                       dataToBeInserted.push({donatorId:donatorId,
                           dateFrom:sheets[i].data[j][2],
                           dateTo:sheets[i].data[j][3],
                           amount:sheets[i].data[j][4],
                           overallTotal:sheets[i].data[j][5],
                           type:sheets[i].data[j][6],
                           paymentMethod:sheets[i].data[j][7],

                       });
                   }
                break;
            case "תורמים" :
                /**_id	name	address	  phone 	email */
                collectionName = "donators";
                /** we check if we have donator has id */
                for(var j =HeadersRow+1 ; j < sheets[i].data.length;j++) {
                    var donatorId = sheets[i].data[j][0];
                    if (donatorId === undefined)
                        continue;
                    fillMissingData(sheets, i, j, headers.length);
                    dataToBeInserted.push({
                        _id: donatorId,
                        name: sheets[i].data[j][1],
                        address: sheets[i].data[j][2],
                        phone: sheets[i].data[j][3],
                        email: sheets[i].data[j][4]

                    });
                }
    
                break;
            case "מתנדבים" :
                /** volunteerNo	lastName	firstName	phone	address<ignored>	email	crewNo	job */
                collectionName="volunteers";
                for(var j =HeadersRow+1 ; j < sheets[i].data.length;j++) {
                    var volunteerId = sheets[i].data[j][5];
                    /** we check if we have volunteer has id<which is email> */
                    if (volunteerId === undefined)
                        continue;
                    fillMissingData(sheets, i, j, headers.length);
                    dataToBeInserted.push({
                        _id: volunteerId,
                        volunteerNo:sheets[i].data[j][0],
                        firstName: sheets[i].data[j][2],
                        lastName: sheets[i].data[j][1],
                        phone: sheets[i].data[j][3],
                        crewNo: sheets[i].data[j][6],
                        job: sheets[i].data[j][7]
                    });
                }

                break;
            case "התנדבויות" :
                /**volunteerNo	volunteerName	crewNo	renovationNo	renovationName<ignored>	renovationAddress<ignored>	date */
                collectionName="Volunteering";
                for(var j =HeadersRow+1 ; j < sheets[i].data.length;j++) {
                    fillMissingData(sheets, i, j, headers.length);
                    dataToBeInserted.push({
                        volunteerNo: sheets[i].data[j][0],
                        volunteerName:sheets[i].data[j][1],
                        crewNo: sheets[i].data[j][2],
                        renovationNo: sheets[i].data[j][3],
                        date: sheets[i].data[j][6]
                    });
                }
                break;
            case "סטיסטיקות" :
                continue;
                break;
            case "שיפוצים" :
                /**renovationNo	name	address	phone	referrer	referrerPhone	referrerEmail	date	workingHours
                 * volunteersCount	totalHours	materialsCost	renovationType	fatherRenovationNo	description	volunteersName
                 */
                collectionName = " renovations";
                for(var j =HeadersRow+1 ; j < sheets[i].data.length;j++) {
                    var renovationId = sheets[i].data[j][0];
                    /** we check if we have volunteer has id<which is email> */
                    if (renovationId === undefined)
                        continue;
                    fillMissingData(sheets, i, j, headers.length);
                    dataToBeInserted.push({
                        _id: renovationId,
                        name: sheets[i].data[j][1],
                        address: sheets[i].data[j][2],
                        phone: sheets[i].data[j][3],
                        referrer: sheets[i].data[j][4],
                        referrerPhone: sheets[i].data[j][5],
                        referrerEmail: sheets[i].data[j][6],
                        date: sheets[i].data[j][7],
                        workingHours: sheets[i].data[j][8],
                        volunteersCount: sheets[i].data[j][9],
                        totalHours: sheets[i].data[j][10],
                        materialsCost: sheets[i].data[j][11],
                        renovationType: sheets[i].data[j][12],
                        fatherRenovationNo: sheets[i].data[j][13],
                        description: sheets[i].data[j][14],
                        volunteersName: sheets[i].data[j][15],
                    });
                }
                break;
            case "מתנדבים עתידיים" :
                continue;
                break;
            case "קביעת ערכים" :
                continue;
                break;

        }
        mongoUtils.insert(collectionName,dataToBeInserted,function (error , result) {
            if(error)
            {
                /** the result is not importance since there is error*/
                console.log("Error has accord while saving the excel to the db");
                sheetsFaildToImportName+= collectionName+" , ";
            }

        });
        debug("Done with "+collectionName);
        console.log("Done with "+collectionName);
    }
    if(sheetsFaildToImportName.length ==0)
    {
        sheetsFaildToImportName =null;
    }
    callback(sheetsFaildToImportName,"All sheets were processed");

}

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
    importWorkBook:importWorkBook

}
