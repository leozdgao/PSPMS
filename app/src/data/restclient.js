angular.module("app.datacenter", ["ngResource"])

.factory("Company", ["$resource", function ($resource) {
	return $resource("/proxy/rest/company", null, {
		get: { method: "GET", isArray: true, headers: { "Pragma": "no-cache", "Cache-Control": "no-cache" }, cache: true },
		insert: { method: "POST" },
		update: { method: "PUT" },
		remove: { method: "DELETE" }
	});
}])

.factory("Project", ["$resource", function ($resource) {
	return $resource("/proxy/rest/project", null, {
		get: { method: "GET", isArray: true, headers: { "Pragma": "no-cache", "Cache-Control": "no-cache" }, cache: true },
		insert: { method: "POST" },
		update: { method: "PUT" },
		remove: { method: "DELETE" }
	});
}])

.factory("Resource", ["$resource", function ($resource) {
	return $resource("/proxy/rest/resource", null, {
		get: { method: "GET", isArray: true, headers: { "Pragma": "no-cache", "Cache-Control": "no-cache" }, cache: true },
		insert: { method: "POST" },
		update: { method: "PUT" },
		remove: { method: "DELETE" }
	});
}])

.factory('Session', ['$resource', function($resource){
	return $resource("/proxy/rest/session", null, {
		get: { method: "GET", isArray: true, headers: { "Pragma": "no-cache", "Cache-Control": "no-cache" }, cache: true },
		insert: { method: "POST" },
		update: { method: "PUT" },
		remove: { method: "DELETE" }
	});
}]);