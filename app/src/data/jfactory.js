angular.module("app.datacenter")

.factory('JobFactory', ['Job', function(Job){
    var cache = {};

    return {
        get: function() {

        },
        getJobOfDay: function(from, to) {
            var today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
            var tomorrow = new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1);
            var query = { conditions: { startDate: { $gte: today, $lt: tomorrow } } }
            return Job.query({ q: JSON.stringify(query) }).$promise;
        }
    }
}])