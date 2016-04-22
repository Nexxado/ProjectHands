var request = require('supertest');
var server = require('../app');

describe('Database Endpoints', function () {

    it('Query', function (done) {
        request(server)
            .get('/api/database/query/collection&query')
            .expect(200, done);
    });

    it('Insert', function (done) {
        request(server)
            .post('/api/database/insert/')
            .field('collection', 'users')
            .field('data', '{name: "tester"}')
            .expect(200, done);
    });

    it('Delete', function (done) {
        request(server)
            .delete('/api/database/delete/users&' + JSON.stringify({
                name: "tester"
            }))
            .expect(200, done);
    });

    it('Update', function (done) {
        request(server)
            .post('/api/database/update/')
            .field('collection', 'users')
            .field('query', '{name: "tester"}')
            .field('data', '{email: "newmail@provider.com"}')
            .field('options', '{}')
            .expect(200, done);
    });

});
