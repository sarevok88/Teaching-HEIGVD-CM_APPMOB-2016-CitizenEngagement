angular.module('citizen-engagement.issuesList', [])

.controller("issuesListController", function($log, $scope, $http, apiUrl, idIssue) {
	$scope.loadIssueTypes = function () {
    $http.get(apiUrl + '/issues/' + idIssue).success(function (issueDetails) {
	    $scope.issueDetails = issueDetails;
	    console.log(issueDetails);
		});
	};
});