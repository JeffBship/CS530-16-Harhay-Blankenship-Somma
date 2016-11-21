function Vehicle(name, latitude, longitude, route_id) {
	this.name = name;
	this.latitude = latitude;
	this.longitude = longitude;
	this.route_id = route_id;
};

function getRoutes() {
  var routeShapes = $.getJSON("googlha_transit/shapes.txt")
  var routes = $.getJSON("googlha_transit/routes.txt")
};


function initMap() {
	console.log("Init Map")

    var icons = {
      busIcons: {icon:'bus-side-view.png'}
    }
    
	var mapOptions = {
        center: new google.maps.LatLng(41.7637,-72.6851),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
	
   	var map = new google.maps.Map(document.getElementById('map'), mapOptions);
	
	/////////////////////////////////////////////////////////////
	// AutoComplete Search Box
	var acOptions = {
      types: ['establishment']
    };
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),acOptions);
    autocomplete.bindTo('bounds',map);
	
	var infoWindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
      map: map
    });
	
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
      infoWindow.close();
      var place = autocomplete.getPlace();
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
      marker.setPosition(place.geometry.location);
      infoWindow.setContent('<div><strong>' + place.name + '</strong><br>');
      infoWindow.open(map, marker);
      google.maps.event.addListener(marker,'click',function(e){
    
        infoWindow.open(map, marker);
    
      });
    }); 
	// END of AutoComplete Search Box
	/////////////////////////////////////////////////////////////
	
	
    var shapeCoords = [
    {lat: 41.764092,lng: -72.673866},
    {lat: 41.765766,lng: -72.673357},
    {lat: 41.765968,lng: -72.673294},
    {lat: 41.766371,lng: -72.673177},
    {lat: 41.766467,lng: -72.673165}

    ];
	
    var routePosition = {lat: 41.764092, lng: -72.673866};

    var routePath = new google.maps.Polyline({
          path: shapeCoords,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
		  position: routePosition
        });

    routePath.setMap(map);

    var routeInfoWindowOptions = {
        content: 'Route Schedule!'
    };
    
    var routeInfoWindow = new google.maps.InfoWindow(routeInfoWindowOptions);
    google.maps.event.addListener(routePath,'click',function(e){
      routeInfoWindow.open(map, routePath);
    });

		
	
    var busLocationsRaw = $.getJSON( "http://65.213.12.244/realtimefeed/vehicle/vehiclepositions.json", function() {
    //var busLocationsRaw = $.getJSON("googlha_transit/vehiclepositions.json", function() {
  
    busLocationsParse = JSON.parse(busLocationsRaw.responseText)
        //console.log(busLocationsParse["entity"][0])

    busLat = (busLocationsParse["entity"][0]["vehicle"]["position"]["latitude"])
    busLong = (busLocationsParse["entity"][0]["vehicle"]["position"]["longitude"])
    console.log("busLat: "+busLat+"  busLong: "+busLong)
	
	var i=0;
	var busLocationsArray = [];
	
    for (bus in busLocationsParse["entity"]){
		busLocationsArray.push(new Vehicle(busLocationsParse["entity"][bus]["id"], busLocationsParse["entity"][bus]["vehicle"]["position"]["latitude"], busLocationsParse["entity"][bus]["vehicle"]["position"]["longitude"], busLocationsParse["entity"][bus]["vehicle"]["trip"]["route_id"]));
         //console.log("Name: "+busLocationsParse["entity"][bus]["id"])
         //console.log("Latitude: "+busLocationsParse["entity"][bus]["vehicle"]["position"]["latitude"])
         //console.log("Longitude: "+busLocationsParse["entity"][bus]["vehicle"]["position"]["longitude"])
		i = i + 1;
    }
	
	console.log(busLocationsArray[0])
	console.log(busLocationsArray[1])
	console.log(busLocationsArray[2])
	
	var busPosition = {lat: 41.7637, lng: -72.6851};
	
	var busMarkerOptions = {
    	position: busPosition,
		icon: icons["busIcons"].icon,
		map: map
    };
    	
	//var busMarker = new google.maps.Marker(busMarkerOptions);
    //busMarker.setMap(map);
	
    var busInfoWindowOptions = {
        content: 'Bus Schedule!'
    };
    
    //var busInfoWindow = new google.maps.InfoWindow(busInfoWindowOptions);
    //google.maps.event.addListener(busMarker,'click',function(e){
    //  busInfoWindow.open(map, busMarker);

	/*
	for (var i=0; i<busLocationsArray.length; i++) {  

		busMarker = new google.maps.Marker({
         		  position: new google.maps.LatLng(busLocationsArray[i][latitude], busLocationsArray[i][longitude]),
         		  map: map
    			  });
	
		google.maps.event.addListener(busMarker, 'click', (function(busMarker, i) {
           return function() {
             infowindow.setContent(busLocationsArray[i][name]);
             infowindow.open(map, busMarker);
         	 }
    	 	 })(busMarker, i));
	
	}
	*/
    


}

