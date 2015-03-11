angular.module("app.infoModule")

.controller('CompanyController', ['$scope', 'CurrentCompany', 'CompanyFactory',
	function($scope, CurrentCompany, CompanyFactory){
		$scope.CurrentCompany = CurrentCompany;

		CompanyFactory.getProjectsBasic(CurrentCompany.companyId)
			.then(function(results) {
				$scope.projectList = results.sort(function(a, b) {
	                return +function compare(t0, t1) {
	                    if(t0.charCodeAt(0) == t1.charCodeAt(0)) {
	                        t0 = t0.slice(1);
	                        t1 = t1.slice(1);
	                        return compare(t0, t1);
	                    }
	                    else return t0.charCodeAt(0) - t1.charCodeAt(0);
	                }(a.project.name.toLowerCase(), b.project.name.toLowerCase());
	            }).map(function(item) { return item.project; });
			});
	}
])