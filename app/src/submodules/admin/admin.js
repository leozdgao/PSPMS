angular.module('app.admin', ['ui.router', 'app.auth', 'app.datacenter', 'app.directives'])

.config(['$stateProvider', function($stateProvider) {
	$stateProvider
		.state("admin", {
		    url: "/admin",
		    views: {
		        "": {
		            templateUrl: "/template/index.html"
		        },
		        "general@admin": {
		            templateUrl: "/template/submodules/admin/index.html",
		            controller: "ManagerController"
		        }
		    },
		    resolve: {
		        isLogged: 'RelogService'
		    },
		    access_control: -1
		});
}])

.controller('ManagerController', ['$scope', 'UserService', 'Resource', 'EditPanel',
	'AccountPanel', 'MessageBox', 'ResourceList', 'Alert',
	function ($scope, UserService, Resource, EditPanel, AccountPanel, MessageBox, ResourceList, Alert) {

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

						Alert.add('New resource added.', 'success');
						return refreshGrid();
					});
			},
			editResource: function(id) {

				var current = getCurrentResource(id);

				if(current) {

					EditPanel.show(current)
						.then(function() {

							Alert.add('Resource`s info saved.', 'success');
							return refreshGrid();
						});
				}
				else Alert.add('This resource is not available.', 'danger');
			},
			editAccount: function(id) {

				var current = getCurrentResource(id);

				if(current) {

					AccountPanel.show(current)
						.then(function() {

							Alert.add('Resource`s account saved.', 'success');
							return refreshGrid();
						});
				}
				else Alert.add('This resource is not available.', 'danger');
			},
			removeResource: function(id) {

				MessageBox.show("Remove this resource?", { style: "confirm" })
					.then(function() {

						//remove
						Resource.remove({id: id}).$promise
							.then(function() {

								Alert.add('Resource removed.', 'success');
								return refreshGrid();
							})
							.catch(function(err) {

								Alert.add('Error occurred while removing this resource.', 'danger');
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
