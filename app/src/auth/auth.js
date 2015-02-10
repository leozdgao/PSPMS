angular.module("app.auth", [])

.constant("Role", {
	guest: 0,
	member: 1,
	leader: 2,
	admin: -1
})

// [Interceptor] add token to request params
.factory('AuthTokenInterceptor', ['$q', 'UserService', 
	function($q, UserService){
		return {
			request: function(config) {
				var token = UserService.getToken();
				if(angular.isDefined(token)) {
					config.params = config.params || {};
					config.params.token = token;
				}

				return config;
			}
		};
	}
])

.factory('UserService', [function(){
	var user, session;

	return {
		getUser: function() {
			return user;
		},
		getToken: function() {
			session = session || {};
			return session.token;
		},
		getRole: function() {
			session = session || {};
			return session.role;
		},
		setSession: function(sess) {
			session = sess || {};
			user = session.resource;
		},
		getSession: function() {console.log(session);
			return session;
		}
	}
}])

.provider("AuthService",
	function() {
		$get.$inject = ["$http", "$q", "UserService"];
		this.$get = $get;

		this.authUrl = {
			login: "/user/login",
			logout: "/user/logout",
			relog: "/user/relog"
		}

		var self = this;
		function $get($http, $q, UserService){

			// [Description]
			// - object for current user
			// [Properties]
			// - uid
			// - role
			// - token

			return {
				login: function(uid, pwd) {

					var defer = $q.defer();
					var url = self.authUrl.login;

					$http.post(url, {
						uid: uid, pwd: pwd
					}).success(function(data) {
						UserService.setSession(data.session);
						defer.resolve(data);
					}).error(function(err) {
						defer.reject(err);
					});

					return defer.promise;
				},
				logout: function() {

					var defer = $q.defer();
					var url = self.authUrl.logout;
					var user = UserService.getUser();
					var session = UserService.getSession();

					if(user) {
						$http.get(url, {
							headers: { "Pragma": "no-cache", "Cache-Control": "no-cache" }
						}).success(function() {
							UserService.setSession(void(0));
							defer.resolve();
						}).error(function(err) {
							defer.reject(err);
						});
					}
					else {
						defer.reject(new Error("Can't get current user."));
					}

					return defer.promise;
				},
				isAuthenticated: function(r) {
					var role = UserService.getRole();console.log(role);

					if(angular.isUndefined(role)) return false;

					if(typeof r == "undefined") {
						return true;
					} 
					else {console.log(role >= r);
						return role >= r;
					}
				},
				relog: function(token) {

					var defer = $q.defer();
					var url = self.authUrl.relog;

					$http.get(url, {
						params: { token: token },
						headers: { "Pragma": "no-cache", "Cache-Control": "no-cache" }
					}).success(function(session) {

						UserService.setSession(session);						
						defer.resolve(session.resource);
					}).error(function() {

						defer.reject();
					});

					return defer.promise;
				}
			}
		}
	}
)

