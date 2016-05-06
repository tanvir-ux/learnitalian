(function () {
    'use strict';
 
    var myApp = angular.module('myApp');

	myApp.controller('aboutCtrl', ['$scope', '$http', function($scope, $http) {
		
		// Send JSON data to mongodb
		$scope.importWords = function() {
			/*
			$http.post('/import-words', new_words).then(function(response) {
				console.log("Import complete");
            });
            */
		};

	}]);

}());