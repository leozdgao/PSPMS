angular.module("app.infoModule")

.controller('CompanyController', ['$scope', '$filter', 'CurrentCompany', 'CompanyFactory', 'Alert',
    function($scope, $filter, CurrentCompany, CompanyFactory, Alert){
        console.log('CompanyController called');
        $scope.CurrentCompany = CurrentCompany;
        $scope.statusStyle = $filter('projectStatusStyle');

        if(CurrentCompany) {
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
    }
])

.controller('EditCompanyController', ['$scope', '$state', 'CurrentCompany', 'CompanyFactory', 'MessageBox', 'Alert',
    function($scope, $state, CurrentCompany, CompanyFactory, MessageBox, Alert){
        $scope.CurrentCompany = CurrentCompany;
        $scope.eObj = angular.copy(CurrentCompany);
        $scope.tips = {
            clientId: "Recommend that clientID starts with '30' and its length better be 10.",
            serverFolder: "Folder name on server 208.",
            perforceFolder: "Folder name on P4v."
        };
        $scope.formstate = {
            submitting: false,
            submited: false,
            isInvalid: function(key) {
                return (this.submited || $scope.editCompanyForm.$dirty) && $scope.editCompanyForm[key].$invalid;
            }
        };
        $scope.submit = function() {
            $scope.formstate.submited = true;
            if($scope.editCompanyForm.$dirty && $scope.editCompanyForm.$valid) {
                $scope.formstate.submitting = true;
                CompanyFactory.set(CurrentCompany.companyId, $scope.eObj)
                    .then(function() {
                        $state.transitionTo('info.company', {companyId: CurrentCompany.companyId}, {reload: true});
                    })
                    .catch(function(e) {
                        Alert.add(e.msg || 'Error occurred while submit company.', 'danger');
                    })
                    .finally(function() {
                        $scope.formstate.submitting = false;
                    });
            }
            else {
                Alert.add('Cancel submitting for no changes.');
                $state.go('info.company', {companyId: CurrentCompany.companyId});
            }
        };
        $scope.remove = function() {
            MessageBox.show("Remove this company?", { style: 'confirm' })
                .then(function() {

                });
        };
        $scope.cancel = function() {
            $state.go('info.company', {companyId: CurrentCompany.companyId});
        };
    }
])

.controller('AddCompanyController', ['$scope', function($scope){
    $scope.isnew = true;
    $scope.obj = { test: "aa" };

    $scope.opts = {
        formClass: "form-horizontal",
        keys: {
            name: {
                label: "Company Name",
                attrs: {
                    "ng-required": true
                },
                validate: {
                    required: "Company Name is requied."
                }
            },
            clientId: {
                label: "ClientID",
                attrs: {
                    "ng-required": true,
                    "tooltip-trigger": "focus",
                    "tooltip-placement": "right",
                    tooltip: '"Recommend that clientID starts with \'30\' and its length better be 10."'
                },
                validate: {
                    required: "ClientID is requied."
                }
            },
            serverFolder: {
                label: "ServerFolder",
                attrs: {
                    "ng-required": true,
                    "tooltip-trigger": "focus",
                    "tooltip-placement": "right",
                    tooltip: '"Folder name on server 208."'
                },
                validate: {
                    required: "Server folder is requied."
                }
            }, 
            perforceFolder: {
                label: "PerforceFolder",
                attrs: {
                    "ng-required": true,
                    "tooltip-trigger": "focus",
                    "tooltip-placement": "right",
                    tooltip: '"Folder name on P4v."'
                },
                validate: {
                    required: "Perforce folder is requied."
                }
            } 
        },
        buttonGroup: {
            // exist by default
            submit: function() {

            },
            canel: function() {

            },
            // extra buttons
            remove: {
                text: "Remove",
                className: "btn btn-danger btn-sm pull-right",
                click: function() {}
            }
        }
    }
}]);
