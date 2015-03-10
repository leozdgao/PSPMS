var app = angular.module("pspms", ['ngCookies', 'ui.router', 'app.directives', 'app.auth', 'app.admin', 'app.infoModule']);

app.run(["$rootScope", "$state", "$stateParams", "$location", "$cookies", "AuthService", "UserService", "Alert",
    function($rootScope, $state, $stateParams, $location, $cookies, AuthService, UserService, Alert){
        $rootScope.$stateParams = $stateParams;
        $rootScope.$state = $state;

        // set auth method
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
        };

        // set alert list
        $rootScope.alertModule = {
            alerts: Alert.getAlerts(),
            onClose: Alert.remove
        }

        $rootScope.$on("$stateChangeError", function(e, to, toParams, from, fromParams, error) {
            
            console.log('error');
        });

        $rootScope.$on("$stateChangeSuccess", function(e, to, toParams, from, fromParams) {
            if(to.name == "admin") {
                var role = UserService.getRole();
                
                if(angular.isUndefined(role) || role > -1) {
                    $location.path("/");
                }
            }
            else {
                var ac = to.access_control || 0;

                if(ac && !AuthService.isAuthenticated(ac)) {

                    Alert.add("You have no access to it.", "danger");
                    $state.go(from.name, fromParams);
                }
            }
        });
    }
]);

app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', 'AuthServiceProvider',
    function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, AuthServiceProvider) {

        AuthServiceProvider.authUrl.login = "/user/login";
        AuthServiceProvider.authUrl.logout = "/user/logout";
        AuthServiceProvider.authUrl.relog = "/user/relog";

        var relogService = ['$q', '$cookies', 'AuthService', 'UserService', 'Alert',
            function($q, $cookies, AuthService, UserService, Alert) {

                var defer = $q.defer();
                var oldToken = $cookies.token;

                if(!AuthService.isAuthenticated() && angular.isDefined(oldToken)) {

                    AuthService.relog(oldToken)
                        .then(function(resource) {

                            Alert.add("Welcome! " + resource.name, "success");
                        })
                        .finally(function(){ 

                            defer.resolve();
                        });
                }
                else {
                    defer.resolve();
                }

                return defer.promise;
            }
        ];

        $stateProvider
            .state("overview", {
                url: "/",
                views: {
                    "": {
                        templateUrl: "/template/index.html"
                    }
                },
                resolve: relogService,
                access_control: 0
            })
            .state("info", {
                url: "/info",
                views: {
                    "": {
                        templateUrl: "/template/index.html"
                    },
                    "general@info": {
                        templateUrl: "/template/submodules/info/index.html"
                    }
                },
                resolve: relogService,
                access_control: 0
            })
            .state("report", {
                url: "/report",
                views: {
                    "": {
                        templateUrl: "/template/index.html"
                    }               
                },
                resolve: relogService,
                access_control: 1
            })
            .state("admin", {
                url: "/admin",
                views: {
                    "": {
                        templateUrl: "/template/index.html"
                    },
                    "general@admin": {
                        templateUrl: "/template/submodules/admin/index.html"
                    }
                },
                resolve: relogService,
                access_control: -1
            });

        $urlRouterProvider.otherwise("/");

        $httpProvider.interceptors.push("AuthTokenInterceptor");

        // set url to h5 mode
        $locationProvider.html5Mode(true);
}]);

app.controller("NavBarController", ["$scope", "$state", "$location", "$cookies", "LoginPanel", "AuthService",
    "UserService", "Alert",
    function($scope, $state, $location, $cookies, LoginPanel, AuthService, UserService, Alert) {

        console.log('NavBarController called.');
        
        $scope.showLoginPanel = function() {

            LoginPanel.show(AuthService.login)
                //after a successful login
                .then(function(user) {

                    // update navbar
                    $scope.user = UserService.getUser();

                    Alert.add("Welcome! " + $scope.user.name, "success");
                });
        }

        $scope.logout = function() {

            AuthService.logout()
                .then(function() {

                    delete $cookies.token;

                    $scope.user = UserService.getUser();
                    $location.path('/');

                    Alert.add("Logged out.");
                })
                .catch(function() {

                    Alert.add("Error occurred while logging out.", "danger");
                });
        }

        $scope.user = UserService.getUser();
    }
]);
