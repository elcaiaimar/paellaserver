(function() {
	var app = angular.module('adminModule');

	app.factory('VideoCRUD', ['$resource', function($resource){
		return $resource('/rest/plugins/admin/CRUD/videos/:id', {'id':'@_id'}, {
			'query': {method: 'GET', isArray: false },
			'update': {method: 'PATCH'}
		});
	}]);

	app.factory('ChannelCRUD', ['$resource', function($resource){
		return $resource('/rest/plugins/admin/CRUD/channels/:id', {'id':'@_id'}, {
			'query': {method: 'GET', isArray: false },
			'update': {method: 'PATCH'}
		});
	}]);

	app.factory('UserCRUD', ['$resource', function($resource){
		return $resource('/rest/plugins/admin/CRUD/users/:id', {'id':'@_id'}, {
			'query': {method: 'GET', isArray: false },
			'update': {method: 'PATCH'}
		});
	}]);

	app.factory('RepositoryCRUD', ['$resource', function($resource){
		return $resource('/rest/plugins/admin/CRUD/reposirories/:id', {'id':'@_id'}, {
			'query': {method: 'GET', isArray: false },
			'update': {method: 'PATCH'}
		});
	}]);

	app.factory('TaskCRUD', ['$resource', function($resource){
		return $resource('/rest/plugins/admin/CRUD/tasks/:id', {'id':'@_id'}, {
			'query': {method: 'GET', isArray: false },
			'update': {method: 'PATCH'}
		});
	}]);

	app.factory('RoleCRUD', ['$resource', function($resource){
		return $resource('/rest/plugins/admin/CRUD/roles/:id', {'id':'@_id'}, {
			'query': {method: 'GET', isArray: false },
			'update': {method: 'PATCH'}
		});
	}]);
	
})();
	