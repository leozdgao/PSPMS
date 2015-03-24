angular.module("app.infoModule")

.factory('ProjectFactory', ['$q', '$http', 'Project', function($q, $http, Project){
    var index = {}, cache = [], k_cache = {}, d_cache = {};

    return {
        adminClientId: '3010000444',
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
        },
        set: function(pid, newProject, newCid) {
            // upload change, it needn't change the lastmodify
            var promise;
            if(newCid) {
                promise = Project.updateCompany({pid: pid}, { companyId: newCid }).$promise
                    .then(function() {
                        return Project.update({pid: pid}, {update: newProject}).$promise
                    });                    
            }
            else {
                promise = Project.update({pid: pid}, {update: newProject}).$promise;
            }
             
            return promise.then(function(result) {
                        var project = result.new, i = index[pid];
                        if(i >=0 && cache[i]) {
                            cache[i] = project;
                        }
                    });           
        },
        getEncryptKey: function(pid, kvs) {
            if(!angular.isArray(kvs)) kvs = [ kvs ];

            var defer = $q.defer();
            if(k_cache[pid]) defer.resolve(k_cache[pid]);
            else {
                Project.getKeys(null, {kvs: kvs}).$promise
                    .then(function(result) {
                        // convert result
                        var obj = {};
                        for(var i = 0, l = result.length || 0; i < l; i++) {
                            var kv = result[i];
                            obj[kv.Key] = kv.Value;    
                        }
                        // cache
                        k_cache[pid] = obj;
                        defer.resolve(obj);
                    })
                    .catch(function(err) {
                        defer.reject(err);
                    })
            }

            return defer.promise;
        },
        getDocuments: function(pid, cName, pName) {
            var defer = $q.defer();

            if(d_cache[pid]) defer.resolve(d_cache[pid]);
            else {
                $http.get('/file/' + cName + '/' + pName + '/Documents?stat=dir')
                    .success(function(data) {

                        var results = [];
                        if(Array.isArray(data.files)) {
                            data.files = data.files.map(function(file) {
                                return {
                                    href: '/file' + file.replace(/\\/g, '/'),
                                    name: file.split('\\').pop()
                                }
                            });
                        }
                        d_cache[pid] = data.files;
                        defer.resolve(data.files);
                    })
                    .error(function(err) {
                        defer.reject(err);
                    });
            }

            return defer.promise;
        }
    }
}])