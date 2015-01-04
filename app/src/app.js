//var app = angular.module("pspms", ['ui.router', 'ui.bootstrap', 'app.info', 'app.report']);
var app = angular.module("pspms", ['ui.router', 'app.directives', 'app.datacenter', 'app.auth']);

app.run(["$rootScope", "$state", "$stateParams", "$location", "AuthService", "UserService", "MessageBox",
	function($rootScope, $state, $stateParams, $location, AuthService, UserService, MessageBox){
	    $rootScope.$stateParams = $stateParams;
	    $rootScope.$state = $state;

	    $rootScope.auth = {
	    	isAuthenticated: AuthService.isAuthenticated,
	    	isMember: function() {
	    		return AuthService.isAuthenticated(1);
	    	},
	    	isLeader: function() {
	    		return AuthService.isAuthenticated(2);
	    	}
	    }

	    $rootScope.$on("$stateChangeStart", function(e, to, toParams, from, fromParams) {
	    	if(to.name == "admin") {
	    		var role = UserService.getRole();
	    		if(angular.isUndefined(role) || role > -1) {
	    			$location.path("/");
	    		}
	    	}
	    	else {
	    		var ac = to.access_control || 0;

	    		if(ac && !AuthService.isAuthenticated(ac)) {
	    			MessageBox
	    			.show("You have no access to it.")
	    			.then(function() {
	    				$location.path(from.url);
	    			});
	    		}
	    	}
	    });
	}
]);

//app.constant('SERVER', '/proxy/');

app.config(function ($stateProvider, $urlRouterProvider) {
	$stateProvider.state("index", {
		url: "/",
		views: {
			"": {
				templateUrl: "templates/index.html"
			}
		},
		access_control: 0
	}).state("report", {
        url: "/report",
        views: {
            "": {
				templateUrl: "templates/index.html"
			}
        },
        access_control: 1
    }).state("admin", {
    	url: "/admin",
    	views: {
    		"": {
    			templateUrl: "templates/index.html"
    		}
    	},
    	access_control: -1
    });

	$urlRouterProvider.otherwise("/");
});

// app.controller("TestController", ["$scope", "Company", 
// 	function($scope, Company) {
// 		Company.get({companyId: 1080}).$promise.then(function(data) {
// 			console.log(data);
// 		});
// 	}
// ]);
