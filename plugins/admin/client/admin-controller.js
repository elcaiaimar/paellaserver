(function() {
	var app = angular.module('adminModule');

	
	app.controller("AdminController", ['$scope', 'AdminPlugin', function($scope, AdminPlugin) {

		$scope.plugins = AdminPlugin;

	}]);
	
	
	
})();