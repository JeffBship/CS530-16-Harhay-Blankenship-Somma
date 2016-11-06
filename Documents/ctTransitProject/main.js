function getBusLocations() {
  var busLocations = $.getJSON( "http://65.213.12.244/realtimefeed/vehicle/vehiclepositions.json", function() {
      busLocationsParse = JSON.parse(busLocations.responseText)
        console.log(busLocationsParse["entity"][0])
        busLat = (busLocationsParse["entity"][0]["vehicle"]["position"]["latitude"])
        busLong = (busLocationsParse["entity"][0]["vehicle"]["position"]["latitude"])
        console.log("busLat: "+busLat)
        for (bus in busLocationsParse["entity"]){
           console.log("Latitude: "+busLocationsParse["entity"][bus]["vehicle"]["position"]["latitude"])
           console.log("Longitude: "+busLocationsParse["entity"][bus]["vehicle"]["position"]["longitude"])
        }
      return ([busLat,busLong]);
  })
}

//var testBusLoc = getBusLocations()