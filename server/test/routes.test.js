var request = require('supertest');

describe('Loading Express', function () {
    var server = require('../app');

    it('Responds to /', function (done) {
        request(server)
            .get('/')
            .expect(200, done);
    });
    it('Load Vendor Scripts', function (done) {
        request(server)
            .get('/vendor/angular/angular.min.js')
            .expect(200, done);
    });
    it('404 everything else', function (done) {
        request(server)
            .get('/foo/bar')
            .expect(404, done);
    });
});
