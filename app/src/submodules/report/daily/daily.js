angular.module("app.reportModule")

.controller('DailyReportController', ['$scope', '$filter', 'JobFactory', 'Alert',
    function($scope, $filter, JobFactory, Alert){

    $scope.dt = new Date();
    $scope.jobs = [];
    $scope.requesting = false;
    $scope.JobStatusStyle = $filter('JobStatusStyle');

    $scope.reset = function() { $scope.dt = new Date(); }
    $scope.refresh = function() { getJobOfDay($scope.dt); }
    $scope.export = function() {
        exportDailyReport($scope.jobs)
            .then(function() {
                Alert.add('Daily report exported.', 'success');
            })
            .catch(function() {
                Alert.add('Failed to export daily report.', 'danger');
            });
    }
    $scope.$watch('dt', function(newVal, oldVal) {
        if(newVal !== oldVal) {
            getJobOfDay(newVal, newVal);
        }
    });

    setTimeout(function(){
        getJobOfDay($scope.dt);
    }, 300);

    function getJobOfDay(date) {
        $scope.requesting = true;
        // reset
        $scope.projectJobs = [];
        $scope.jobs = [];
        var day = new Date(date);
        JobFactory.getJobOfDay(day, day).then(function(result) {
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
                    projectJobs.push(project);
                }
            });
            $scope.projectJobs = projectJobs.sort(function(a, b) {
                return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
            });
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
}])
