angular.module("app.infoModule")

// controller for list company detail
.controller('CompanyController', ['$scope', '$filter', 'CurrentCompany', 'CompanyFactory', 'Alert',
    function($scope, $filter, CurrentCompany, CompanyFactory, Alert){
        console.log('CompanyController called');
        $scope.CurrentCompany = CurrentCompany;
        $scope.statusStyle = $filter('projectStatusStyle');

        if(CurrentCompany) {
            CompanyFactory.getProjectsBasic(CurrentCompany.companyId)
                .then(function(results) {
                    $scope.projectList = results;
                })
                .catch(function() {
                    Alert.add('Get project list failed.', 'danger');
                });
        }
    }
])

// controller for edit company
.controller('EditCompanyController', ['$scope', '$state', 'CurrentCompany', 'CompanyFactory', 'MessageBox', 'Alert', 'CompanyFormOptions',
    function($scope, $state, CurrentCompany, CompanyFactory, MessageBox, Alert, CompanyFormOptions){
        if(CurrentCompany === null) $state.go('info');
        else {
            $scope.CurrentCompany = CurrentCompany;
            $scope.eObj = angular.copy(CurrentCompany);
            // init form options
            var opts = CompanyFormOptions();
            // submit btn options
            opts.buttonGroup[0].click = function(data) {
                return CompanyFactory.set(CurrentCompany.companyId, data)
                    .then(function() {
                        $state.transitionTo('info.company', {companyId: CurrentCompany.companyId}, {reload: true});
                    })
                    .catch(function(e) {
                        Alert.add(e.msg || 'Error occurred while submit company.', 'danger');
                    });
            };  
            opts.buttonGroup[0].onsubmitcancel = function() {
                Alert.add('Cancel submitting for no changes.');
                $state.go('info.company', {companyId: CurrentCompany.companyId});
            };
            // cancel btn options
            opts.buttonGroup[1].click = function() {
                $state.go('^');
            };
            // extra remove btn
            opts.buttonGroup[2] = {
                text: 'Remove',
                className: 'btn btn-danger btn-sm pull-right',
                click: function() {
                    MessageBox.show("Remove this company?", { style: 'confirm' })
                        .then(function() {
                            CompanyFactory.remove(CurrentCompany.companyId)
                                .then(function() {
                                    // redirect to state 'info'
                                    $state.transitionTo('info', null, {reload: true});
                                })
                                .catch(function(e) { // handle exception
                                    Alert.add(e.msg || 'Error occurred while remove a company.', 'danger');
                                });
                        });
                }
            };
            $scope.opts = opts;
            $scope.back = opts.buttonGroup[1].click; // back clicked
        }
    }
])

// controller for add company
.controller('AddCompanyController', ['$scope', '$state', 'CompanyFormOptions', 'CompanyFactory', 'Alert',
    function($scope, $state, CompanyFormOptions, CompanyFactory, Alert){
        
        var opts = CompanyFormOptions();
        // submit btn options
        opts.buttonGroup[0].click = function(data) {
            return CompanyFactory.add(data)
                .then(function() {
                    // redirect to state 'info'
                    $state.transitionTo('info', null, {reload: true});
                })
                .catch(function(e) { // handle exception
                    Alert.add(e.msg || 'Error occurred while add new company.', 'danger');
                });
        };
        // cancel btn options
        opts.buttonGroup[1].click = function() { $state.go('info'); };
        $scope.opts = opts;
    }
]);
