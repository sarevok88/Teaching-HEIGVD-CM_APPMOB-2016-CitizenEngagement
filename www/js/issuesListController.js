angular.module('citizen-engagement.issuesList', [])

.controller("issuesListController", function($log, $scope, $http, apiUrl) {
	$scope.loadIssuesList = function () {
		$http.get(apiUrl + '/issues').success(function (issues) {
			$scope.issues = issues;
			console.log(issues);

			index = 0;

			while (index < issues.length)
			{
			    console.log(issues[index].issueType.name);
                            console.log(issues[index].issueType.description);
                            console.log(issues[index].state);
			    $scope.currentIssue = issue[index].name;
			    index++;
			}

		});
	};
	$scope.loadIssuesList();
});