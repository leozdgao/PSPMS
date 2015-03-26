angular.module("app.datacenter")

.factory('ProjectFactory', ['$q', '$http', '$filter', 'Project', 'CompanyFactory',
    function($q, $http, $filter, Project, CompanyFactory){        
        var index = {}, cache = [], k_cache = {}, d_cache = {};
        var projectStatus = [0,1,2,3,4,9].map(function(id) {
                    return {
                        id: id,
                        name: $filter('projectStatus')(id)
                    }
                });

        return {
            adminClientId: '3010000444',
            projectStatus: projectStatus,
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
            add: function(newProject) {
                // add a new project
                return Project.insert(null, newProject).$promise
                            .then(function(result) {
                                // add to cache
                                var addedProject = result[0], company = result[1];
                                cache.push(addedProject);
                                index[addedProject.projectId] = cache.length - 1;

                                CompanyFactory.put(company.companyId, company);
                                CompanyFactory.putProjectBasic(company.companyId, void(0));

                                return addedProject;
                            });
            },
            set: function(pid, newProject, newCid) {
                var promise, cid;
                if(newCid) {
                    promise = Project.updateCompany({pid: pid}, { companyId: newCid }).$promise
                        .then(function(result) {
                            var newC = result.new[1], oldC = result.new[2];
                            // update company cache
                            if(newC) {
                                CompanyFactory.put(newC.companyId, newC);
                                CompanyFactory.putProjectBasic(newC.companyId, void(0));
                                cid = newC.companyId;
                            } 
                            if(oldC) {
                                CompanyFactory.put(oldC.companyId, oldC);
                                CompanyFactory.putProjectBasic(oldC.companyId, void(0));
                            } 
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

                            return [pid, cid];
                        });           
            },
            remove: function(pid, cid) {
                return Project.remove({pid: pid}).$promise
                            .then(function(result) { console.log(result);
                                var newC = result && result[0];
                                CompanyFactory.put(newC.companyId, newC)
                                CompanyFactory.putProjectBasic(newC.companyId, void(0));

                                return newC.companyId;
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