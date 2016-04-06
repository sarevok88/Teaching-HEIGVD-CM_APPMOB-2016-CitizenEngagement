angular.module('citizen-engagement.issuesList', [])

.controller("issuesListController", function($log, $scope, $http, apiUrl) {
	$scope.loadIssuesList = function () {
		$http.get(apiUrl + '/issues').success(function (issues) {
			$scope.issues = issues;
			console.log(issues);

			index = 0;

			while (index < issue.length)
			{
			    console.log(issue[index].name);
			    $scope.currentIssue = issue[index].name;
			    index++;
			}

		});
	};
	$scope.loadIssuesList();
});