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
	function($scope, $modalInstance, CurrentResource, Resource) {

		var account = CurrentResource.account || {};

		$scope.form = {
			obj: { uid: account.uid },
			submit: function() {

				// Resource.changeAccount(null, {
				// 	uid: $scope.form.obj.uid,
				// 	pwd: $scope.form.obj.pwd,
				// 	resourceId: CurrentResource._id
				// }).$promise
				// .then(function() {

				// 	$modalInstance.close();
				// })
				// .catch(function() {

				// 	$modalInstance.dismiss();
				// });
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