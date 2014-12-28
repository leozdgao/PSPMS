//var app = angular.module("pspms", ['ui.router', 'ui.bootstrap', 'app.info', 'app.report']);
var app = angular.module("pspms", ['ui.router', 'app.directives', 'app.datacenter']);

app.run(["$rootScope", "$state", "$stateParams", function($rootScope, $state, $stateParams){
    $rootScope.$stateParams = $stateParams;
    $rootScope.$state = $state;
}]);

app.constant('SERVER', '/proxy/');

app.config(function ($stateProvider, $urlRouterProvider) {
	$stateProvider.state("index", {
		url: "/",
		views: {
			"": {
				templateUrl: "templates/index.html"
			}
		}
	}).state("report", {
        url: "/report",
        views: {
            "": {
				templateUrl: "templates/index.html"
			}
        }
    });

	$urlRouterProvider.otherwise("/");
});

//app.controller("TestController", ["$scope", "Company", 
//	function($scope, Company) {
//		Company.get({companyId: 1080}).$promise.then(function(data) {
//			console.log(data);
//		});
//	}
//]);
