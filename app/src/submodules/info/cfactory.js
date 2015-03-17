angular.module("app.infoModule")

.factory('CompanyFactory', ['$q' ,'Company', function($q, Company){
    var index = {}, cache = [], p_cache = {};
    var lastupdate, lastmodify; // flags for company tree updating
    var countChange = false, filter = { text: "" };

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
        add: function(newCompany) {
            // add a new company, and change the lastmodify
            return Company.insert(null, newCompany).$promise
                        .then(function(addedCompany) {
                            // add to cache
                            cache.push(addedCompany);
                            index[addedCompany] = cache.length - 1;
                            lastmodify = Date.now();
                        });
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
            return Company.remove({cid: cid}).$promise
                        .then(function() {
                            lastmodify = Date.now();
                        });
        },
        getProjectsBasic: function(cid) {
            var defer = $q.defer();

            if(p_cache && p_cache[cid]) defer.resolve(p_cache[cid]);
            else {
                Company.getProjectBasic({cid: cid}).$promise
                    .then(function(results) {
                        
                        results = results.sort(function(a, b) {
                            return +function compare(t0, t1) {
                                if(t0.charCodeAt(0) == t1.charCodeAt(0)) {
                                    return compare(t0.slice(1), t1.slice(1));
                                }
                                else {
                                    return t0.charCodeAt(0) - t1.charCodeAt(0);
                                }
                            }(a.project.name.toLowerCase(), b.project.name.toLowerCase());
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
            var defer = $q.defer();

            if(cache.length <= 0 || lastmodify > lastupdate) {
                Company.query().$promise
                    .then(function(companies){
                        cache = companies;
                        // prepare cache
                        for(var i = 0, l = companies.length; i < l; i++) {
                            var company = companies[i];
                            index[company.companyId] = i;
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
                    return +function compare(t0, t1) {
                        if(t0.charCodeAt(0) == t1.charCodeAt(0)) {
                            t0 = t0.slice(1);
                            t1 = t1.slice(1);
                            return compare(t0, t1);
                        }
                        else return t0.charCodeAt(0) - t1.charCodeAt(0);
                    }(a.name.toLowerCase(), b.name.toLowerCase());
                });

                return sorted;
            }
        },
        // return a copy of current cache
        // getAll: function() {
        //     return angular.copy(cache);
        // }
    }
}]);