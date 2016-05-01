describe('AuthService', function () {

    var $httpBackend, $AuthService, $rootScope;
    var mockUser = {
            email: 'mock@gmail.com',
            password: '1234',
            _id: '121212121',
            name: 'karma mock testing',
            role: 'admin'
        };

    // Set up the module
    beforeEach(function () {
        module('ProjectHands');
        inject(function (_$httpBackend_, _AuthService_, _$rootScope_) {
            $rootScope = _$rootScope_;
            $AuthService = _AuthService_;
            $httpBackend = _$httpBackend_;
        });
        $httpBackend.whenGET('templates/home.html').respond(200); //workaround for ui.router
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('SignUp', function () {
        $httpBackend.expectPOST('/api/auth/signup', 
                                { user: JSON.stringify(mockUser) })
            .respond(200, {
                success: true
            });
        
        var result = $AuthService.signup(mockUser);
        $httpBackend.flush();
        expect(result.success).toEqual(true);
    });
    
    it('Login', function() {
        $httpBackend.expectPOST('/api/auth/login').respond();
        var result;

        $AuthService.login(mockUser.email, mockUser.password, false)
            .then(function(data) {
                result = data;
            });
        
        $rootScope.$apply(); // promises are resolved/dispatched only on next $digest cycle
        $httpBackend.flush();
        
        expect(result.email).toEqual(mockUser.email);
        expect(result.password).toEqual(mockUser.password);
    });

});
