(function(require){
	require(['jquery'], function ($) {
		'use strict';
		$.noConflict();
	});

	var config = {
		baseUrl: 'js/',
		map: {
			'*' : {
				'ko': 'knockoutjs/knockout',
				'collapsible': 'mage/collapsible',
				'tabs': 'mage/tabs',
				'accordion': 'mage/accordion',
			}
		},
		paths: {
			'jquery/ui': 'jquery/jquery-ui'
		},
		deps: [
	        'mage/bootstrap'
    	],
	}
	require.config(config);

})(require);