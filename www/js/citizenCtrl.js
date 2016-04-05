angular.module('citizen-engagement.citizenCtrl', [])

        .controller('UserListCtrl',
                function ($scope, $http, apiUrl) {
                    $scope.loadUsers = function () {
                        $http.get(apiUrl + '/issueTypes').success(function (issueTypes) {
                            $scope.user = issueTypes;
                            //console.log(issueTypes[0].name);

                            index = 0;

                            while (index < issueTypes.length)
                            {
                                console.log(issueTypes[index].name);
                                index++;
                            }

                        });
                    };

                });