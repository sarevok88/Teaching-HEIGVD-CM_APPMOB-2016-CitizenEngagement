angular.module('citizen-engagement.citizenCtrl',[])

.controller('UserListCtrl',
    function ($scope, $http,apiUrl) {
        $scope.loadUsers = function() {
            $http.get(apiUrl+'/users').success(function(data) {
                $scope.user = data;
                console.log(user.id);
            });
        };

    });