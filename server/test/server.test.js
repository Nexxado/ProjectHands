var request = require('supertest');
var server = require('../app');

describe('Loading Express', function () {

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
    it('Redirects on everything else', function (done) {
        request(server)
            .get('/foo/bar')
            .expect(200, done);
    });
});


