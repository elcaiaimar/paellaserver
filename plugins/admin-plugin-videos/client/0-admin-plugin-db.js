(function() {
	var plugin = angular.module('adminPluginVideos', ['AuthorizationRoutesModule']);

	plugin.config(['$routeProvider', 'AuthorizationRoutesProvider', function($routeProvider, AuthorizationRoutesProvider) {
		
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin\/videos/, "ADMIN_UI_VIDEO");
		AuthorizationRoutesProvider.addAuthorizationRoute(/^\/admin\/channels/, "ADMIN_UI_VIDEO");
		
		$routeProvider
			.when('/admin/videos', {
				templateUrl: 'admin-plugin-videos/views/videos-list.html',
				controller: "AdminVideosListController"
			})
			.when('/admin/videos/edit/:id', {
				templateUrl: 'admin-plugin-videos/views/videos-edit.html',
				controller: "AdminVideosEditController"
			})
			
			.when('/admin/channels', {
				templateUrl: 'admin-plugin-videos/views/channels-list.html',
				controller: "AdminChannelsListController"
			})			
			.when('/admin/channels/new', {
				templateUrl: 'admin-plugin-videos/views/channels-new.html',
				controller: "AdminChannelsNewController"
			})			
			.when('/admin/channels/edit/:id', {
				templateUrl: 'admin-plugin-videos/views/channels-edit.html',
				controller: "AdminChannelsEditController"
			})
	}]);

	
	angular.module('adminPluginsModule').registerPlugin(plugin, "/admin/videos", "Videos");	
	
})();