angular.module('app.datacenter', [])

.provider('', function () {
	return {
		$get: function () {
			var selfConfig = this;
			var cache = {};

			return {
			}
		},
		appcache: true,
		requestRoot: '/proxy',
		methodRequestPaths: {
			//query
			'get': [],
			//insert
			'post': [],
			//update
			'put': [],
			//remove
			'delete': []
		}
	}
})