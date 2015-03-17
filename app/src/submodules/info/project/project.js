angular.module("app.infoModule")

.controller('ProjectController', ['$scope', 'CurrentCompany', 'CurrentProject', 
	function($scope, CurrentCompany, CurrentProject){
		$scope.CurrentProject = CurrentProject;
		$scope.CurrentCompany = CurrentCompany;
	}
])