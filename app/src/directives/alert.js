angular.module('app.directives')

.factory('Alert', ['$timeout', function($timeout) {

	var alerts = [], key = 0;

	function getIndexByKey(key) {

		var index = -1;

		for (var i = 0; i < alerts.length; i++) {

			var alert = alerts[i];
			if(alert.key == key) {

				index = i;
				break;
			}
		};

		return index;
	}

	return {
		add: function(msg, type) {

			var alert = {msg: msg, type: type, key: key++}
			alerts.push(alert);

			// remove it after 2s
			$timeout(function() {

				var index = getIndexByKey(alert.key);
				alerts.splice(index, 1);
			}, 3000);
		},
		remove: function(key) {

			var index = getIndexByKey(key);

			if(index >= 0) alerts.splice(index, 1);
		},
		getAlerts: function() {

			return alerts;
		}
	}
}]);