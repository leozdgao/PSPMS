angular.module("app.authentication", [])

.constant("Role", {
	guest: 0,
	member: 1,
	leader: 2
})

.provider("AuthServiceProvider", ["$http", "$q", "Role",
	function($http, $q, Role) {
		return {
			$get: function() {

				// [Description]
				// - object for current user
				// [Properties]
				// - uid
				// - role
				// - token
				var user;

				return {
					login: function(uid, pwd) {

						var defer = $q.defer();
						var url = this.authUrl.login;

						$http.post(url, {
							uid: uid, pwd: pwd
						}).success(function(data) {
							user = data;
							defer.resolve(data);
						}).error(function(err) {
							defer.reject(err);
						});

						return defer.promise;
					},
					logout: function() {

						var defer = $q.defer();
						var url = this.authUrl.logout;

						$http.get(url).success(function() {
							user = void(0);
							defer.resolve();
						}).error(function(err) {
							defer.reject(err);
						});

						return defer.promise;
					},
					isAuthenticated: function(role) {

						if(typeof user == "undefined") {
							return false;
						}

						if(typeof role == "undefined") {
							return true;
						} 
						else {
							return user.role >= role;
						}
					},
					getCurrentUser: function() {
						return user;
					},
					getToken: function() {
						var cur = user || {};
						return cur.token;
					}
				}
			},
			authUrl: {
				login: "",
				logout: ""
			}
		}
	}
])