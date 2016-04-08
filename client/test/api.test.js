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


    it('Chat - call with room id', function () {
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
        var result = $APIService.chat('test');
        $httpBackend.flush();
        // console.log(result);
        expect(result[0]._id).toEqual('test');
    });


});