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

.controller('EditProjectController', ['$scope', '$state', 'CurrentCompany', 'CurrentProject', 'CompanyFactory', 'ProjectFactory',
    'ProjectFormOptions', 'DatepickerOption', 'MessageBox', 'Alert',
    function($scope, $state, CurrentCompany, CurrentProject, CompanyFactory, ProjectFactory,
        ProjectFormOptions, DatepickerOption, MessageBox, Alert) {
        if(CurrentCompany === null || CurrentProject === null) $state.go('info');
        else {
            $scope.CurrentCompany = CurrentCompany;
            $scope.CurrentProject = CurrentProject;

            $scope.eObj = angular.copy(CurrentProject);

            var newCid, companyChanged = false;;
            $scope.submit = function() {
                if(companyChanged) newCid = $scope.eObj.companyId;
                return ProjectFactory.set(CurrentProject.projectId, $scope.eObj, newCid)
                        .then(function(result) { console.log(cid);
                            var cid = result[1]; // maybe change company
                            $state.transitionTo('info.company.project',
                                {companyId: cid || CurrentCompany.companyId, pid: CurrentProject.projectId}, {reload: true});
                        })
                        .catch(function(e) {
                            Alert.add(e.msg || 'Error occurred while submit project.', 'danger');
                        });
            }
            $scope.back = function() {
                $state.go('^'); // back to parent state
            }   
            $scope.reset = function() {
                $scope.eObj = angular.copy(CurrentProject);
            }
            $scope.remove = function() {
                MessageBox.show("Remove this project?", { style: 'confirm' })
                    .then(function() {
                        ProjectFactory.remove(CurrentProject.projectId, CurrentCompany.companyId)
                            .then(function(result) {
                                $state.transitionTo('info.company', { companyId: result }, {reload: true});
                            })
                            .catch(function(e) {
                                Alert.add(e.msg || 'Error occurred while submit project.', 'danger');
                            });
                    });
            }
            $scope.$watch('eObj.companyId', function(newVal, oldVal) {
                if(newVal != oldVal) {
                    companyChanged = true;
                }
            });
        }
    }
])

.controller('AddProjectController', ['$scope', '$state', '$filter', 'CurrentCompany', 'ProjectFactory', 'Alert',
    function($scope, $state, $filter, CurrentCompany, ProjectFactory, Alert){
        if(CurrentCompany === null) $state.go('info');
        else {
            var defaultVal = {
                companyId: CurrentCompany._id,
                startDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
                lastUpdateDate: $filter('date')(new Date(), 'yyyy-MM-dd'),
                status: 1
            }
            $scope.CurrentCompany = CurrentCompany;
            $scope.isNew = true;
            $scope.eObj = angular.copy(defaultVal);

            $scope.submit = function() {
                return ProjectFactory.add($scope.eObj)
                        .then(function(result) {
                            $state.transitionTo('info.company.project',
                                {companyId: CurrentCompany.companyId || CurrentCompany.companyId, pid: result.projectId}, {reload: true});
                        })
                        .catch(function(e) {
                            Alert.add(e.msg || 'Error occurred while submit project.', 'danger');
                        });
            };
            $scope.back = function() {
                $state.go('^'); // back to parent state
            };  
            $scope.reset = function() {
                $scope.eObj = angular.copy(defaultVal);
            };
        }
    }
])
