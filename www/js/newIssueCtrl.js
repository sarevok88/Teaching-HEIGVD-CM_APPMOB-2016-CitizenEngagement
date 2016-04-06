angular.module('citizen-engagement.newIssueCtrl', [])

        .controller('IssueTypesListCtrl',
                function ($scope, $http, apiUrl) {
                    $scope.loadIssueTypes = function () {
                        $http.get(apiUrl + '/issueTypes').success(function (issueTypes) {
                            $scope.issueTypes = issueTypes;
                            console.log(issueTypes);

                            index = 0;

                            while (index < issueTypes.length)
                            {
                                console.log(issueTypes[index].name);
                                $scope.currentIssueType = issueTypes[index].name;
                                index++;
                            }

                        });
                    };
                    $scope.loadIssueTypes();

                });