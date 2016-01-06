(function(w, d, a, u) {

	'use strict';

	var core = a.module('main');

	core.directive('myButton', function () {
		console.log('directive');

		function exButtonCtrl () {
			/*jshint validthis:true */
			this.text = "exButton";
		}

		return {
			restrict: 'E',
			templateUrl: 'js/shared/buttonTemplate.html',
			controller: exButtonCtrl,
			controllerAs: 'btn'
		};
	});

	
	
})(window, document, angular);