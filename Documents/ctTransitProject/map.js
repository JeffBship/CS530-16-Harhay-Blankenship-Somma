function initMap() {
  console.log("Init Map")
    var testBusLoc = getBusLocations()
    //testBusLat = (testBusLoc[0])
    //testBusLong = (testBusLoc[1])
    console.log("testBusLat: "+testBusLoc)

    var icons = {
      busIcons: {icon:'bus-side-view.png'}
    }

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 9,
      center: {lat: 41.7637, lng: -72.6851}
    });
    var uluru = {lat: 41.7637, lng: -72.6851};
    var marker = new google.maps.Marker({
      position: uluru,
      icon: icons["busIcons"].icon,
      map: map
    });
  }

//{lat: 41.7637, lng: -72.6851};