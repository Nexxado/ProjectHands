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
    it('404 everything else', function (done) {
        request(server)
            .get('/foo/bar')
            .expect(404, done);
    });
});

describe('API Routes', function () {

    describe('Auth', function () {

        it('Login', function (done) {
            request(server)
                .get('/api/auth/login/cred&hash')
                .expect(200, done);
        });

        it('Sign Up', function (done) {
            request(server)
                .get('/api/auth/signup/cred')
                .expect(200, done);
        });

        it('Roles', function (done) {
            request(server)
                .get('/api/auth/roles/initiator&target&role')
                .expect(200, done);
        });

    });

});
