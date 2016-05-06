(function () {
    'use strict';
 
    var myApp = angular.module('myApp');

	myApp.controller('wordCtrl', ['$scope', '$http', function($scope, $http) {

        $scope.revision_list = true;
        $scope.wordType = 'Noun';
        $scope.showLatest = true;

        // Set available word type options
        $scope.types = ['Noun','Verb','Phrase','Adjective','Adverb','Pronoun','Preterite','Future'];


        var clearFields = function() {
        	$scope.word = ''; 
            $scope.engError = false;
            $scope.espError = false;
            $scope.wordAlert = true;
        };

        // Clear fields and alert
		$scope.latestWord = ''; 
		clearFields();


        /*********** ADD WORD **************/
		$scope.addWord = function() {

            // Validate Eng / Esp inputs for empty submissions
            if($scope.myForm.eng.$valid == true) {
                $scope.engError = false;
            } else {
                $scope.engError = true;
            }

            if($scope.myForm.esp.$valid == true) {
                $scope.espError = false;
            } else {
                $scope.espError = true;
            }
            
            // Add new word if passes validation
            if($scope.engError == false && $scope.espError == false) {

                // Build new word object from scope variables
                var new_word = $scope.word;
                new_word.type = $scope.wordType;
                new_word.revision_list = $scope.revision_list;

                $http.post('/add', new_word).then(function(response) {
                    $scope.showLatest = false;
                    $scope.lastWord = new_word // Store latest word before clearing $scope.word
                    $scope.alert = 'Niiice, ' + new_word.esp + ' was successfully added!';
                    clearFields();
                });
            } else {
                $scope.alert = 'Dayyum, looks like you\'re missing some deets!';
                $scope.showLatest = false;
                $scope.wordAlert = false;
            }
        };

        

	}]);

}());