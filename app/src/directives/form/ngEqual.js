angular.module('app.directives')

.directive('ngEqual', ['$parse', function($parse) {

	return {
		require: '^ngModel',
		link: function(scope, ele, attrs, ngModel) {

			var parse = $parse(attrs.ngEqual);
			
			ele.bind('keydown', function() {

				ngModel.$validators.equal = function(modelValue, viewValue) {

					var val = modelValue || viewValue;
					var source = parse(scope);

					return (isEmpty(val) && isEmpty(source)) || val == source;
				}
			});
		}
	}

	function isEmpty(val) {

		return val === null || val === undefined || val === "";
	}
}]);