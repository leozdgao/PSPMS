angular.module('app.admin', ['app.datacenter', 'app.directives', 'ui.bootstrap'])

.controller('ManagerController', ['$scope', 'UserService', 'Resource', 'EditPanel', 'MessageBox',
	function ($scope, UserService, Resource, EditPanel, MessageBox) {

		$scope.user = UserService.getUser();
		$scope.resourceList = [];

		// get all resources, exclude admin
		Resource.get({ 'conditions.resourceId.$gt':'0' }).$promise
			.then(function(results) {
				
				$scope.resourceList = results;
			})
			.catch(function(err) {


			});

		$scope.action = {

			addResource: function() {

				EditPanel.show();
			},
			editResource: function(id) {

				var list = $scope.resourceList, current;

				for (var i = 0, l = list.length; i < l; i++) {

					var resource = list[i];
					if(resource._id == id) {

						current = resource; break;
					} 
				}

				if(current) {

					EditPanel.show(current);
				}
				else MessageBox.show('This resource is not available.');
			},
			editAccount: function(id) {

			},
			removeResource: function(id) {

				MessageBox.show("Remove this resource?", { style: "confirm" })
					.then(function() {

						//remove
						Resource.remove({id: id}).$promise
							.then(function() {

								console.log(arguments);
								return Resource.get({'conditions.resourceId.$gt':'0'}).$promise;
							})
							.then(function(results) {console.log(results);

								$scope.resourceList = results;
							})
							.catch(function(err) {

								console.log(err);
								MessageBox.show('Error occurred while removing this resource.');
							});

						//refresh list
					});
			}
		};
	}
])
