describe('DatabaseService', function () {

    var $httpBackend, $DatabaseService;

    // Set up the module
    beforeEach(function () {
        module('ProjectHands');
        inject(function (_$httpBackend_, _DatabaseService_) {
            $DatabaseService = _DatabaseService_;
            $httpBackend = _$httpBackend_;
        });
        $httpBackend.whenGET('templates/home.html').respond(200); //workaround for ui.router
        $httpBackend.whenGET('/api/auth/isLoggedIn').respond(200);
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


    it('Query', function () {
        $httpBackend.expectGET(encodeURI('/api/database/query/chats&{"_id":"test"}'))
            .respond(200, [{
                _id: 'test',
                message: [
                    {
                        "user": "test user",
                        "content": "test message",
                        "timestamp": "01/01/2001 00:01"
                    }
                ]
            }]);
        var result = $DatabaseService.query('chats', {_id: "test"});
        $httpBackend.flush();
//         console.log(result);
        expect(result[0]._id).toEqual('test');
    });

    
    it('Insert', function () {
        $httpBackend.expectPOST('/api/database/insert', 
                                JSON.stringify({ collection: 'chats', 
                                                data: JSON.stringify({user: 'test' })}))
            .respond(200, {
                result: {
                    ok: 1,
                    n: 1
                }
        });
        var result = $DatabaseService.insert('chats', {user: "test"});
        $httpBackend.flush();
//         console.log(result);
        expect(result.result.ok).toEqual(1);
    });
    
    it('Remove', function () {
        $httpBackend.expectDELETE(encodeURI('/api/database/delete/users&{"user":"test"}'))
            .respond(200, {
                    ok: 1,
                    n: 1
        });
        var result = $DatabaseService.remove('users', {user: "test"});
        $httpBackend.flush();
//         console.log(result);
        expect(result.ok).toEqual(1);
        expect(result.n).toEqual(1);
    });
    
    it('Update', function () {
        $httpBackend.expectPOST('/api/database/update', JSON.stringify({ collection: "users", 
                                                     query: JSON.stringify({user: "test"}),
                                                     data: JSON.stringify({user: "test2"}),
                                                     options: "{}"}))
            .respond(200, {
                ok: 1,
                n: 1,
                nModified: 1
        });
        var result = $DatabaseService.update('users', {user: "test"}, {user: "test2"}, {});
        $httpBackend.flush();
//         console.log(result);
        expect(result.ok).toEqual(1);
        expect(result.n).toEqual(1);
        expect(result.nModified).toEqual(1);
    });

});
