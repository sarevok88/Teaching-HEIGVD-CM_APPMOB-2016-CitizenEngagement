angular.module('citizen-engagement.issueDetails', [])

        .controller('issueDetailsController', function ($scope, $stateParams, $http, apiUrl, $log, geolocation, mapboxMapId, mapboxAccessToken, AuthService, leafletData) {

            var currentId = $stateParams.issueId;

            $scope.loadCurrentIssue = function () {
                $http.get(apiUrl + '/issues/' + currentId).success(function (issueCurrent) {
                    $scope.issueCurrent = issueCurrent;

                    index = 0;

                    while (index < issueCurrent.comments.length)
                    {
                        //console.log("Auteur: " + issueCurrent.comments[index].author.name);
                        //console.log(issueCurrent.comments[index].text);
                        //$scope.currentIssue = issueCurrent.comments[index].name;
                        index++;
                    }

                    $scope.mapCenter = {};
                    $scope.mapDefaults = {};
                    $scope.mapMarkers = [];
                    $scope.userCoords = {};
                    $scope.data = {};
                    $scope.radius = {};
                    $scope.mapEnabled = false;

                    //recupération de la localisation de l'utilisateur 
                    geolocation.getLocation().then(function (data) {

                        $scope.mapCenter.lat = issueCurrent.lat;
                        $scope.mapCenter.lng = issueCurrent.lng;
                        $scope.mapCenter.zoom = 14;
                        $scope.mapEnabled = true;

                        var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;

                        mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;

                        $scope.mapDefaults = {
                            tileLayer: mapboxTileLayer,
                            events: {
                                map: {
                                    enable: ['zoomend', 'drag', 'click'],
                                }
                            }
                        };

                        //ajout du pin du user
                        $scope.userCoords.lat = $scope.mapCenter.lat;
                        $scope.userCoords.lng = $scope.mapCenter.lng;

                        $scope.mapMarkers.push({
                            lat: $scope.userCoords.lat,
                            lng: $scope.userCoords.lng,
                        });




                        function addIssues2MapMarkers(issues)
                        {
                            angular.forEach(issues, function (issue, index) {


                                $scope.mapMarkers.push({
                                    color: "#FF0000",
                                    lat: issue.lat,
                                    lng: issue.lng,
                                    message: "<p>{{ issue.description }}</p><img src=\"{{ issue.imageUrl }}\" width=\"200px\" />",
                                    getMessageScope: function () {
                                        var scope = $scope.$new();
                                        scope.issue = issue;
                                        return scope;
                                    }
                                });

                            });
                        }




                        leafletData.getMap()



                    }, function (error) {
                        $log.error("Could not get location: " + error);
                    }).then(function () {
                        $scope.$on('leafletDirectiveMap.zoomend', function (event) {
                            console.log("zoom fini");
                        });
                    });

                });

            };

            $scope.loadCurrentIssue();
        }

        );

//Dans app.js ->  .state('tab.issueDetails' -> 'tab-issueList': { devient 'tab-issuesMap': {