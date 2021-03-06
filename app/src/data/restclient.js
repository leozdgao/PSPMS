angular.module("app.datacenter", ["ngResource"])

.factory("Company", ["$resource", function ($resource) {
	return $resource("/rest/company/:cid", null, {
		get: { method: "GET", cache: false },
		query: { method: "GET", isArray: true, cache: false },
		getProjectBasic: { method: "GET", url: "/rest/company/:cid/projects", isArray: true, cache: false },
		insert: { method: "POST" },
		update: { method: "PUT" },
		remove: { method: "DELETE" }
	});
}])

.factory("Project", ["$resource", function ($resource) {
	return $resource("/rest/project/:pid", null, {
		get: { method: "GET", cache: false },
		query: { method: "GET", isArray: true, cache: false },
		insert: { method: "POST", isArray: true },
		getKeys: { method: "POST", isArray: true, url: "/services/encryptkey" },
		update: { method: "PUT" },
		updateCompany: { method: "PUT", url: "/rest/project/:pid/company" },
		remove: { method: "DELETE", isArray: true }
	});
}])

.factory("Resource", ["$resource", function ($resource) {
	return $resource("/rest/resource/:id", null, {
		get: { method: "GET", isArray: true, cache: false },
		insert: { method: "POST" },
		update: { method: "PUT" },
		remove: { method: "DELETE" },
		createAccount: { method: "POST", url: "/user/signup" },
		resetAccount: { method: "POST", url: "/user/resetaccount" }
	});
}])

.factory("Job", ['$resource', function($resource) {
	return $resource("/rest/job/:id", null, {
		get: { method: "GET", cache: false },
		query: { method: "GET", isArray: true, cache: false },
		insert: { method: "POST" },
		update: { method: "PUT" },
		remove: { method: "DELETE" }
	});
}])

// .factory('Session', ['$resource', function($resource){
// 	return $resource("/proxy/rest/session", null, {
// 		get: { method: "GET", isArray: true, headers: { "Pragma": "no-cache", "Cache-Control": "no-cache" }, cache: true },
// 		insert: { method: "POST" },
// 		update: { method: "PUT" },
// 		remove: { method: "DELETE" }
// 	});
// }]);