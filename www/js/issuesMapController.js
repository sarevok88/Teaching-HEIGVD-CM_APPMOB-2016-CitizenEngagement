angular.module("citizen-engagement.issuesMap", ['angular-storage', 'leaflet-directive','geolocation'])

.controller("issuesMapController", function($http, apiUrl, $log, $scope, geolocation, mapboxMapId, mapboxAccessToken, AuthService, leafletData) {
	
	
      $scope.mapCenter = {};
	  $scope.mapDefaults = {};
	  $scope.mapMarkers = [];
	  $scope.userCoords = {};
	  $scope.data = {};
	  $scope.radius = {};
   
	//recupération de la localisation de l'utilisateur 
	geolocation.getLocation().then(function(data) {
		
		console.log(data.coords);
		
		$scope.mapCenter.lat = data.coords.latitude;
		$scope.mapCenter.lng = data.coords.longitude;
		$scope.mapCenter.zoom = 14;
		
		var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
		
		mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
		
		$scope.mapDefaults = {
			tileLayer: mapboxTileLayer
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
			$scope.radius = (Math.sqrt((((x1-x0)^2)+((y1-y0)^2))))/6371;
			
		}
		
		function createData4POST()
		{
			$scope.data = {
				"loc": {
					"$geoWithin": {
						"$centerSphere" : [
							[ $scope.mapCenter.lat , $scope.mapCenter.lng ],
								$scope.radius
							]
					}
				}
			}
			console.log(angular.toJson($scope.data));
			console.log(AuthService.currentUserId)
		}
		
		leafletData.getMap().then(calculateRadius).then(createData4POST);
		
		
	
		//recupération des issues dans le périmètre de l'utilisateur
		/*
		$http({
			method: 'POST',
			url: apiUrl + '/issues/search',
			data: $scope.data
		  }).success(function(issues) {
			console.log(issues);
		  });
	*/
	

	}, function(error) {
		$log.error("Could not get location: " + error);
	});
	

})