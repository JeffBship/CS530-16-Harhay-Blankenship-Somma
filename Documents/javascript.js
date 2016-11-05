
var busContainer = document.getElementById("bus-info");
var btn = document.getElementById("btn");
var updateDelay = 15000; //this is time in milliseconds between updates

function busUpdate(){
    var locationRequest = new XMLHttpRequest();
    locationRequest.open('GET','http://65.213.12.244/realtimefeed/vehicle/vehiclepositions.json');
    locationRequest.onload = function(){
        var busData = JSON.parse(locationRequest.responseText);
        renderHTML(busData);
        };
    var fullTime = new Date();
    var shortTime = fullTime.toLocaleTimeString();
    document.getElementById('next').innerHTML = "Last Update: " + shortTime;
    var delay = updateDelay/1000;
    document.getElementById('interval').innerHTML = "Update interval: " + delay + " seconds";
    var t2 = setTimeout(busUpdate, updateDelay);
    locationRequest.send();
    
    
    }

btn.addEventListener("click", busUpdate() );

function start(){  //this runs onloading the index.html page
    showTime();
    busUpdate();    
}

function renderHTML(data){
    var htmlString = "<p>";
    for (i=0;i<data.entity.length;i++){
        htmlString += "Bus#: " + data.entity[i].vehicle.vehicle.id;
        htmlString += "&nbsp  &nbsp  ";
        htmlString += "latitude: " + data.entity[i].vehicle.position.latitude;
        for (j=0;j<  (15-data.entity[i].vehicle.position.latitude.toString().length) ;j++)
            htmlString += "&nbsp";
        htmlString += "longitude: " + data.entity[i].vehicle.position.longitude;
        for (j=0;j<  15-data.entity[i].vehicle.position.longitude.toString().length;j++)
            htmlString += "&nbsp";
        var timeStamp = data.entity[i].vehicle.timestamp*1000;
        var date = new Date(timeStamp);
        var shortDate = date.toLocaleTimeString();
        
        htmlString += "&nbsp &nbsp Timestamp: " + shortDate;
        htmlString += "</br>";
        }
    htmlString += "</p>";
    busContainer.innerHTML = htmlString;
    }
    
function showTime() {
    var fullTime = new Date();
    var shortTime = fullTime.toLocaleTimeString();
    document.getElementById('time').innerHTML = "Current Time: " + shortTime;
    var t = setTimeout(showTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}    
