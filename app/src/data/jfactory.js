angular.module("app.datacenter")

.factory('JobFactory', ['Job', function(Job){
    var cache = {};

    return {
        get: function() {

        },
        getJobOfDay: function(date) {
            var now = date, today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            var query = { conditions: { startDate: { $gte: today, $lt: tomorrow } } }
            return Job.query({ q: JSON.stringify(query) }).$promise;
        }
    }
}])