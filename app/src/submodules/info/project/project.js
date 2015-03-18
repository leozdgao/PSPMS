angular.module("app.infoModule")

.controller('ProjectController', ['$scope', '$filter', 'CurrentCompany', 'CurrentProject', 'ProjectFactory', 'Alert',
    function($scope, $filter, CurrentCompany, CurrentProject, ProjectFactory, Alert){
        $scope.CurrentProject = CurrentProject;
        $scope.CurrentCompany = CurrentCompany;
        $scope.statusStyle = $filter('projectStatusStyle');

        ProjectFactory.getEncryptKey(CurrentProject.projectId, [
            { clientId: CurrentCompany.clientId, assemblyName: CurrentProject.assemblyName },
            { clientId: ProjectFactory.adminClientId, assemblyName: CurrentProject.assemblyName }
        ]).then(function(kvs) {
            $scope.CurrentProject.key = kvs[CurrentCompany.clientId];
            $scope.CurrentProject.testKey = kvs[ProjectFactory.adminClientId];
        }).catch(function() {
            Alert.add("Can't get encrypt key.", 'danger');
        });
    }
])