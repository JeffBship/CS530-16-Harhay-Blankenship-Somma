
//when the map zoom changes, resize the icon based on the zoom level so the marker covers the same geographic area
google.maps.event.addListener(map, 'zoom_changed', function() {

    var pixelSizeAtZoom0 = 8; //the size of the icon at zoom level 0
    var maxPixelSize = 350; //restricts the maximum size of the icon, otherwise the browser will choke at higher zoom levels trying to scale an image to millions of pixels

    var zoom = map.getZoom();
    var relativePixelSize = Math.round(pixelSizeAtZoom0*Math.pow(2,zoom)); // use 2 to the power of current zoom to calculate relative pixel size.  Base of exponent is 2 because relative size should double every time you zoom in

    if(relativePixelSize > maxPixelSize) //restrict the maximum size of the icon
        relativePixelSize = maxPixelSize;

    //change the size of the icon
    marker.setIcon(
        new google.maps.MarkerImage(
            marker.getIcon().url, //marker's same icon graphic
            null,//size
            null,//origin
            null, //anchor
            new google.maps.Size(relativePixelSize, relativePixelSize) //changes the scale
        )
    );        
});