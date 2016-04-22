var request = require('supertest');
var server = require('../app');

describe('Database Endpoints', function () {

    it('Query', function (done) {
        request(server)
            .get(encodeURI('/api/database/query/chats&{"_id":"test"}'))
            .expect(200, done);
    });

    it('Insert', function (done) {
        request(server)
            .post('/api/database/insert')
            .expect(200, done);

    });

    it('Remove', function (done) {
        request(server)
            .delete(encodeURI('/api/database/delete/users&{"user":"test"}'))
            .expect(200, done);
    });

    it('Update', function (done) {
        request(server)
            .post('/api/database/update')
            .expect(200, done);
    });

});
