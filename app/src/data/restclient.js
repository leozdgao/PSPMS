angular.module('app.datacenter', [])

.provider('restClient', ['$http', '$q', function ($http, $q) {
	return {
		$get: function () {
			var selfConfig = this;
			var cache = {};

			return {
				// GET
				tryFind: function (target, query, force) {
					if(!angular.isString(target)) throw new Error('Target should be a string.');
					if(!angular.isObject(query)) throw new Error('Query object is necessary.');

					var defer = $q.defer();

					var appcache = selfConfig.appcache;
					var cacheExpireTime = selfConfig.cacheExpireTime;
					var targetOption = selfConfig.targetMapping[target] || {};
					var requestUrl = String.prototype.concat.call(selfConfig.requestRoot, '/', targetOption.requestUrl || target);
					var needCache = appcache || !!targetOption.cache;
					var cacheKey = JSON.stringify(query);
					var resolved = false;

					if(!force && needCache) {
						var cacheTarget = cache[target] || {};
						if(angular.isDefined(cacheTarget[cacheKey])) {
							defer.resolve(cacheTarget[cacheKey]);
							resolved = true;
						}
					}
					
					if(!resolved) {
						$http.get(requestUrl, {
							params: query,
							headers: {
								// prevent 304
								Pragma: 'no-cache'
							}
						}).success(function (results) {
							if(Array.isArray(results)) {
								defer.resolve(results);

								// put results to cache if necessary
								if(needCache) {
									var cacheTarget = cache[target] || {};
									cacheTarget[cacheKey] = results;

									// cache expire
									setTimeout(function () {
										cacheTarget[cacheKey] = void(0);
									}, cacheExpireTime);
								}
							}
							else {
								defer.reject(new Error(String.prototype.concat.call('Invalid response format. Target: ', target));
							}
						}).error(function (err) {

							defer.reject(err);
						});
					}

					return defer.promise;
				},
				// POST
				tryInsert: function (target, obj) {
					// body...
				},
				// PUT
				tryUpdate: function (target, obj) {
					// body...
				},
				// DELETE
				tryRemove: function (target) {

				}
			}
		},
		appcache: true,
		cacheExpireTime: 1000 * 60 * 2 //default cache 2min
		targetMapping: {
			'company': {
				cache: true,
				// requestUrl: ''
			},
			'project': {
				cache: true
			}
		},
		requestRoot: '/proxy/rest',
		requestHeaders: {
			'Pragma': 'no-cache'
		}
	}
}]);