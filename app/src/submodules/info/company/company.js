angular.module("app.infoModule")

.controller('CompanyController', ['$scope', '$filter', 'CurrentCompany', 'CompanyFactory', 'Alert',
	function($scope, $filter, CurrentCompany, CompanyFactory, Alert){
		$scope.CurrentCompany = CurrentCompany;
		$scope.statusStyle = $filter('projectStatusStyle');

		CompanyFactory.getProjectsBasic(CurrentCompany.companyId)
			.then(function(results) {
				$scope.projectList = results.sort(function(a, b) {
	                return +function compare(t0, t1) {
	                    if(t0.charCodeAt(0) == t1.charCodeAt(0)) {
	                        return compare(t0.slice(1), t1.slice(1));
	                    }
	                    else return t0.charCodeAt(0) - t1.charCodeAt(0);
	                }(a.project.name.toLowerCase(), b.project.name.toLowerCase());
	            }).map(function(item) { return item.project; });
			})
			.catch(function() {
				Alert.add('Get project list failed.', 'danger');
			});
	}
])