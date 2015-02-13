angular.module('app.admin')

.factory('ResourceList', ['$cacheFactory', function($cacheFactory) {

	return $cacheFactory('resourceList');
}]);