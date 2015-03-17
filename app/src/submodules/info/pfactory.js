angular.module("app.infoModule")

.factory('ProjectFactory', ['$q' ,'Project', function($q, Project){
    var index = {}, cache = [];

    return {
        get: function(pid) {
            var defer = $q.defer();

            if(angular.isDefined(pid)) {
                var i = index[pid];
                if(i >= 0 && cache[i]) defer.resolve(cache[i]);
                else {
                    Project.get({pid: pid}).$promise
                        .then(function(result) {
                            cache.push(result);
                            index[pid] = cache.length - 1;
                            defer.resolve(result);
                        })
                        .catch(function() {
                            defer.resolve(null);
                        });
                }
            }
            else {
                defer.resolve(null);
            } 

            return defer.promise;
        }
    }
}])