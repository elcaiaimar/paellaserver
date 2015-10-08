(function() {
	var app = angular.module('adminModule');

	
	
	app.controller("AdminController", function() {

	});
	
	
	app.controller("AdminVideosEditController", ["$scope","$routeParams", "Video", function($scope, $routeParams, Video){	
		$scope.video = Video.get({id: $routeParams.id});
	}]);
	
	
	app.controller("AdminVideosListController", ["$scope", "$modal", "$base64", "$timeout", "Video", "VideoFilters", "Actions", "AdminState", 
	function($scope, $modal, $base64, $timeout, Video, VideoFilters, Actions, AdminState) {
		$scope.state=AdminState;
		$scope.state.videoFilters=[];

		$scope.currentPage=1;
		$scope.filterQuery = null;
		$scope.selectableFilters = VideoFilters;
		$scope.videoActions = Actions.$get("video");
		$scope.timeoutReload = null;
		$scope.timeoutSearchText = null;



		function doRefreshFilters() {
			var querys = [];
			var final_query = {}
			
			$scope.state.videoFilters.forEach(function(f){
				if (f.filter.type == 'enum') {
					var q = {};
					q[f.filter.field] =  f.value.value;
					querys.push(q);
				}
				else if (f.filter.type == 'text') {
					var q = {};
					a[f.filter.field] =  { $regex: f.value.value, $options: 'i' }
					querys.push(q);
				}				
				else if (f.filter.type == 'timeInterval') {
					var q1 = {}, q2 = {};
					q1[f.filter.field] = {"$gte": f.value.value.start };
					q2[f.filter.field] = {"$lte": moment(f.value.value.end).endOf('day').toDate() };					
					querys.push(q1);
					querys.push(q2);
				}
				else {
					console.log("Tipo de filtro no definido: " + f.filter.type)
				}
			});
			
			if ($scope.searchText) {
				querys.push({"$text": { $search: $scope.searchText } });
			}
			
			if (querys.length > 0) {
				final_query = {"$and": querys};
			}
						
			$scope.filterQuery = $base64.encode(JSON.stringify(final_query));			
			$scope.reloadVideos();			
		};
		
		$scope.$watch('state.videoFilters', function(){ doRefreshFilters() }, true );
		
		$scope.$watch('searchText', function() {
			if ($scope.timeoutSearchText) {
				$timeout.cancel($scope.timeoutSearchText);
			}	
			$scope.timeoutSearchText = $timeout(function() {
				doRefreshFilters();
			}, 500);
		});
		
		$scope.$watch('currentPage', function(){ $scope.reloadVideos(); });
		
		$scope.reloadVideos = function(){
			if ($scope.timeoutReload) {
				$timeout.cancel($scope.timeoutReload);
			}		
			$scope.loadingVideos = true;
			$scope.timeoutReload = $timeout(function() {			
				Video.query({limit:$scope.state.itemsPerPage, skip:($scope.currentPage-1)*$scope.state.itemsPerPage, filters:$scope.filterQuery})
				.$promise.then(function(data){
					$scope.videos = data;
					$scope.loadingVideos = false
					$scope.timeoutReload = null;
				});
			}, 500);
		};


		$scope.deleteVideo = function(id) {
			var modalInstance = $modal.open({
				templateUrl: 'confirmDeleteVideo.html',
				size: '',
				backdrop: true,
				controller: function ($scope, $modalInstance) {
					$scope.cancel = function () {
						$modalInstance.dismiss();
					};
					$scope.accept = function () {
						console.log("TODO")
						$modalInstance.close();
					};
				}
			});
		};
		
		$scope.doAction = function(action) {
			
			var selectedVideos= [];			
			$scope.videos.list.forEach(function(v){
				if (v.selected) {
					selectedVideos.push(v);
				}
			});						
				
			Actions.runAction(action, selectedVideos);
		};
	}])
	
	
})();