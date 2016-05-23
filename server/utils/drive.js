var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var mime = require('mime-types');

//***************images
var config = require('../../config.json');
var COLLECTIONS = config.COLLECTIONS;
var mongoUtils = require('./mongo');
//***************
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
var SCOPES = [
    ['https://www.googleapis.com/auth/drive.appdata'],
    ['https://www.googleapis.com/auth/drive.apps.readonly'],
    ['https://www.googleapis.com/auth/drive'],
    [' https://www.googleapis.com/auth/drive.file']];

var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Drive API.
    authorize(JSON.parse(content), initAuth);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client);
        }
    });
}
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function (code) {
        rl.close();
        oauth2Client.getToken(code, function (err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client);
        });
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
}
/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function initAuth(auth) {
    myAuth = auth;

    // var service = google.drive('v3');
    // service.files.list({
    //     auth: auth,
    //     pageSize: 10,
    //     fields: "nextPageToken, files(id, name)"
    // }, function (err, response) {
    //     if (err) {
    //         console.log('The API returned an error: ' + err);
    //         return;
    //     }
    //     var files = response.files;
    //     if (files.length == 0) {
    //         console.log('No files found.');
    //     } else {
    //         console.log('Files:');
    //         for (var i = 0; i < files.length; i++) {
    //             var file = files[i];
    //             console.log('%s (%s)', file.name, file.id);
    //         }
    //     }
    // });
}

function uploadFile(filePath, album_key) {
    var fs = require('fs');
    var drive = google.drive({version: 'v3', auth: myAuth});
    var mimeType = mime.lookup(filePath);

    // createFolder(filePath, auth);

    drive.files.create({
        resource: {
            name: filePath,
            mimeType: mimeType
        },
        media: {
            mimeType: mimeType,
            body: fs.createReadStream(filePath) // read streams are awesome!
        }
    }, function (err, file) {
        if (err) {
            // Handle error
            console.log(err);
        } else {
            //when file created file id saved to list in the  album_key;
            console.log('file created, File Id: ', file.id);
            console.log('web view link: ', file.shared);
            // printFile(file.id, drive);
            setFileShardAnyone(file.id);
            // insertFileIdToDb(file.id, album_key);
        }
    });
}

function setFileShardAnyone(fileId) {
    var drive = google.drive({version: 'v3', auth: myAuth});
    drive.permissions.create({
        resource: {
            'type': 'anyone',
            'role': 'reader'
        },
        fileId: fileId,
        fields: 'id'
    }, function (err, res) {
        if (err) {
            // Handle error
            console.log(err);
        } else {
            // downloadFile(fileId);
            printFileMetadata(fileId);
            console.log('Permission ID: ', res.id);
            drive.permissions.create({
                resource: {
                    'type': 'anyone',
                    'role': 'reader'
                    // 'domain': 'appsrocks.com'
                },
                fileId: fileId,
                fields: 'id'
            }, function (err, res) {
                if (err) {
                    // Handle error
                    console.log(err);
                } else {
                    // console.log('Permission ID: ', res.id);
                    console.log('Permission ID: ', res);
                    // console.log('webContentLink: ', res.webContentLink);
                }
            });
        }
    });


    // var drive = google.drive({version: 'v3', auth: myAuth});
    // // update example with metadata update
    // drive.files.update({
    //     fileId: fileId,
    //     resource: {
    //         title: 'Updated title',
    //         shared: true
    //     },
    //     media: {
    //         mimeType: 'text/plain',
    //         body: 'Hello World updated with metadata'
    //     },
    //     auth: myAuth
    // }, function (err, response) {
    //     console.log('error:', err, 'updated:', response.id);
    //     console.log('error:', err, 'updated:', response.shared);
    // });
}
/**
 *
 * @param fileId google drive file id
 */
function printFileMetadata(fileId) {
    var drive = google.drive({version: 'v3', auth: myAuth});

    drive.files.get({
        fileId: fileId,
        fields: ['webContentLink']
    }, function (err, res) {
        if (err) {
            // Handle error
            console.log(err);
        } else {
            //when file created file id saved to list in the  album_key;
            console.log('res: ', res);
            console.log('description: ', res.description);

        }
    });
}


function insertFileIdToDb(fileId, album_key) {
    mongoUtils.insert(COLLECTIONS.IMAGES, {album_key: album_key, file_id: fileId}, function (error, result) {
        if (error)
            console.log(err);
        else
            console.log(result);

        // getImagesCollection();
        getAlbumImages('asd');
    });
}

function getImagesCollection() {
    mongoUtils.query(COLLECTIONS.IMAGES, {}, function (error, result) {
        if (error)
            console.log(err);
        else
            console.log(result);
    })
}

function getAlbumImages(albumKey) {
    console.log('getAlbumImages(albumKey) ' + albumKey);
    mongoUtils.query(COLLECTIONS.IMAGES, {album_key: albumKey}, function (error, result) {
        if (error)
            console.log(err);
        else
            console.log(result);
    })
}

function createFolder(name, auth) {
    var drive = google.drive({version: 'v3', auth: auth});
    var fileMetadata = {
        'name': name,
        'mimeType': 'application/vnd.google-apps.folder'
    };
    drive.files.create({
        resource: fileMetadata,
        fields: 'id'
    }, function (err, file) {
        if (err) {
            // Handle error
            console.log(err);
        } else {
            console.log('Folder Id: ', file.id);
        }
    });
}

module.exports = {
    uploadFile: function (file, album_key) {
        uploadFile(file, album_key);
    }
};