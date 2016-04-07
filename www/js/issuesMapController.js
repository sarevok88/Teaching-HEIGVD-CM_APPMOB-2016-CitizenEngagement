angular.module("citizen-engagement.issuesMap", ['angular-storage', 'leaflet-directive','geolocation'])

.controller("issuesMapController", function($http, apiUrl, $log, $scope, geolocation, mapboxMapId, mapboxAccessToken, AuthService, leafletData) {
		
	
      $scope.mapCenter = {};
	  $scope.mapDefaults = {};
	  $scope.mapMarkers = [];
	  $scope.userCoords = {};
	  $scope.data = {};
	  $scope.radius = {};
	  $scope.mapEnabled = false;
	  $scope.mapBounds;
	  var userPos;
	  
	 
		
		function createData4POST(map)
		{
			$scope.mapBounds = map.getBounds();
			$scope.data = {
				"loc": {
					"$geoWithin": {
						"$geometry": {
							"type" : "Polygon",
							"coordinates": [[
								[ $scope.mapBounds._northEast.lng, $scope.mapBounds._northEast.lat ],
								[ $scope.mapBounds._southWest.lng, $scope.mapBounds._northEast.lat ], 
								[ $scope.mapBounds._southWest.lng, $scope.mapBounds._southWest.lat ], 
								[ $scope.mapBounds._northEast.lng, $scope.mapBounds._southWest.lat ],
								[ $scope.mapBounds._northEast.lng, $scope.mapBounds._northEast.lat ]
							]]
						}
					}
				}
			}
		}
		
		
		//recupération des issues dans le périmètre de l'utilisateur
		function getIssuesFromLocation()
		{
			$http({
				method: 'POST',
				headers: {"x-pagination": "0;100","x-sort":  "-createdOn"},
				url: apiUrl + '/issues/search',
				data: $scope.data
			}).success(addIssues2MapMarkers)
		}
		
		function addIssues2MapMarkers(issues)
		{
			clearMarkers();
			$scope.mapMarkers.push(userPos);
			
			angular.forEach(issues, function(issue, index){
				
				var icon = "bullhorn";
				var color = "darkred";
				
				switch(issue.issueType.code) {
					case "grf":
						icon = "eyedropper";
						break;
					case "bsl":
						icon = "eye-slash";
						break;
					default:
						
				}
				
				switch(issue.state) {
					case "in_progress":
						color = "darkgreen";
						break;
					case "assigned":
						color = "eyeslash";
						break;
					case "acknowledged":
						color = "orange";
						break;
					case "solved":
						color = "green";
						break;
					case "created":
						color = "cadetblue";
						break;
					default:
						
				}
				
				$scope.mapMarkers.push({
					lat: issue.lat,
					lng: issue.lng,
					icon: {
						type: 'awesomeMarker',
						icon: icon,
						prefix: 'fa',
						markerColor: color
					},
					message: "<p>{{ issue.description }}</p><img src=\"{{ issue.imageUrl }}\" width=\"200px\" />",
					getMessageScope: function() {
						var scope = $scope.$new();
						scope.issue = issue;
						return scope;
					}
				});
					
			});
		}
		
		function clearMarkers(){
			$scope.mapMarkers.length =0;
		}
		
		$scope.$on('leafletDirectiveMap.zoomend', function(event){
			leafletData.getMap().then(createData4POST).then(getIssuesFromLocation);
		});
		$scope.$on('leafletDirectiveMap.moveend', function(event){
			leafletData.getMap().then(createData4POST).then(getIssuesFromLocation);
		});
		
   
	//recupération de la localisation de l'utilisateur 
	geolocation.getLocation().then(function(data) {
		
		$scope.mapCenter.lat = data.coords.latitude;
		$scope.mapCenter.lng = data.coords.longitude;
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
		userPos = {
			lat: $scope.userCoords.lat,
			lng: $scope.userCoords.lng,
		}
		$scope.mapMarkers.push(userPos);

	}, function(error) {
		$log.error("Could not get location: " + error);
	})
	
	
})