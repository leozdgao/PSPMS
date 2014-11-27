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
