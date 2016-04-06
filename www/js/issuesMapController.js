angular.module("citizen-engagement.issuesMap", ['angular-storage', "geolocation","leaflet-directive"])

.controller("issuesMapController", function($log, $scope, geolocation, mapboxMapId, mapboxAccessToken, AuthService) {
	
	
      $scope.mapCenter = {};
	  $scope.mapDefaults = {};
	  $scope.mapMarkers = [];
	  $scope.userCoords = {};
   
	
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
	
	}, function(error) {
		$log.error("Could not get location: " + error);
	});
})