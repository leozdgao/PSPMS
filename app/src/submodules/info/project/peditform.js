angular.module('app.infoModule')

.directive('pedit', [function() {
    return {
        controller: 'ProjectFormController',
        templateUrl: '/template/submodules/info/project/form.html',
        scope: {
            eObj: '=',
            onsubmit: '=',
            onremove: '=?',
            oncancel: '=?',
            onreset: '=?'
        },
        replace: true
    }
}])

.controller('ProjectFormController', ['$scope', '$state', 'DatepickerOption', 'CompanyFactory', 'ProjectFactory',
    function($scope, $state, DatepickerOption, CompanyFactory, ProjectFactory){

        $scope.formstate = {
            submitting: false,
            submited: false,
            isInvalid: function(key) {
                return (this.submited || $scope.editProjectForm[key].$dirty) && $scope.editProjectForm[key].$invalid;
            }
        };

        // $scope.eObj = angular.copy(CurrentProject);
        $scope.startDateOpts = new DatepickerOption();
        $scope.lastUpdateDateOpts = new DatepickerOption();
        $scope.projectStatus = ProjectFactory.projectStatus;
        CompanyFactory.refresh().then(function(companies) {
            $scope.availableCompanies = companies;    
        });
        // get products
        CompanyFactory.getProjectsBasic(1146).then(function(products) {
            $scope.availableProducts = products;
        });

        $scope.submit = function() {
            // if(!$scope.editProjectForm.$dirty) {
            //     $state.go('^');
            //     return;
            // }

            $scope.formstate.submited = true;
            if($scope.editProjectForm.$valid) {
                $scope.formstate.submitting = true;
                $scope.onsubmit()
                    .finally(function() {
                        $scope.formstate.submitting = false;
                    });
            }
        }
        $scope.back = function() {
            $state.go('^'); // back to parent state
        }
        $scope.reset = $scope.onreset;  
        $scope.remove = $scope.onremove;
        $scope.productOnChange = function() {
            var mergeKeys = [ "name", "assemblyName", "sourceCode", "serverFolder", "perforceFolder", "isPlugin",
                              "isCodeBase", "isUtility", "isPAPI", "isWebService" ];
            ProjectFactory.get($scope.eObj.productId)
                .then(function(result) { 
                    for(var i in mergeKeys) {
                        var key = mergeKeys[i];
                        if(result.hasOwnProperty(key)) {
                            $scope.eObj[key] = result[key];
                        }
                    }
                })
                .catch(function(err) {
                    Alert.add(err.msg || "Get product info failed.", 'danger');
                });
        }
        $scope.$watch('eObj.isProduct', function(newVal, oldVal) {
            if(newVal != oldVal) {
                if(!newVal) {
                    $scope.eObj.productId = void(0);
                }
            }
        });
        
    }
])
