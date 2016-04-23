var request = require('supertest');
var server = require('../app');
var mongoUtils = require('../utils/mongo');
var config = require('../../config.json');
var COLLECTIONS = config.COLLECTIONS;

describe('Database API', function () {

    before(function (done) {
        mongoUtils.connect(config.mongoDBUrl);
        setTimeout(function () { //Timeout to let DB finish connecting
            done();
        }, 1000);
    });

    describe('CRUD', function () {

        it('Insert', function (done) {
            request(server)
                .post('/api/database/insert')
                .send({
                    collection: COLLECTIONS.USERS,
                    data: JSON.stringify({
                        _id: "321321321",
                        name: "Mocha Insert Test",
                        email: "mochainsert@gmail.com",
                        password: "1234"
                    })
                })
                .expect('Content-Type', /application\/json/)
                .expect(200)
                .end(function (err, res) {
                    if (err)
                        return done(err);
                    done();
                });
        });

        it('Update', function (done) {
            request(server)
                .post('/api/database/update')
                .send({
                    collection: COLLECTIONS.USERS,
                    query: JSON.stringify({
                        _id: "321321321"
                    }),
                    data: JSON.stringify({
                        $set: {
                            name: "Mocha Update Test"
                        }
                    }),
                    options: JSON.stringify({})
                })
                .expect('Content-Type', /application\/json/)
                .expect(200)
                .end(function (err, res) {
                    if (err)
                        return done(err);
                    done();
                });
        });

        it('Query', function (done) {
            request(server)
                .get('/api/database/query/' +
                    COLLECTIONS.USERS + '&' +
                    JSON.stringify({
                        _id: "321321321"
                    }))
                .expect('Content-Type', /application\/json/)
                .expect(200, [{
                    _id: "321321321",
                    name: "Mocha Update Test",
                    email: "mochainsert@gmail.com",
                    password: "1234"
                    }], done);
        });


        it('Delete', function (done) {
            request(server)
                .delete('/api/database/delete/' +
                    COLLECTIONS.USERS + '&' +
                    JSON.stringify({
                        _id: "321321321"
                    }))
                .expect(200, done);
        });

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
            }, function () {});
        });

        it('Sign Up', function (done) {
            request(server)
                .post('/api/auth/signup')
                .send({
                    user: JSON.stringify({
                        _id: "123123123",
                        name: "SignUp Mocha Test",
                        email: "signupmocha@gmail.com",
                        password: "1234"
                    })
                })
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
                .expect(200, done);
        });



        //        it('Roles', function (done) {
        //            request(server)
        //                .get('/api/auth/roles/initiator&target&role')
        //                .expect(200, done);
        //        });

    });

});
