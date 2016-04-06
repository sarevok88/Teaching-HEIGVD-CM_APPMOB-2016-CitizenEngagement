angular.module('citizen-engagement.issuesList', [])

.controller("issuesListController", function($log, $scope, $http, apiUrl) {
	$scope.loadIssuesList = function () {
		$http.get(apiUrl + '/issues').success(function (issues) {
			$scope.issues = issues;
			console.log(issues);

			index = 0;

			while (index < issues.length)
			{
			    $scope.currentIssue = issues[index].name;
			    index++;
			}

		});
	};
	$scope.loadIssuesList();
});