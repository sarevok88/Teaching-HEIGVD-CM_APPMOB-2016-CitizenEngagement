angular.module("citizen-engagement.issuesMap", ['angular-storage', 'leaflet-directive','geolocation'])

.controller("issuesMapController", function($http, apiUrl, $log, $scope, geolocation, mapboxMapId, mapboxAccessToken, AuthService, leafletData) {
	
	
      $scope.mapCenter = {};
	  $scope.mapDefaults = {};
	  $scope.mapMarkers = [];
	  $scope.userCoords = {};
	  $scope.data = {};
	  $scope.radius = {};
	  $scope.mapEnabled = false;
   
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
		
		$scope.mapMarkers.push({
			lat: $scope.userCoords.lat,
			lng: $scope.userCoords.lng,
			
		});
		
		function calculateRadius(map){
			
			var mapBounds = map.getBounds();
			var x1 = mapBounds._northEast.lat;
			var y1 = mapBounds._northEast.lng;
			var x0 = $scope.mapCenter.lat;
			var y0 = $scope.mapCenter.lng;
			
			//on a besoin du rayon de la sphère en radian (d'après mongoDB $centerSphere)
			$scope.radius = mapBounds._northEast.distanceTo($scope.mapCenter)/6135; 
		}
		
		function createData4POST()
		{
			$scope.data = {
				"loc": {
					"$geoWithin": {
						"$centerSphere" : [
							[ $scope.mapCenter.lat , $scope.mapCenter.lng ],
								1
							]
					}
				}
			}
		}
		
		
		//recupération des issues dans le périmètre de l'utilisateur
		function getIssuesFromLocation()
		{
			$http({
				method: 'POST',
				url: apiUrl + '/issues/search',
				data: $scope.data
			}).success(addIssues2MapMarkers)
		}
		
		function addIssues2MapMarkers(issues)
		{
			angular.forEach(issues, function(issue, index){
				
			
				$scope.mapMarkers.push({
					color: "#FF0000",
					lat: issue.lat,
					lng: issue.lng,
					message: "<p>{{ issue.description }}</p><img src=\"{{ issue.imageUrl }}\" width=\"200px\" />",
					getMessageScope: function() {
						var scope = $scope.$new();
						scope.issue = issue;
						return scope;
					}
				});
					
			});
		}
		
	
		
	
		leafletData.getMap().then(calculateRadius).then(createData4POST).then(getIssuesFromLocation);
		
	

	}, function(error) {
		$log.error("Could not get location: " + error);
	}).then(function(){
			$scope.$on('leafletDirectiveMap.zoomend', function(event){
				console.log("zoom fini");
    });
	});
	
})