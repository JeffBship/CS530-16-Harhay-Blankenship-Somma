function initMap() {
	console.log("Init Map")

    var icons = {
      busIcons: {icon:'bus-side-view.png'}
    }
    
	var mapOptions = {
        center: new google.maps.LatLng(41.7637,-72.6851),
        zoom: 11,
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
	
	// Pull and parse the real-time vehicle location information
    var busLocationsRaw = $.getJSON( "http://65.213.12.244/realtimefeed/vehicle/vehiclepositions.json", function() {
    // Would prefer to pull this data locally while testing, but can't get it to work //var busLocationsRaw = $.getJSON("googlha_transit/vehiclepositions.json", function() {
  
    busLocationsParse = JSON.parse(busLocationsRaw.responseText)
	
	var busLocationsArray = [];
	
	// Push all the vehicle data to an array of Vehicle objects.
    for (bus in busLocationsParse["entity"]){
		busLocationsArray.push(new Vehicle(
				busLocationsParse["entity"][bus]["id"], 
				busLocationsParse["entity"][bus]["vehicle"]["position"]["latitude"], 
				busLocationsParse["entity"][bus]["vehicle"]["position"]["longitude"], 
				busLocationsParse["entity"][bus]["vehicle"]["trip"]["route_id"],
				busLocationsParse["entity"][bus]["alert"],
				busLocationsParse["entity"][bus]["trip_update"],
				busLocationsParse["entity"][bus]["vehicle"]["trip"]["schedule_relationship"],
				busLocationsParse["entity"][bus]["vehicle"]["trip"]["start_date"],
				busLocationsParse["entity"][bus]["vehicle"]["trip"]["trip_id"],
				busLocationsParse["entity"][bus]["vehicle"]["label"],
				busLocationsParse["entity"][bus]["vehicle"]["id"]
				));
    }
		
	var busMarker;
	var busInfoWindow = new google.maps.InfoWindow();
	
	// Draw all the vehicles on the map, and create pop-up windows for each.
	for (var i=0; i<busLocationsArray.length; i++) {  
		console.log(busLocationsArray[i])
		
		busMarker = new google.maps.Marker({
						position: new google.maps.LatLng(busLocationsArray[i].latitude, busLocationsArray[i].longitude),
						icon: icons["busIcons"].icon,
						map: map
						});
	   	
		google.maps.event.addListener(busMarker, 'click', (function(busMarker, i) {
           return function() {
             busInfoWindow.setContent(
			 			'<div class="busID">'
			 			+busLocationsArray[i].id
						+'</div>'
						+'Alert: '+busLocationsArray[i].alert+'<br>'
						+'Route_ID: '+busLocationsArray[i].route_id+'<br>'
						+'Trip_ID: '+busLocationsArray[i].trip_id
						);
             busInfoWindow.open(map, busMarker);
         	 }
    	 	 })(busMarker, i));
	} // end for loop
	
  }); // end JSON function for busLocationsRaw

	
var shapesRaw = jQuery.get('https://chrisharhay.github.io/googleha_transit/shapes_medium.txt', function(data) {
	var shapes = csvToArray(shapesRaw.responseText);
	//console.log(shapes[0]);

	//Get distinct shape_id's so we can iterate through one at a time
	var unique = {};
	var distinctShape_id = [];
	for( var i in shapes ){
		if( typeof(unique[shapes[i].shape_id]) == "undefined"){
			distinctShape_id.push(shapes[i].shape_id);
		}
		unique[shapes[i].shape_id] = 0;
	}
	//console.log(distinctShape_id)
	//console.log(unique)
	var coordLatLng;
	var comma = ",";
	var routePosition = new google.maps.LatLng();
	var routeInfoWindow = new google.maps.InfoWindow();
	
	// Outer loop through each distinct shape_id.
	for (var i=0; i<distinctShape_id.length; i++) { 
		console.log(distinctShape_id[i])
		
		// Filter to the rows that belong to the current shape_id
		var currentShape = shapes.filter(function (el) {
			return el.shape_id == distinctShape_id[i];
		});

		var shapeCoords = [];

		// Inner loop through each row for the current shape_id to build up the shape
		for (var j=0; j<currentShape.length; j++) {  
			coordLatLng = new google.maps.LatLng(currentShape[j].shape_pt_lat, currentShape[j].shape_pt_lon);
			//console.log(coordLatLng.toString());
			shapeCoords.push(coordLatLng);
		}
		//console.log(shapeCoords);
		
		routePosition = coordLatLng; //the last latlong of the current shape will be used as the InfoWindow pop-up location.
		//console.log(routePosition);
		var routePath = new google.maps.Polyline({
			  path: shapeCoords,
			  geodesic: true,
			  strokeColor: getRandomColor(), //need to randomize this color
			  strokeOpacity: 1.0,
			  strokeWeight: 2,
			  position: routePosition
			});

		routePath.setMap(map);
		
		google.maps.event.addListener(routePath, 'click', (function(routePath, i) {
           return function() {
             routeInfoWindow.setContent(
			 			'<div class="busID">'
			 			+'Route '+distinctShape_id[i]
						+'</div>'
						);
             routeInfoWindow.open(map, routePath);
         	 }
    	 	 })(routePath, i));
		
	} // end Outer for loop	
	
}); // end shapesRaw

	
	///*
	//$(document).ready(function() {
		$.ajax({
			type: "GET",
			url: "https://chrisharhay.github.io/googleha_transit/shapes_smalltest.txt",
			dataType: "csv",
			success: function(data) {processData(data);}
		 });
	//});
	//*/
	
	
}; // end function initMap()


function Vehicle(
		 id, 
		 latitude, 
		 longitude, 
		 route_id,
		 alert,
		 trip_update,
		 schedule_relationship,
		 start_date,
		 trip_id,
		 label,
		 vehicle_id
		 ) {
	this.id = id;
	this.latitude = latitude;
	this.longitude = longitude;
	this.route_id = route_id;
	this.alert = alert;
	this.trip_update = trip_update;
	this.schedule_relationship = schedule_relationship;
	this.start_date = start_date;
	this.trip_id = trip_id;
	this.label = label;
	this.vehicle_id = vehicle_id;
};


function getRoutes() {
  var routeShapes = $.getJSON("https://chrisharhay.github.io/googleha_transit/shapes.txt")
  console.log(routeShapes[0]);
  var routes = $.getJSON("https://chrisharhay.github.io/googleha_transit/routes.txt")
  return routeShapes;
};


function handleFiles() {
	console.log("handleFiles");
	$(document).ready(function() {
		$.ajax({
			type: "GET",
			url: "https://chrisharhay.github.io/googleha_transit/shapes_smalltest.txt",
			dataType: "csv",
			success: function(data) {processData(data);}
		 });
	});
};

function processData(allText) {
	console.log("processData");
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }
	alert(lines);
    console.log(lines);
	return lines;
}


function csvToArray(csvString) {

	// The array we're going to build
	var csvArray = [];
	// Break it into rows to start
	var csvRows = csvString.split(/\n|\r\n/);

	// Take off the first line to get the headers, then split that into an array
	var csvHeaders = csvRows.shift().split(',');

	// Loop through remaining rows
	for (var rowIndex = 0; rowIndex < csvRows.length; ++rowIndex) {
		var rowArray = csvRows[rowIndex].split(',');

		// Create a new row object to store our data.
		var rowObject = csvArray[rowIndex] = {};

		// Then iterate through the remaining properties and use the headers as keys
		for (var propIndex = 0; propIndex < rowArray.length; ++propIndex) {
			// Grab the value from the row array we're looping through...
			var propValue = rowArray[propIndex];
			// ...also grab the relevant header (the RegExp in both of these removes quotes)
			var propLabel = csvHeaders[propIndex];

			rowObject[propLabel] = propValue;
		}
	}
	return csvArray;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}