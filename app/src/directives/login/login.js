angular.module("app.directives")

.factory('LoginPanel', ['$modal', function($modal){
	var modalInstance;

	return {
		show: function(onLogin) {
			modalInstance = $modal.open({
				templateUrl: "/template/directives/login/template.html",
				controller: "LoginPanelController",
				resolve: {
					onLogin: function() {
						return onLogin;
					}
				},
                backdrop: 'static',
                keyboard: false
			});

			return modalInstance.result;
		}
	};
}])

.controller('LoginPanelController', ['$scope', '$modalInstance', 'onLogin',
	function($scope, $modalInstance, onLogin){
		
		$scope.form = {
			submitted: false,
			requesting: false,
			user: "",
			password: "",
			message: "",
			loginClicked: function() {

				$scope.form.submitted = true;
				validateMessage();

				if($scope.loginForm.$valid) {

					$scope.form.requesting = true;

					onLogin($scope.form.user, $scope.form.password)
						.then(function(user) {

							//resolved by user
							$modalInstance.close(user);
						})
						.catch(function(err) {

							$scope.form.message = err ? (err.msg || "Login failed."): "Login failed.";
						})
						.finally(function() {

							$scope.form.submitted = false;
							$scope.form.requesting = false;
						});
				}	
			},
			isInvalid: function(target, type) {
				var target = $scope.loginForm[target] || {};

				if((target.$dirty || $scope.form.submitted) && target.$error[type]) return true;
				else return false;
			},
			close: function() {
				$modalInstance.dismiss();
			},
			keyup: function($event) {
				if($event.keyCode === 13) {
					this.loginClicked();
				}
			}
		}

		$scope.$watch("form.user", function(newVal, oldVal) {

			if(newVal !== oldVal) {
				validateMessage();
			}
		});
		$scope.$watch("form.password", function(newVal, oldVal) {
			
			if(newVal !== oldVal) {
				validateMessage();
			}
		});

		function validateMessage() {
			if($scope.form.isInvalid('user', 'required'))
				$scope.form.message = "User name should be populated.";
			else if($scope.form.isInvalid('password', 'required'))
				$scope.form.message = "Password should be populated.";
			else 
				$scope.form.message = "";
		}
	}
])