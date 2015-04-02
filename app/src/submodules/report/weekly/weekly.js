angular.module("app.reportModule")

.controller('WeeklyReportController', ['$scope', '$filter', 'CompanyFactory', 'JobFactory', 'Alert', 'DatepickerOption',
	function($scope, $filter, CompanyFactory, JobFactory, Alert, DatepickerOption) {
		// $scope.from = getDayOfWeek(new Date(), -3);
		// $scope.to = getDayOfWeek(new Date(), 3);
		$scope.fromDateOpts = new DatepickerOption();
		$scope.toDateOpts = new DatepickerOption();
		$scope.jobs = [];
		$scope.requesting = false;
		$scope.JobStatusStyle = $filter('JobStatusStyle');

		$scope.reset = initDate;
		$scope.refresh = function() { getJobOfDay($scope.from, $scope.to); }
		$scope.$watch('from', function(newVal, oldVal) {
		    if(newVal !== oldVal) {
		        getJobOfDay(newVal, $scope.to);
		    }
		});
		$scope.$watch('to', function(newVal, oldVal) {
		    if(newVal !== oldVal) {
		        getJobOfDay($scope.from, newVal);
		    }
		});

		initDate();

		setTimeout(function(){
		    $scope.refresh();
		}, 300);

		//init the week date
		function initDate(){
		    var today = new Date(),
		        day = today.getDay() - 1,
		        step = 86400000,
		        format = $filter("date");

		    $scope.from = format(new Date(today.getTime() - (day + 3) * step), "yyyy-MM-dd");
		    $scope.to = format(new Date(today.getTime() + (3 - day) * step), "yyyy-MM-dd");
		}

		function getJobOfDay(from, to) {
		    $scope.requesting = true;
		    // reset
		    $scope.projectJobs = [];
		    $scope.jobs = [];
		    JobFactory.getJobOfDay(new Date(from), new Date(to)).then(function(result) {
		        $scope.jobs = result;
		        $scope.resource = $filter('resource').apply(null, result.map(function(r) { return r.workers }));

		        $scope.total = getTotalWorkTime(result);

		        // map vm
		        var projectJobs = [];
		        result.forEach(function(job) {

		            var project;
		            for(var i = 0; i < projectJobs.length; i++) {
		                if(projectJobs[i]._id === job.projectId._id) project = projectJobs[i];
		            }

		            if(project) {
		                project.jobs.push(job);
		            }
		            else {
		                project = angular.copy(job.projectId);
		                project.jobs = [job];
		                var company = CompanyFactory.getById(project.companyId);
                		project.companyName = company && company.name;
                		projectJobs.push(project);
		            }
		        });
		        $scope.projectJobs = projectJobs.sort(function(a, b) {
		            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
		        });
		        console.log($scope.projectJobs);
		    })
		    .catch(function(err) {
		        Alert.add('Failed to get jobs.', 'danger');
		    })
		    .finally(function() {
		        $scope.requesting = false;
		    })
		}

		function getTotalWorkTime(jobs) {
		    jobs = jobs || [];
		    var result = 0;
		    jobs.forEach(function(job) {
		        job.workers = job.workers || [];
		        job.workers.forEach(function(worker) {
		            result += worker.hour;
		        });
		    });
		    return result;
		}
	}
]);