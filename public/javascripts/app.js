//var app = angular.module("pspms", ['ui.router', 'ui.bootstrap', 'app.info', 'app.report']);
var app = angular.module("pspms", ['ui.router', 'ui.bootstrap', 'app.directives']);

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
var directives = angular.module('app.directives', []);
angular.module('app.directives')

.controller('NavbarController', ["$scope", "$state", function($scope, $state){
    var state = $state.current.name;
    $scope.isActive = function(name){
        return state === name;
    }
}])
.directive('navbar', function(){
    return {
        restrict: 'A',
        controller: 'NavbarController',
        templateUrl: 'templates/directives/navbar/template.html',
    }
})
