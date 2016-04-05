angular.module("citizen-engagement.issuesMap", ['angular-storage'])

.controller("issuesMapController", function($log, $scope, geolocation) {
	// ...
	geolocation.getLocation().then(function(data) {
	$scope.mapCenter.lat = data.coords.latitude;
	$scope.mapCenter.lng = data.coords.longitude;
	}, function(error) {
		$log.error("Could not get location: " + error);
	});
})