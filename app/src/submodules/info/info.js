angular.module("app.infoModule", ['app.datacenter', 'app.directives'])

.controller('InfoController', ['$scope', 'Company', 'Alert', function($scope, Company, Alert) {

    $scope.filter = {
        text: ""
    };
    
    $scope.$watch('filter.text', function(newVal, oldVal) {
        if(oldVal != newVal) {
            sortCompany(newVal);
        } 
    });

    Company.query().$promise
        .then(function(companies){
            $scope.companies = companies;
            sortCompany();
        })
        .catch(function() {
            Alert.add("Error occurred while getting companies.", "danger");
        });

    function sortCompany(text) {
        var companies = $scope.companies;
        if(text) {
            companies = companies.filter(function(item) {
                if(item && item.name) {
                    var match = item.name.toLowerCase().match("^" + text.toLowerCase());
                    return match && match.length > 0;
                }
                else return false;
            });
        }
        $scope.sortedCompanies = companies.sort(function(a, b) {
            return +function compare(t0, t1) {
                if(t0.charCodeAt(0) == t1.charCodeAt(0)) {
                    t0 = t0.slice(1);
                    t1 = t1.slice(1);
                    return compare(t0, t1);
                }
                else return t0.charCodeAt(0) - t1.charCodeAt(0);
            }(a.name.toLowerCase(), b.name.toLowerCase());
        });
    }
}])