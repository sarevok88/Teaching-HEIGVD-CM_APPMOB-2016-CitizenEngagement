angular.module('citizen-engagement.issueDetails', [])

        .controller('issueDetailsController', function ($scope, $stateParams, $http, apiUrl, $log, geolocation, mapboxMapId, mapboxAccessToken, AuthService, leafletData) { 

            var currentId = $stateParams.issueId;

            $scope.mapCenter = {};
            $scope.mapDefaults = {};
            $scope.mapMarkers = [];
            $scope.issueCoords = {};
            $scope.data = {};
            $scope.mapEnabled = false;

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

                    //Map  control
                    $scope.mapCenter.lat = issueCurrent.lat;
                    $scope.mapCenter.lng = issueCurrent.lng;
                    //console.log($scope.mapCenter.lat);
                    //console.log($scope.mapCenter.lng);
                    $scope.mapCenter.zoom = 14;
                    $scope.mapEnabled = true;

                    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
                    //console.log(mapboxTileLayer);
                    mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
                    //console.log(mapboxTileLayer);

                    $scope.mapDefaults = {
                        tileLayer: mapboxTileLayer,
                        events: {
                            map: {
                                enable: ['zoomend', 'drag', 'click']
                            }
                        }
                    };
                    
                //ajout du pin du user
		$scope.issueCoords.lat = $scope.mapCenter.lat;
		$scope.issueCoords.lng = $scope.mapCenter.lng;
		
		$scope.mapMarkers.push({
			lat: $scope.issueCoords.lat,
			lng: $scope.issueCoords.lng
			
		});


                });
            };

            $scope.loadCurrentIssue();
        }

        );

//Dans app.js ->  .state('tab.issueDetails' -> 'tab-issueList': { devient 'tab-issuesMap': {