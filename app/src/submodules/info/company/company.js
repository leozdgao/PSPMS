angular.module("app.infoModule")

.controller('CompanyController', ['$scope', '$filter', 'CurrentCompany', 'CompanyFactory', 'Alert',
    function($scope, $filter, CurrentCompany, CompanyFactory, Alert){
        console.log('CompanyController called');
        $scope.CurrentCompany = CurrentCompany;
        $scope.statusStyle = $filter('projectStatusStyle');

        CompanyFactory.getProjectsBasic(CurrentCompany.companyId)
            .then(function(results) {
                $scope.projectList = results.sort(function(a, b) {
                    return +function compare(t0, t1) {
                        if(t0.charCodeAt(0) == t1.charCodeAt(0)) {
                            return compare(t0.slice(1), t1.slice(1));
                        }
                        else {
                            return t0.charCodeAt(0) - t1.charCodeAt(0);
                        }
                    }(a.project.name.toLowerCase(), b.project.name.toLowerCase());
                }).map(function(item) { return item.project; });
            })
            .catch(function() {
                Alert.add('Get project list failed.', 'danger');
            });
    }
])

.controller('EditCompanyController', ['$scope', '$state', 'CurrentCompany', 'CompanyFactory', 'MessageBox', 'Alert',
    function($scope, $state, CurrentCompany, CompanyFactory, MessageBox, Alert){
        $scope.CurrentCompany = CurrentCompany;
        $scope.eObj = angular.copy(CurrentCompany);
        $scope.formstate = {
            submitting: false,
            submited: false,
            isValid: function() {

            }
        };
        $scope.submit = function() {
            $scope.formstate.submited = true;
            if($scope.editCompanyForm.$dirty && $scope.editCompanyForm.$valid) {
                $scope.formstate.submitting = true;
                CompanyFactory.set(CurrentCompany.companyId, $scope.eObj)
                    .then(function() {
                        
                        $scope.formstate.submitting = false;
                        $state.transitionTo('info.company', {companyId: CurrentCompany.companyId}, {reload: true});
                    })
                    .catch(function(e) {
                        Alert.add(e.msg || 'Error occurred while submit company.', 'danger');
                    });    
            }
            else {
                $state.go('info.company', {companyId: $scope.CurrentCompany.companyId});
            }
        };
        $scope.remove = function() {
            MessageBox.show("Remove this company?", { style: 'confirm' })
                .then(function() {

                })
        };
    }
])