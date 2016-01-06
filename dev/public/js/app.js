(function(w, d, a, u) {

	'use strict';

	var core = a.module('main', []);

	core.controller('start', startCtrl);

	function startCtrl () {
		/*jshint validthis:true */
		this.text = "Hello Angular test";
	}
	
})(window, document, angular);