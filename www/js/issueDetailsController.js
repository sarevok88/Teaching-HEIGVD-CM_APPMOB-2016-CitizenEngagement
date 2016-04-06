angular.module('citizen-engagement.issueDetails', [])

.controller('issueDetailsController', function ($scope, $stateParams,$http,apiUrl) {

        var currentId = $stateParams.issueId;

        $scope.loadCurrentIssue=function(){
            $http.get(apiUrl+'/issues/'+currentId).success(function(issueCurrent){
                $scope.issueCurrent=issueCurrent;
                /*
                console.log(issueCurrent.issueType.name);
                console.log(issueCurrent.issueType.description);
                console.log("by " +issueCurrent.owner.name);
                console.log("State " +issueCurrent.state);
                console.log(issueCurrent.comments);
                */
                index = 0;
		
                    while (index < issueCurrent.comments.length)
			{
			    console.log("yolo");
			    index++;
			}
                
                
                

            });
        };

        $scope.loadCurrentIssue();
    }

)

//Dans app.js ->  .state('tab.issueDetails' -> 'tab-issueList': { devient 'tab-issuesMap': {