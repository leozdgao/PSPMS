angular.module('app.admin')

.factory('AccountPanel', ['$modal', function ($modal) {
	var modalInstance;

	return {
		show: function(resource) {
			modalInstance = $modal.open({
				templateUrl: "/template/submodules/admin/manageaccount/template.html",
				controller: "AccountPanelController",
				resolve: {
					CurrentResource: function() {
						return resource;
					}
				},
                backdrop: 'static',
                keyboard: false
			});

			return modalInstance.result;
		}
	};
}])

.controller('AccountPanelController', ['$scope', '$modalInstance', 'CurrentResource',  'Resource', 
	'MessageBox', 'ResourceList', 'Alert',
	function($scope, $modalInstance, CurrentResource, Resource, MessageBox, ResourceList, Alert) {

		var account = CurrentResource.account || {};
		var uid = account.uid;
		var lastLoginDate = account.lastLoginDate;

		$scope.form = {
			obj: { uid: uid, lastLoginDate: lastLoginDate },
			hasAccount: angular.isDefined(uid),
			requesting: false,
			submitted: false,
			reset: function() { 

				// reset account
				MessageBox.show('Reset this account?', { style: 'confirm' })
					.then(function() {

						return Resource.resetAccount(null, { resourceId: CurrentResource._id }).$promsie
					})
					.then(function() {

						// update resource list
						var resource = ResourceList.get(CurrentResource._id);
						resource.account = null;
						ResourceList.put(CurrentResource._id, resource);

						$scope.form.obj = {};
						$scope.form.hasAccount = false;
					})
					.catch(function() {

						Alert.add('Error occurred while reset this account.', 'danger');
					});
			},
			submit: function() {

				// signup
				$scope.form.submitted = true;

				if($scope.accountForm.$valid) {

					$scope.form.requesting = true;

					Resource.createAccount(null, { uid: $scope.form.obj.uid,
						pwd: $scope.form.obj.pwd, resourceId: CurrentResource._id })
						.$promise
						.then(function() {

							$modalInstance.close();
						})
						.finally(function() {

							$scope.form.submitted = false;
							$scope.form.requesting = false;
						});
				}
			},
			close: function() {

				$modalInstance.dismiss();
			},
			isInvalid: function(target, type) {

				var target = $scope.accountForm[target] || {};

				if((target.$dirty || $scope.form.submitted) && target.$error[type]) return true;
				else return false;
			}
		}
	}
])