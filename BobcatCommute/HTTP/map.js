function initMap() {
//	console.log("Init Map")
//    var testBusLoc = getBusLocations()
    //testBusLat = (testBusLoc[0])
    //testBusLong = (testBusLoc[1])
//    console.log("testBusLat: "+testBusLoc)

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
	

	
	
	
	
    var busPosition = {lat: 41.7637, lng: -72.6851};
	
	var busMarkerOptions = {
    	position: busPosition,
		icon: icons["busIcons"].icon,
		map: map
    };
    	
	var busMarker = new google.maps.Marker(busMarkerOptions);
    busMarker.setMap(map);
	
	
    var busInfoWindowOptions = {
        content: 'Bus Schedule!'
    };
    
    var busInfoWindow = new google.maps.InfoWindow(busInfoWindowOptions);
    google.maps.event.addListener(busMarker,'click',function(e){
      busInfoWindow.open(map, busMarker);
    });
	
	

	
    var shapeCoords = [
    {lat: 41.764092,lng: -72.673866},
    {lat: 41.765766,lng: -72.673357},
    {lat: 41.765968,lng: -72.673294},
    {lat: 41.766371,lng: -72.673177},
    {lat: 41.766467,lng: -72.673165}

    ];

    var routePath = new google.maps.Polyline({
          path: shapeCoords,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

    routePath.setMap(map);


  }

//{lat: 41.7637, lng: -72.6851};