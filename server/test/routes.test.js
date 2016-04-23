var request = require('supertest');
var server = require('../app');
var mongoUtils = require('../utils/mongo');
var config = require('../../config.json');
var COLLECTIONS = config.COLLECTIONS;

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

    before(function (done) {
        mongoUtils.connect(config.mongoDBUrl);
        setTimeout(function () { //Timeout to let DB finish connecting
            done();
        }, 1000);
    });

    describe('Auth', function () {

        before(function () {
            mongoUtils.insert(COLLECTIONS.USERS, {
                "_id": "000000000",
                "name": "Route Test",
                "password": "1234",
                "role": "admin",
                "email": "route@gmail.com",
            }, function () {});
        });

        after(function () {
            mongoUtils.delete(COLLECTIONS.USERS, {
                email: "route@gmail.com"
            }, function () {});

            //Delete user after signup
            mongoUtils.delete(COLLECTIONS.USERS, {
                _id: "123123123"
            }, function() {});
        });

        it('Sign Up', function (done) {
            request(server)
                .post('/api/auth/signup')
                .send({ user: JSON.stringify({
                    _id: "123123123",
                    name: "SignUp Mocha Test",
                    email: "signupmocha@gmail.com",
                    password: "1234"
                })})
                .expect(200)
                .end(function (err, result) {
                    done();
                });
        });

        it('Login', function (done) {
            request(server)
                .get('/api/auth/login/' +
                    JSON.stringify({
                        email: "route@gmail.com",
                        password: "1234"
                    }) +
                    '&a1b2c3d4')
                .expect(400, done);
        });

        //        it('Roles', function (done) {
        //            request(server)
        //                .get('/api/auth/roles/initiator&target&role')
        //                .expect(200, done);
        //        });

    });

});
