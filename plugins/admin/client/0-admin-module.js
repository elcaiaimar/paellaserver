(function() {

	var app = angular.module('adminModule', ['AuthorizationRoutesModule', 'adminPluginsModule', "ngRoute", "base64", "angularMoment", "ui.sortable"]);	
	
	
	app.config(['$routeProvider', '$translateProvider', 'AuthorizationRoutesProvider', function($routeProvider, $translateProvider, AuthorizationRoutesProvider) {
				
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin/, "ADMIN_UI");
		
		$routeProvider
			.when('/admin', {
				templateUrl: 'admin/views/main.html',
				controller: "AdminController"
			})
			.when('/admin/unauthorized', {
				templateUrl: 'admin/views/unauthorized.html',
				controller: "AdminUnauthorizedController"
			})

		function loadDictionary(lang) {
			$.ajax('admin/i18n/' + lang + '.json')
			.success(function(data) {
				$translateProvider.translations(lang, data);
			});
		}

		loadDictionary('es');
		loadDictionary('ca');		
	}]);		
		
		
	app.run(['$rootScope', 'AuthorizationRoutes', function($rootScope, AuthorizationRoutes) {	 	
		$rootScope.$on('$routeChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if (toState && toState.$$route && toState.$$route.originalPath) {
				if (toState.$$route.originalPath != '/admin/unauthorized') {
					AuthorizationRoutes.check(toState.$$route.originalPath);
				}
			}
		});	
	}]);
	
})();