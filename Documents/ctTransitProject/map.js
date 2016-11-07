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
      zoom: 15,
      center: {lat: 41.7637, lng: -72.6851}
    });
    var uluru = {lat: 41.7637, lng: -72.6851};

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

    var marker = new google.maps.Marker({
      position: uluru,
      icon: icons["busIcons"].icon,
      map: map
    });
  }

//{lat: 41.7637, lng: -72.6851};