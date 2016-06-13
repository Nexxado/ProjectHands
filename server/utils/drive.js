var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var mime = require('mime-types');
var config = require('../../config.json');


// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-credentials.json
var SCOPES = [
    ['https://www.googleapis.com/auth/drive.appdata'],
    ['https://www.googleapis.com/auth/drive.apps.readonly'],
    ['https://www.googleapis.com/auth/drive'],
    ['https://www.googleapis.com/auth/drive.file']];

var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-credentials.json';

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
 * Get and sessionStore new token after prompting for user authorization, and then
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
 * @param {Object} token The token to sessionStore to disk.
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
}
/**
 * make link to by direct and not download, remove suffix 'export=download'
 */
function fixDirectLink(link) {
    return link.split('export=download')[0];
}

/**
 *  the routine for uploading file to google drive :
 * 1. upload file to google drive
 * 2. set file permission to public
 * 3. get file webContentLink
 * @param filePath : path of the file in the file system
 * @param albumkey : album you want to put file in
 * @param callback : (err, res), res holds  file_id and web_link
 */
function uploadToDrive(filePath, albumkey, callback) {
    var fileId;
    uploadFileToDrive(filePath, albumkey, function (err, file) {
        if (err) {
        } else {
            setFilePermissionAnyoneRead(file.id, function (err, res) {
                fileId = file.id;
                if (err) {
                } else {
                    getFileWebContentLink(file.id, function (err, res) {
                        if (err) {
                        } else {
                            var mRes = {
                                file_id: fileId,
                                web_link: fixDirectLink(res.webContentLink)
                            };
                            callback(err, mRes);
                        }
                    });

                }
            });
        }
    })
}

/**
 * @param callback : args (err, file) file.id holds the new file id
 * @param filePath : path in the file system for streaming the file to google drive
 * @param album_key : for saving the file in the db
 */
function uploadFileToDrive(filePath, album_key, callback) {

    var fs = require('fs');
    var drive = google.drive({version: 'v3', auth: myAuth});
    var mimeType = mime.lookup(filePath);

    drive.files.create({
        resource: {
            name: filePath,
            mimeType: mimeType
        },
        media: {
            mimeType: mimeType,
            body: fs.createReadStream(filePath)
        }
    }, callback);
}
/**
 * delete file from google drive
 * @param fileId
 * @param callback
 */
function deleteFile(fileId, callback) {
    var drive = google.drive({version: 'v3', auth: myAuth});
    drive.files.delete({
        fileId: fileId
    }, callback);
}
/**
 * Set file in google drive to by public to anyone with a link
 * @param callback with (err, res) if file shard  success err=null
 * @param fileId
 */
function setFilePermissionAnyoneRead(fileId, callback) {
    var drive = google.drive({version: 'v3', auth: myAuth});
    drive.permissions.create({
        resource: {
            'type': 'anyone',
            'role': 'reader'
        },
        fileId: fileId,
        fields: 'id'
    }, callback);
}

/**
 * @param callback : with (err, res) and res.webContentLink for getting the link
 * @param fileId google drive file id
 */
function getFileWebContentLink(fileId, callback) {
    var drive = google.drive({version: 'v3', auth: myAuth});
    drive.files.get({
        fileId: fileId,
        fields: ['webContentLink', 'permissions/id']
    }, callback);
}

/**
 * NOT USED for now
 * @param name
 * @param auth
 */
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
    uploadFile: function (filePath, album_key, callback) {
        uploadToDrive(filePath, album_key, callback);
    },
    deleteFile: function (fileId, callback) {
        deleteFile(fileId, callback);
    }
};