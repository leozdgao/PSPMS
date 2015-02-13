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

.controller('EditPanelController', ['$scope', '$filter', '$modalInstance', 'CurrentResource', 'Resource',
	'MessageBox', 'DatepickerOption',
	function($scope, $filter, $modalInstance, CurrentResource, Resource, MessageBox, DatepickerOption) {

		var dateoption = new DatepickerOption();

		$scope.form = {
			obj: angular.copy(CurrentResource || {}),
			maxDate: new Date(),
			dateoption: dateoption,
			title: CurrentResource ? 'Edit resource': 'Add resource',
			submitText: CurrentResource ? 'Save changes': 'Submit',
			emailPattern: "^[-_A-Za-z0-9.]+@([A-za-z0-9]+\.)+[A-za-z0-9]{2,3}$",
			requesting: false,
			submitted: false,
			submit: function() {

				$scope.form.submitted = true;

				if($scope.resourceForm.$valid) {

					$scope.form.requesting = true;
					var action;
					// edit
					if(CurrentResource && $scope.resourceForm.$dirty) {

						action = Resource.update({id: CurrentResource.resourceId}, {update: $scope.form.obj}).$promise;
					}
					// insert
					else {

						action = Resource.insert(null, $scope.form.obj).$promise;
					}

					action.then(function() {

								$modalInstance.close();
							})
							.catch(function(err) {

								MessageBox.show('Error occurred while '
												 + (CurrentResource ? 'editting': 'adding')
												 + ' resource.')
									.then(function() {
										$modalInstance.dismiss();		
									});
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

				var target = $scope.resourceForm[target] || {};

				if((target.$dirty || $scope.form.submitted) && target.$error[type]) return true;
				else return false;
			}
		}
		var dateFormatter = $filter('date');
		$scope.form.obj.joinDate || ($scope.form.obj.joinDate = dateFormatter(new Date(), 'yyyy-MM-dd'));
}]);