describe('APIService', function () {

    var $httpBackend, $APIService;

    // Set up the module
    beforeEach(function () {
        module('ProjectHands');
        inject(function (_$httpBackend_, _APIService_) {
            $APIService = _APIService_;
            $httpBackend = _$httpBackend_;
        });
        $httpBackend.whenGET('templates/home.html').respond(200); //workaround for ui.router
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


    it('Chat - query (room_id)', function () {
        $httpBackend.expectGET('/api/chat/test')
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
        var result = $APIService.chat.query('test');
        $httpBackend.flush();
        // console.log(result);
        expect(result[0]._id).toEqual('test');
    });

    it('Renovation - query', function () {
        $httpBackend.expectGET('/api/renovation/date&01%2F01%2F2015') //%2F = '/'
            .respond(200, [{
                addr: {
                    city: "ירושלים",
                    street: "ישראל זרחי",
                    num: "12"
                },
                date: "01/01/2015"
            }]);
        var result = $APIService.renovation.query('date', '01/01/2015');
        $httpBackend.flush();
        // console.log(result);
        expect(result[0].date).toEqual('01/01/2015');
        expect(result[0].addr.city).toEqual('ירושלים');
        expect(result[0].addr.street).toEqual('ישראל זרחי');
        expect(result[0].addr.num).toEqual('12');
    });


});