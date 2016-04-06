angular.module('citizen-engagement.issueDetails', [])

.controller('issueDetailsController', function ($scope, $stateParams,$http,apiUrl) {

        var currentId = $stateParams.issueId;

        $scope.loadCurrentIssue=function(){
            $http.get(apiUrl+'/issues/'+currentId).success(function(issueCurrent){
                $scope.issueCurrent=issueCurrent;

                console.log('issueDetailsController CONNECTE');
                console.log(issueCurrent);

            })
        }

        $scope.loadCurrentIssue();
    }

)

//Dans app.js ->  .state('tab.issueDetails' -> 'tab-issueList': { devient 'tab-issuesMap': {