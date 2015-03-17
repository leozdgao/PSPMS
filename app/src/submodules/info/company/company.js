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

.controller('EditCompanyController', ['$scope', '$state', 'CurrentCompany', 'CompanyFactory', 'MessageBox', 'Alert', 'CompanyFormOptions',
    function($scope, $state, CurrentCompany, CompanyFactory, MessageBox, Alert, CompanyFormOptions){
        $scope.CurrentCompany = CurrentCompany;
        $scope.eObj = angular.copy(CurrentCompany);
        // init form options
        var opts = CompanyFormOptions();
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
        opts.buttonGroup[1].click = function() {
            $state.go('info.company', {companyId: CurrentCompany.companyId});
        };
        opts.buttonGroup[2] = {
            text: 'Remove',
            className: 'btn btn-danger btn-sm pull-right',
            click: function() {
                MessageBox.show("Remove this company?", { style: 'confirm' })
                    .then(function() {

                    });
            }
        };
        $scope.opts = opts;
        $scope.back = opts.buttonGroup[1].click; // back clicked
    }
])

.controller('AddCompanyController', ['$scope', '$state', 'CompanyFormOptions',
    function($scope, $state, CompanyFormOptions){
        
        var opts = CompanyFormOptions();
        opts.buttonGroup[1].click = function() { $state.go('info'); };
        $scope.opts = opts;
    }
]);
