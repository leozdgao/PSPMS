angular.module("app.reportModule", ['ui.router', 'app.auth'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state("report", {
		    url: "/report",
		    views: {
                "": {
                    templateUrl: "/template/index.html"
                },
                "general@report": {
                	templateUrl: "/template/submodules/report/index.html"
                },
                "report-content@report": {
                	templateUrl: "/template/submodules/report/daily/index.html",
                	controller: "DailyReportController"
                }
            },
            resolve: {
                isLogged: 'RelogService',
                companies: ['CompanyFactory', function(CompanyFactory) {
                	return CompanyFactory.refresh();
                }]
            },
            // abstract: true,
            access_control: 1
		})
		.state("report.weekly", {
			url: "/weekly",
			views: {
				"report-content": {
					templateUrl: "/template/submodules/report/weekly/index.html",
					controller: "WeeklyReportController"
				}
			},
			access_control: 1
		})
		.state("report.projects", {
			url: "/projects",
			views: {
				"report-content": {
					templateUrl: "/template/submodules/report/projects/index.html"
				}
			},
			access_control: 1
		});
}])