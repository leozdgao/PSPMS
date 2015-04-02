angular.module('app.utils')

.directive('ngBefore', function() {

	return {
		require: '^ngModel',
		link: function(scope, ele, attrs, ngModel) {

			ngModel.$validators.before = function(modelValue, viewValue) {

				if(!angular.isDefined(modelValue)) return true;

				if(angular.isDate(modelValue)) {

					var today = new Date(), val = new Date(modelValue);

					return new Date(val.getFullYear(), val.getMonth(), val.getDate()) 
						<= new Date(today.getFullYear(), today.getMonth(), today.getDate())
				}
				else return false;
			}
		}
	}
});