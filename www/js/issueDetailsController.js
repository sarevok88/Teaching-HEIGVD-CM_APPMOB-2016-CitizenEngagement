angular.module('citizen-engagement.issueDetails', [])

.controller("issueDetailsController", function($log, $scope, $http, apiUrl, idIssue) {
	$scope.loadIssueTypes = function () {
    $http.get(apiUrl + '/issues/' + idIssue).success(function (issueDetails) {
	    $scope.issueDetails = issueDetails;
	    console.log(issueDetails);
		});
	};
});

//Dans app.js ->  .state('tab.issueDetails' -> 'tab-issueList': { devient 'tab-issuesMap': {