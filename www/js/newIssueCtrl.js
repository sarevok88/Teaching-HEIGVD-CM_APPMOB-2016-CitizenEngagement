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
                    $scope.imageUrl = data.url;
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
