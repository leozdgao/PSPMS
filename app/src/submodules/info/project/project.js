angular.module("app.infoModule")

.controller('ProjectController', ['$scope', '$filter', 'CurrentCompany', 'CurrentProject', 'ProjectFactory', 'Alert',
    function($scope, $filter, CurrentCompany, CurrentProject, ProjectFactory, Alert) {
        $scope.CurrentProject = CurrentProject;
        $scope.CurrentCompany = CurrentCompany;
        $scope.statusStyle = $filter('projectStatusStyle');

        if(CurrentProject != null && CurrentCompany != null) {
            ProjectFactory.getEncryptKey(CurrentProject.projectId, [
                { clientId: CurrentCompany.clientId, assemblyName: CurrentProject.assemblyName },
                { clientId: ProjectFactory.adminClientId, assemblyName: CurrentProject.assemblyName }
            ]).then(function(kvs) {
                $scope.CurrentProject.key = kvs[CurrentCompany.clientId];
                $scope.CurrentProject.testKey = kvs[ProjectFactory.adminClientId];
            }).catch(function() {
                Alert.add("Can't get encrypt key.", 'danger');
            });

            ProjectFactory.getDocuments(CurrentProject.projectId, CurrentCompany.name, CurrentProject.name)
                .then(function(docs) {
                    $scope.documents = docs;
                })
                .catch(function() {
                    Alert.add("Can't get documents info.", 'danger');
                });    
        }
    }
])

.controller('EditProjectController', ['$scope', '$state', '$filter', 'CurrentCompany', 'CurrentProject', 'CompanyFactory', 'ProjectFactory',
    'ProjectFormOptions', 'DatepickerOption', 'MessageBox', 'Alert',
    function($scope, $state, $filter, CurrentCompany, CurrentProject, CompanyFactory, ProjectFactory,
        ProjectFormOptions, DatepickerOption, MessageBox, Alert) {
        if(CurrentCompany === null || CurrentProject === null) $state.go('info');
        else {
            $scope.CurrentCompany = CurrentCompany;
            $scope.CurrentProject = CurrentProject;

            $scope.formstate = {
                submitting: false,
                submited: false,
                isInvalid: function(key) {
                    return (this.submited || $scope.editProjectForm[key].$dirty) && $scope.editProjectForm[key].$invalid;
                }
            };

            $scope.eObj = angular.copy(CurrentProject);
            $scope.startDateOpts = new DatepickerOption();
            $scope.lastUpdateDateOpts = new DatepickerOption();
            $scope.projectStatus = [0,1,2,3,4,9].map(function(id) {
                return {
                    id: id,
                    name: $filter('projectStatus')(id)
                }
            });
            CompanyFactory.refresh().then(function(companies) {
                $scope.availableCompanies = companies;    
            });
            // get products
            CompanyFactory.getProjectsBasic(1146).then(function(products) {
                $scope.availableProducts = products;
            });

            $scope.submit = function() {
                $scope.formstate.submited = true;
                if($scope.editProjectForm.$dirty && $scope.editProjectForm.$valid) {
                    $scope.formstate.submitting = true;
                    ProjectFactory.set(CurrentProject.projectId, $scope.eObj)
                        .then(function() {
                            $state.transitionTo('info.company.project',
                                {companyId: CurrentCompany.companyId, pid: CurrentProject.projectId}, {reload: true});
                        })
                        .catch(function(e) {
                            Alert.add(e.msg || 'Error occurred while submit company.', 'danger');
                        })
                        .finally(function() {
                            $scope.formstate.submitting = false;
                        });
                }
            }
            $scope.reset = function() {
                $scope.eObj = angular.copy(CurrentProject);
            }
            $scope.back = function() {
                $state.go('^'); // back to parent state
            }
            $scope.remove = function() {
                MessageBox.show("Remove this project?", { style: 'confirm' })
                    .then(function() {

                    });
            }
            $scope.productOnChange = function() {
                var mergeKeys = [ "assemblyName", "sourceCode", "serverFolder", "perforceFolder", "isPlugin",
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
    }
]);
