describe("authentication", function() {

	var $httpBackend, provider, AuthService, UserService;

	beforeEach(function() {
		angular.module("app.auth.test", [])
		.config(function(AuthServiceProvider) {
			// $httpProvider.interceptors.push("AuthTokenInterceptor");
			provider = AuthServiceProvider;
			provider.authUrl.login = "/user/login";
			provider.authUrl.logout = "/user/logout";
		});

		module("app.auth", "app.auth.test", function($httpProvider) {
			$httpProvider.interceptors.push("AuthTokenInterceptor");
		});
		inject(function(_$httpBackend_, _$injector_, _UserService_) {
			$httpBackend = _$httpBackend_;
			AuthService = _$injector_.invoke(provider.$get);
			UserService = _UserService_;

			// _$httpProvider_.interceptors.push("AuthTokenInterceptor");
		});
	});

	// beforeEach(module("app.auth"));
	// beforeEach(inject(function(_$httpBackend_, _AuthService_) {
	// 	$httpBackend = _$httpBackend_;
	// 	AuthService = _AuthService_;
	// }));

	it("perform user authentication", function() {

		$httpBackend.expectPOST("/user/login", {uid: "test", pwd: "123"})
			.respond({name: "test", role: 1, token: "123456"});
		$httpBackend.expectGET("/user/logout?token=123456")
			.respond({success: 1});

		expect(UserService.getUser()).toBeUndefined();
		expect(UserService.getToken()).toBeUndefined();
		expect(AuthService.isAuthenticated()).toBe(false);

		AuthService.login("test", "123")
		.then(function() {
			var user = UserService.getUser();

			expect(user).toBeDefined();
			expect(user.name).toBe("test");
			expect(user.role).toBe(1);
			expect(UserService.getToken()).toBe("123456");
			expect(AuthService.isAuthenticated()).toBe(true);
			expect(AuthService.isAuthenticated(2)).toBe(false);

			return AuthService.logout();
		})
		.then(function() {
			expect(UserService.getUser()).toBeUndefined();
			expect(UserService.getToken()).toBeUndefined();
			expect(AuthService.isAuthenticated()).toBe(false);
		});

		$httpBackend.flush();
	});

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
});