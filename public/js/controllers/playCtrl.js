(function () {
    'use strict';
 
    var myApp = angular.module('myApp');
    
    myApp.controller('playCtrl', ['$scope', '$http', function($scope, $http) {

    	// Clear filters on initial pageload
    	$scope.filters = null;

		// Refresh current word
		var refreshWord = function() {
			
			if($scope.filters) {
				if($scope.filters.revision_list==false) delete $scope.filters.revision_list;	
			}
			$http.get('/play', { params:$scope.filters}).then(function(response) {
				if(response.data == null) {
					$scope.word.eng = "No words found";
				} else {
					$scope.word = response.data;
				}
				$scope.showEsp = true;
				$scope.showEspTxt = 'Show';
			});
		};

		refreshWord(); // Call get on initial page load

		// "Next" button press - get new word
		$scope.getWord = function() {
			refreshWord();
		};

		// Show / hide spanish
		$scope.toggleWord = function() {
			if($scope.showEsp == true) {
				$scope.showEsp = false;
				$scope.showEspTxt = "Hide";
			} else {
				$scope.showEsp = true;
				$scope.showEspTxt = "Show";
			}
		};	

		// Add / Remove word from revision list
		$scope.toggleRevisionList = function() {
			$http.post('/toggleRevisionList', $scope.word).then(function(response) {
				$scope.word.revision_list = response.data
			});
		};

	}]);
	 
}());


