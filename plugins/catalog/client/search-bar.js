(function() {
	var catalogModule = angular.module('catalogModule');
	var historyUrls = [];

	catalogModule.directive('searchBar',function() {
		return {
			restrict: "E",
			templateUrl: "catalog/directives/search-bar.html",
			scope: {
				channels: "=",
				videos: "=",
				myVideos: "=",
				myChannels: "=",
				searchText: "=",
				doSearchFunction: "=",
				currentTab: "=",
				showSearch: "=",
				showSort: "=",
				showMyVideosTab: "=",
				showMyChannelsTab: "=",
				showEmptyTabs: "=",
				currentChannel: "=",
				currentUser: "="
			},
			controller: ['$scope','User','AuthorSearch',function ($scope,User,AuthorSearch) {
				$scope.logged = false;
				$scope.isAdmin = false;
				historyUrls.push(location.href);

				$scope.backEnabled = historyUrls.length>1;

				$scope.searchByAuthor = function() {
					AuthorSearch(function(selectedAuthor) {
						$scope.searchText = "";
						location.href = "#/catalog/author/" + selectedAuthor.id;
					})
				};

				$scope.back = function() {
					if ($scope.backEnabled) {
						historyUrls.pop();	// current page
						var newUrl = historyUrls.pop();	// previous page
						location.href = newUrl;
						$scope.backEnabled = historyUrls.length>1;
					}
				};

				$scope.showChannels = function() {
					if ($scope.numChannels()>0) {
						$scope.currentTab = 0;
						return true;
					}
					return false;
				};

				$scope.showVideos = function() {
					if ($scope.numVideos()>0) {
						$scope.currentTab = 1;
						return true;
					}
					return false;
				};

				$scope.showMyVideos = function() {
					if (!$scope.logged) {
						location.href = "#/auth/login"
					}
					else if ($scope.numMyVideos()>0) {
						$scope.currentTab = 2;
						return true;
					}
					return false;
				};

				$scope.showMyChannels = function() {
					if (!$scope.logged) {
						location.href = "#/auth/login"
					}
					else if ($scope.numMyChannels()>0) {
						$scope.currentTab = 3;
						return true;
					}
					return false;
				};

				$scope.numVideos = function() {
					return $scope.videos.length;
				};

				$scope.numChannels = function() {
					return $scope.channels.length;
				};

				$scope.numMyVideos = function() {
					return $scope.myVideos.length;
				};

				$scope.numMyChannels = function() {
					return $scope.myChannels.length;
				};

				$scope.channelTabSelected = function() {
					return $scope.currentTab == 0;
				};

				$scope.videoTabSelected = function() {
					return $scope.currentTab == 1;
				};

				$scope.myVideosTabSelected = function() {
					return $scope.currentTab == 2;
				};

				$scope.myChannelsTabSelected = function() {
					return $scope.currentTab == 3;
				};

				$scope.sortDefault = function() {
					function sortFunction(a,b) {
						if (a.defaultSortingIndex < b.defaultSortingIndex) {
							return -1;
						}
						else if (a.defaultSortingIndex > b.defaultSortingIndex) {
							return 1;
						}
						else {
							return 0;
						}
					}

					$scope.channels.sort(sortFunction);
					$scope.videos.sort(sortFunction);
					$scope.myVideos.sort(sortFunction);
					$scope.myChannels.sort(sortFunction);
				};

				$scope.sortName = function() {
					function sortFunction(a,b) {
						a = a.title.trim().toLowerCase();
						b = b.title.trim().toLowerCase();
						if (a < b) {
							return -1;
						}
						else if (a > b) {
							return 1;
						}
						else {
							return 0;
						}
					}

					$scope.channels.sort(sortFunction);
					$scope.videos.sort(sortFunction);
					$scope.myVideos.sort(sortFunction);
					$scope.myChannels.sort(sortFunction);
				};

				$scope.sortDate = function() {
					function sortFunction(a,b) {
						a = new Date(a.creationDate);
						b = new Date(b.creationDate);
						if (a > b) {
							return -1;
						}
						else if (a < b) {
							return 1;
						}
						else {
							return 0;
						}
					}

					$scope.channels.sort(sortFunction);
					$scope.videos.sort(sortFunction);
					$scope.myVideos.sort(sortFunction);
					$scope.myChannels.sort(sortFunction);
				};

				$scope.sortAuthor = function() {
					function sortFunction(a,b) {
						a = a.owner.length && a.owner[0].contactData && a.owner[0].contactData.name;
						b = b.owner.length && b.owner[0].contactData && b.owner[0].contactData.name;
						if (a < b) {
							return -1;
						}
						else if (a > b) {
							return 1;
						}
						else {
							return 0;
						}
					}

					$scope.channels.sort(sortFunction);
					$scope.videos.sort(sortFunction);
					$scope.myVideos.sort(sortFunction);
					$scope.myChannels.sort(sortFunction);
				};

				function checkTabs() {
					var tabBarItems = 0;
					if ($scope.showEmptyTabs || $scope.showChannels()) ++tabBarItems;
					if ($scope.showEmptyTabs || $scope.showVideos()) ++tabBarItems;
					if ($scope.showSearch) ++tabBarItems;
					if ($scope.showSort) ++tabBarItems;
					if ($scope.showMyVideosTab) ++tabBarItems;

					$scope.showTabBar = tabBarItems>1 || $scope.backEnabled;
				}

				$scope.$watch('channels',checkTabs);
				$scope.$watch('videos',checkTabs);
				$scope.$watch('myVideos',checkTabs);
				$scope.$watch('myChannels',checkTabs);
				checkTabs();

				User.current().$promise
					.then(function(data) {
						if (data._id!="0") {
							$scope.logged = true;
							$scope.isAdmin = data.roles.some(function(r) { return r.isAdmin });
							$scope.currentUser = data;
						}
						else {
							$scope.logged = false;
						}
					});

			}]
		};
	});

})();

