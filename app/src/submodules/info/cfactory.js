angular.module("app.infoModule")

.factory('CompanyFactory', ['$q' ,'Company', function($q, Company){
    var index = {}, cache = [], p_cache = {};

    return {
        get: function(cid) {
            var defer = $q.defer();

            if(angular.isDefined(cid)) {
                var i = index[cid];
                if(i >= 0 && cache[i]) defer.resolve(cache[i]);
                else {
                    Company.get({cid: cid}).$promise
                        .then(function(result) {
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
        set: function(cid, newCompany) {

        },
        getProjectsBasic: function(cid) {
        	var defer = $q.defer();

        	if(p_cache && p_cache[cid]) defer.resolve(p_cache[cid]);
        	else {
        		Company.getProjectBasic({cid: cid}).$promise
        			.then(function(results) {
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
        // index companies
        refresh: function(companies) {
            cache = companies;
            // prepare cache
            for(var i = 0, l = companies.length; i < l; i++) {
                var company = companies[i];
                index[company.companyId] = i;
            }
        },
        // return a copy of current cache
        getAll: function() {
            return angular.copy(cache);
        }
    }
}]);