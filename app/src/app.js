//var app = angular.module("pspms", ['ui.router', 'ui.bootstrap', 'app.info', 'app.report']);
var app = angular.module("pspms", ['ngCookies', 'ui.router', 'app.directives', 'app.auth']);

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
	    	},
	    	isAdmin: function() {
	    		var role = UserService.getRole();
	    		return angular.isDefined(role) && role <= -1;
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

app.config(function ($stateProvider, $urlRouterProvider, $httpProvider, AuthServiceProvider) {
	$stateProvider
		.state("index", {
			url: "/",
			views: {
				"": {
					templateUrl: "/templates/index.html"
				}
			},
			access_control: 0
		})
		.state("report", {
	        url: "/report",
	        views: {
	            "": {
					templateUrl: "/templates/index.html"
				}				
	        },
	        access_control: 1
	    })
	    .state("admin", {
	    	url: "/admin",
	    	views: {
	    		"": {
	    			templateUrl: "/templates/index.html"
	    		},
	    		"general@admin": {
					templateUrl: "/templates/admin/index.html"
				}
	    	},
	    	access_control: -1
	    });

	$urlRouterProvider.otherwise("/");

	$httpProvider.interceptors.push("AuthTokenInterceptor");

	AuthServiceProvider.authUrl.login = "/user/login";
	AuthServiceProvider.authUrl.logout = "/user/logout";
	AuthServiceProvider.authUrl.relog = "/user/relog";
});

app.controller("NavBarController", ["$scope", "$state", "$location", "$cookies", "LoginPanel", "AuthService",
	"UserService", "MessageBox", "$cookies",
	function($scope, $state, $location, $cookies, LoginPanel, AuthService, UserService, MessageBox) {

		console.log('NavBarController called.');
		
		$scope.showLoginPanel = function() {

			LoginPanel.show(AuthService.login)
				//after a successful login
				.then(function(user) {

					// update navbar
					// $state.reload();
					$scope.user = UserService.getUser();

					if($scope.auth.isAdmin()) {
						$state.go("admin");
					}
				});
		}

		$scope.logout = function() {

			AuthService.logout()
				.then(function() {
					// $cookieStore.remove("token");
					delete $cookies.token;

					$scope.user = UserService.getUser();
					$location.path('/');
				})
				.catch(function() {

					MessageBox.show("Error occurred while logging out.");
				});
		}

		$scope.user = UserService.getUser();

		// try re-login if token is not expire
		if(!$scope.auth.isAuthenticated()) {

			// var oldToken = $cookieStore.get("token");
			var oldToken = $cookies.token;
			
			if(angular.isDefined(oldToken)) {

				AuthService.relog(oldToken).then(function() {

					$scope.user = UserService.getUser();

					if($scope.auth.isAdmin()) {
						$state.go("admin");
					}
				})
				.catch(function(err) {
					
					//session expired
					if(err && err.code == 3)
						delete $cookies.token;
				});
			}
		}
	}
]);