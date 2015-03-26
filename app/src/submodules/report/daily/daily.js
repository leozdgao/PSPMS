angular.module("app.reportModule")

.controller('DailyReportController', ['$scope', function($scope){
    $scope.dt = new Date();
    $scope.jobs = [];

    $scope.reset = function() { $scope.dt = new Date(); }

    // var clr;
    $scope.$watch('dt', function(newVal, oldVal) {
        if(newVal !== oldVal) {
            // if(clr) clearTimeout(clr);


        }
    });
}])
