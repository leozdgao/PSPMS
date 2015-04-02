angular.module("app.datacenter")

.factory('CompanyFactory', ['$q' ,'Company', function($q, Company){
    var index = {}, index_id = {}, cache = [], p_cache = {};
    var lastupdate, lastmodify; // flags for company tree updating
    var countChange = false, filter = { text: "" };
    // var getall = false;

    return {
        filter: filter,
        countChange: countChange,
        get: function(cid) {
            var defer = $q.defer();

            if(angular.isDefined(cid)) {
                var i = index[cid];
                if(i >= 0 && cache[i]) defer.resolve(cache[i]);
                else Company.get({cid: cid}).$promise
                        .then(function(result) {
                            defer.resolve(result);
                        })
                        .catch(function() {
                            defer.resolve(null);
                        });
            }
            else {
                defer.resolve(null);
            }
            
            return defer.promise;
        },
        getById: function(id) {
            var i = index_id[id];
            if(i >= 0 && cache[i]) return cache[i];
        },
        add: function(newCompany) {
            // add a new company, and change the lastmodify
            return Company.insert(null, newCompany).$promise
                        .then(function(addedCompany) {
                            // add to cache
                            cache.push(addedCompany);
                            index[addedCompany.companyId] = cache.length - 1;
                            index_id[addedCompany._id] = cache.length - 1;

                            return addedCompany;
                        });
        },
        // update cache
        put: function(cid, update) {
            var i = index[cid];
            if(i > -1) {
                if(update) {
                    cache[i] = update;
                }
                else {
                    cache.splice(i, 1);
                    // re-index
                    for(var i = 0, l = cache.length; i < l; i++) {
                        var company = cache[i];
                        index[company.companyId] = i;
                        index_id[company._id] = i;
                    }
                }
            }
        },
        set: function(cid, newCompany) {
            // upload change, it needn't change the lastmodify
            return Company.update({cid: cid}, {update: newCompany}).$promise
                        .then(function(result) {
                            var company = result.new, i = index[cid];
                            if(i >=0 && cache[i]) {
                                cache[i] = company;
                            }
                        });
        },
        remove: function(cid) {
            // remove a company, and change the lastmodify
            var that = this;
            return Company.remove({cid: cid}).$promise
                        .then(function() {
                            // lastmodify = Date.now();
                            that.put(cid, void(0));
                        });
        },
        getProjectsBasic: function(cid) {
            var defer = $q.defer();

            if(p_cache && p_cache[cid]) defer.resolve(p_cache[cid]);
            else {
                Company.getProjectBasic({cid: cid}).$promise
                    .then(function(results) {
                        
                        results = results.sort(function(a, b) {
                            return a.project.name.toLowerCase()
                                    .localeCompare(b.project.name.toLowerCase());
                        }).map(function(item) { return item.project; }); 

                        p_cache[cid] = results;
                        defer.resolve(results);
                    });
            } 

            return defer.promise;
        },
        // update project basic
        putProjectBasic: function(cid, projects) {
            p_cache[cid] = projects;
        },
        // get companies
        refresh: function() {
            var defer = $q.defer(); console.log('refresh');

            if(cache.length <= 0 || lastmodify > lastupdate) {
                Company.query().$promise
                    .then(function(companies){
                        cache = companies;
                        // prepare cache
                        for(var i = 0, l = companies.length; i < l; i++) {
                            var company = companies[i];
                            index[company.companyId] = i;
                            index_id[company._id] = i;
                        }
                        // set expire date
                        lastupdate = Date.now();
                        lastmodify = lastupdate;

                        defer.resolve(sort(companies));
                    });
            }
            else {
                defer.resolve(sort(cache));
            } 

            return defer.promise;

            function sort(source) {
                var sorted = angular.copy(source);
                if(filter.text) {
                    sorted = sorted.filter(function(item) {
                        if(item && item.name) {
                            var match = item.name.toLowerCase().match("^" + filter.text.toLowerCase());
                            return match && match.length > 0;
                        }
                        else return false;
                    });
                }

                sorted.sort(function(a, b) {
                    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                });

                return sorted;
            }
        }
    }
}]);