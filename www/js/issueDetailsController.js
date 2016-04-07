angular.module('citizen-engagement.issueDetails', [])

        .controller('issueDetailsController', function ($scope, $stateParams, $http, apiUrl, $log, geolocation, mapboxMapId, mapboxAccessToken, AuthService, leafletData) { 

            var currentId = $stateParams.issueId;

            $scope.mapCenter = {};
            $scope.mapDefaults = {};
            $scope.mapMarkers = [];
            $scope.userCoords = {};
            $scope.data = {};
            $scope.mapEnabled = false;

            $scope.loadCurrentIssue = function () {
                $http.get(apiUrl + '/issues/' + currentId).success(function (issueCurrent) {
                    $scope.issueCurrent = issueCurrent;
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

                        //console.log("Auteur: " + issueCurrent.comments[index].author.name);
                        //console.log(issueCurrent.comments[index].text);
                        //$scope.currentIssue = issueCurrent.comments[index].name;
                        index++;
                    }


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
			lng: $scope.userCoords.lng
			
		});


                });
            };

            $scope.loadCurrentIssue();
        }

        )

//Dans app.js ->  .state('tab.issueDetails' -> 'tab-issueList': { devient 'tab-issuesMap': {