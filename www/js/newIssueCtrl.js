angular.module('citizen-engagement.newIssueCtrl', [])

.controller('addIssue', function($scope, $ionicLoading, $state, $http, apiUrl) {

    $scope.issue = {};

    console.log('On est dans le addIssue controller');
 $scope.register = function() {
    console.log('On est dans le scope register');
      // Forget the previous error (if any).
      delete $scope.error;

      // Show a loading message if the request takes too long.
      $ionicLoading.show({
        template: 'Adding issue...',
        delay: 750
      });

      // Make the request to retrieve or create the issue.
      $http({
        method: 'POST',
        url: apiUrl + '/issues/',
        data: $scope.issue
      }).success(function(issue) {
        console.log('C est un succès !');
        //test affichage id issue
        $scope.issues = issue;

        console.log(issue.id);
        
        // Hide the loading message.
        $ionicLoading.hide();

        // Go to the issue creation tab.
        $state.go('tab.issueList');

      }).error(function() {
        console.log('bon....ça ne marche pas');
        // If an error occurs, hide the loading message and show an error message.
        $ionicLoading.hide();
        $scope.error = 'Could upload the issue';
      });
    };
})

.controller('IssueTypesListCtrl', function ($scope, $http, apiUrl) {
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
                
                console.log("test injection map");
                
                
                console.log("Fin code test injection map");
            });
        };
    $scope.loadIssueTypes();
})

.controller("takePicture", function($scope, CameraService, $http, qimgUrl, qimgToken) {
    console.log("controller takePicture chargé");
    $scope.takePicture = function() {
        console.log("scope takePicture appelé");
        CameraService.getPicture({
            quality: 75,
            targetWidth: 400,
            targetHeight: 300,
            destinationType: Camera.DestinationType.DATA_URL}).then(function(imageData) {
            // upload the image
                $http({
                    method: "POST",
                    url: qimgUrl + "/images",
                    headers: {
                        Authorization: "Bearer " + qimgToken
                    },
                    data: {
                        data: imageData
                    }
                }).success(function(data) {
                    $scope.imageData = data;
                    $scope.issue.imageUrl = data.url;
                });
            });
        };
})

.factory("CameraService", function($q) {
    return {
        getPicture: function(options) {
          var deferred = $q.defer();
          navigator.camera.getPicture(function(result) {
            // do any magic you need
            deferred.resolve(result);
          }, function(err) {
            deferred.reject(err);
          }, options);
          return deferred.promise;
        }
    }
});


/*

// take the picture
    CameraService.getPicture({
        quality: 75,
        targetWidth: 400,
        targetHeight: 300,
        // return base64-encoded data instead of a file
        destinationType: Camera.DestinationType.DATA_URL}).then(function(imageData) {
            // upload the image
            $http({
            method: "POST",
            url: qimgUrl + "/images",
            headers: {
                Authorization: "Bearer " + qimgToken
            },
            data: {
                data: imageData
            }
        }).success(function(data) {
            var imageUrl = data.url;
            // do something with imageUrl
        });
    });
})*/
