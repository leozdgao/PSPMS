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
	var user;

	return {
		getUser: function() {
			return user;
		},
		getToken: function() {
			var u = user || {};
			return u.token;
		},
		setUser: function(newUser) {
			user = newUser;
			// angular.copy(newUser, user);
		}
	}
}])

.provider("AuthService",
	function() {
		$get.$inject = ["$http", "$q", "UserService"];
		this.$get = $get;

		this.authUrl = {
			login: "http://localhost:3000/user/login",
			logout: "http://localhost:3000/user/logout"
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
						UserService.setUser(data);
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

					if(user && user.token) {
						$http.get(url).success(function() {
							UserService.setUser(void(0));
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
				isAuthenticated: function(role) {
					var user = UserService.getUser();

					if(typeof user == "undefined") {
						return false;
					}

					if(typeof role == "undefined") {
						return true;
					} 
					else {
						return user.role >= role;
					}
				}
			}
		}
	}
)

