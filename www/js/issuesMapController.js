angular.module("citizen-engagement.issuesMap", ['angular-storage', 'leaflet-directive','geolocation'])

.controller("issuesMapController", function($http, apiUrl, $log, $scope, geolocation, mapboxMapId, mapboxAccessToken, AuthService, leafletData) {
		
	
	  $scope.mapCenter = {};
	  $scope.mapDefaults = {};
	  $scope.mapMarkers = [];
	  $scope.mapIssues = [];
	  $scope.filteredIssues = [];
	  $scope.userCoords = {};
	  $scope.data = {};
	  $scope.radius = {};
	  $scope.mapEnabled = false;
	  $scope.mapBounds;
	  $scope.filters = [];
	  $scope.status = [{"name": "in_progress"}, {"name": "assigned"}, {"name": "acknowledged"}, {"name": "created"}, {"name": "solved"}];
	  var userPos;
	  
	  getIssueTypes();
	 
		
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
	
	function getIssueTypes()
	{
		$http({
			method: 'GET',
			headers: {"x-pagination": "0;100","x-sort":  "-createdOn"},
			url: apiUrl + '/issueTypes',
		}).success(createFiltersList)
	}
	
	function createFiltersList(issueTypes)
	{
		$scope.issueTypes = issueTypes;
	}
	
	

	/**
		malheureusement, je n'ai pas réussi a ce qu'Angular créer un tableaux des filtres qui sont cochés comme j'aimerais, actuellement il crée un tableau
		$scope.filters[ nom_du_filtre: true/false, nom_du_deuxième_filtre: true/false], et je n'arrive pas a le travailler sous cette forme.
	*/
	function showMarkersAfterFilters()
	{
		clearMarkers();
		
		$scope.mapMarkers.push(userPos);
		
		/**
			pour chaque issue, j'aimerais vérifier si son type est dans la liste des filtres (en true).
				Si oui: 
					je vérifie que le status de l'issue est dans la liste des filtre (en true)
						j'ajoute l'issue à la liste des markers
					sinon 
						rien
				sinon
					rien
		*/
		angular.forEach($scope.mapIssues, function(issue, index)
		{
				
		})
		
		
		
		
	}
	
	$scope.refreshIssuesByFilters = showMarkersAfterFilters;
	
	
		
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
		$scope.mapIssues = issues;
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
				case "dcr":
					icon = "map-signs";
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
	
	function refresh(event){
		leafletData.getMap().then(createData4POST).then(getIssuesFromLocation).then(showMarkersAfterFilters);
	}
	
	$scope.$on('leafletDirectiveMap.zoomend', refresh);
	$scope.$on('leafletDirectiveMap.moveend', refresh);
	
   
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
	}).then(refresh);
	
	
})