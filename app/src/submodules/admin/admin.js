angular.module('app.admin', ['app.datacenter', 'app.directives'])

.controller('ManagerController', ['$scope', 'UserService', 'Resource', 'EditPanel',
	'AccountPanel', 'MessageBox', 'ResourceList',
	function ($scope, UserService, Resource, EditPanel, AccountPanel, MessageBox, ResourceList) {

		$scope.user = UserService.getUser();
		$scope.resourceList = [];

		// get all resources, exclude admin
		Resource.get({ 'conditions.resourceId.$gt':'0' }).$promise
			.then(function(results) {
				
				pushList(results);
				$scope.resourceList = results;
			})
			.catch(function(err) {


			});

		$scope.action = {

			addResource: function() {

				EditPanel.show()
					.then(function() {

						return refreshGrid();
					});
			},
			editResource: function(id) {console.log(id);

				var current = getCurrentResource(id);

				if(current) {

					EditPanel.show(current)
						.then(function() {

							return refreshGrid();
						});
				}
				else MessageBox.show('This resource is not available.');
			},
			editAccount: function(id) {

				var current = getCurrentResource(id);

				if(current) {

					AccountPanel.show(current)
						.then(function() {

							return refreshGrid();
						});
				}
				else MessageBox.show('This resource is not available.');
			},
			removeResource: function(id) {

				MessageBox.show("Remove this resource?", { style: "confirm" })
					.then(function() {

						//remove
						Resource.remove({id: id}).$promise
							.then(function() {

								return refreshGrid();
							})
							.catch(function(err) {

								MessageBox.show('Error occurred while removing this resource.');
							});
					});
			}
		};

		function refreshGrid() {

			return Resource.get({'conditions.resourceId.$gt':'0'}).$promise
					.then(function(results) {

						pushList(results);
						$scope.resourceList = results;
					});
		}

		function getCurrentResource(id) {

			return ResourceList.get(id);
		}

		function pushList(list) {

			for (var i = 0, l = list.length; i < l; i++) {
				
				var resource = list[i];
				ResourceList.put(resource._id, resource);
			}
		}
	}
]);
