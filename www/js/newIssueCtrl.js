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

                });
.controller("takePicture", function(CameraService, $http, qimgUrl, qimgToken) {
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
    },data: {
        data: imageData
    }
    }).success(function(data) {
    var imageUrl = data.url;
    // do something with imageUrl
    });
});
