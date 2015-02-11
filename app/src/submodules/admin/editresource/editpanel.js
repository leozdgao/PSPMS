angular.module('app.admin')

.factory('EditPanel', ['$modal', function ($modal) {
	var modalInstance;

	return {
		show: function(resource) {
			modalInstance = $modal.open({
				templateUrl: "/template/submodules/admin/editresource/template.html",
				controller: "EditPanelController",
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

.controller('EditPanelController', ['$scope', '$modalInstance', 'CurrentResource', 'Resource', 'MessageBox',
	function($scope, $modalInstance, CurrentResource, Resource, MessageBox) {

		$scope.form = {
			obj: angular.copy(CurrentResource || {}),
			title: CurrentResource ? 'Edit resource': 'Add resource',
			submitText: CurrentResource ? 'Save changes': 'Submit',
			requesting: false,
			submit: function() {

				var method = CurrentResource ? Resource.update: Resource.insert;
				// edit
				if(CurrentResource) {

				}
				// insert
				else {

					Resource.insert(null, $scope.form.obj).$promise
						.then(function() {

							$modalInstance.close();
						})
						.catch(function() {

							MessageBox.show('Error occurred while adding resource.')
								.finally(function() {
									$modalInstance.dismiss();		
								});
						});
				}
			},
			close: function() {
				$modalInstance.dismiss();
			}
		}

}]);