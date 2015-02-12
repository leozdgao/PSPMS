angular.module('app.directives')

.factory('FormHandler', function() {

	return function(form) {

		this.requesting = false;
		this.submitted = false;
		this.isInvalid = function(target, type) {

			var target = form[target] || {};

			if((target.$dirty || this.submitted) && target.$error[type]) return true;
			else return false;
		}
	}
})