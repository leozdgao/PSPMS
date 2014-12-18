angular.module('app.directives')

.factory('MessageBox', ['$modal',
    function($modal) {

        var modalInstance, message;

        return {

            //method for show the message box
            //return a promise

            show: function(message, opt) {

                var option = {};
                angular.extend(option, opt);

                modalInstance = $modal.open({
                    templateUrl: 'templates/directives/messagebox/template.html',
                    controller: 'MessageBoxController',
                    resolve: {
                        item: function() {
                            return message;
                        },
                        style: function() {
                            return option.style || 'alert';
                        }
                    },
                    backdrop: 'static',
                    keyboard: false
                });

                return modalInstance.result;
            }
        }
    }
])

.controller('MessageBoxController', ['$scope', '$modalInstance', 'item', 'style',
    function($scope, $modalInstance, item, style) {

        $scope.message = item;
        $scope.style = style;

        $scope.ok = function() {
            $modalInstance.close();
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
    }
]);
