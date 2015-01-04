describe("restclient", function() {

	var $httpBackend, Company;

	beforeEach(module('app.datacenter'));
	beforeEach(inject(function(_$httpBackend_, _Company_) {

		$httpBackend = _$httpBackend_;
		Company = _Company_;
		//Project = _Project_;

		//$httpBackend.whenGET("/proxy/rest/company?companyId=1080")
			
	}));

	it("use method 'get' to get Company", function() {

		$httpBackend.expectGET("/proxy/rest/company?companyId=1080")
			.respond([{companyId: 1080, name: "test"}]);

		Company.get({companyId: 1080}).$promise.then(function(results) {
			expect(angular.isArray(results)).toBe(true);
			expect(results.length).toBe(1);
		});

		$httpBackend.flush();
	});

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
})