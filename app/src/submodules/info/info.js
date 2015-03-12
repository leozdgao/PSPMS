angular.module("app.infoModule", ['app.datacenter', 'app.directives'])

.controller('InfoController', ['$scope', 'Alert', 'CompanyFactory',
    function($scope, Alert, CompanyFactory) {
        console.log('InfoController called.');
        $scope.filter = CompanyFactory.filter;
        
        $scope.$watch('filter.text', function(newVal, oldVal) {
            if(oldVal != newVal) {
                CompanyFactory.filter.text = newVal;
                updateTree();
            }
        });

        updateTree();
        
        function updateTree() {
            CompanyFactory.refresh()
                .then(function(companies){
                    $scope.sortedCompanies = companies;
                })
                .catch(function() {
                    Alert.add("Error occurred while getting companies.", "danger");
                });
        }
    }
]);
