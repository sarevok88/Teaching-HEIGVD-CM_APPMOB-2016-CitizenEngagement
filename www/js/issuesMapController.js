angular.module("citizen-engagement.issuesMap", ['angular-storage', "geolocation","leaflet-directive"])

.controller("issuesMapController", function($log, $scope, geolocation,mapboxMapId, mapboxAccessToken) {
	
	$scope.$on('$ionicView.beforeEnter', function() {
      $scope.mapCenter = {};
    });
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
		
	
		$scope.mapMarkers = [];
	
	}, function(error) {
		$log.error("Could not get location: " + error);
	});
})