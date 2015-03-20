angular.module("app.infoModule")

.controller('ProjectController', ['$scope', '$filter', 'CurrentCompany', 'CurrentProject', 'ProjectFactory', 'Alert',
    function($scope, $filter, CurrentCompany, CurrentProject, ProjectFactory, Alert){
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