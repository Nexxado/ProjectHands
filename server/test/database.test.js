var request = require('supertest');
var server = require('../app');

describe('Database Endpoints', function () {

    it('Query', function (done) {
        request(server)
            .get(encodeURI('/database/query/chats&{"_id":"test"}'))
            .expect(200, done);
    });

    it('Insert', function (done) {
        request(server)
            .post('/database/insert')
            .expect(200, done);

    });

    it('Remove', function (done) {
        request(server)
            .delete(encodeURI('/database/delete/users&{"user":"test"}'))
            .expect(200, done);
    });

    it('Update', function (done) {
        request(server)
            .post('/database/update')
            .expect(200, done);
    });

});
