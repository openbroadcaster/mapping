/*     
    Copyright 2012 OpenBroadcaster, Inc.

    This file is part of OpenBroadcaster Server.

    OpenBroadcaster Server is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    OpenBroadcaster Server is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with OpenBroadcaster Server.  If not, see <http://www.gnu.org/licenses/>.
*/

var ModuleDevicemap = new function()
{

	this.init_module = function()
	{
	$('#obmenu-admin').append('<li style="font-size:1.0em;">Plugins<ul><li data-permissions="view_devicemap"><a href="javascript: ModuleDevicemap.init_map();">Device Map</a></li></ul></li>');

//static leaflet files placed in js and css directories
//static leaflet files placed in js and css directories
/*
           var file = document.createElement('link');
       file.setAttribute('rel', 'stylesheet');
       file.setAttribute('type', 'text/css');
       file.setAttribute('href', 'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css');
       document.getElementsByTagName('head')[0].appendChild(file);
*/

           var file = document.createElement('link');
       file.setAttribute('rel', 'stylesheet');
       file.setAttribute('type', 'text/css');
       file.setAttribute('href', 'http://leaflet.github.io/Leaflet.draw/leaflet.draw.css');
       document.getElementsByTagName('head')[0].appendChild(file);

           var script = document.createElement('script');
       script.setAttribute('type', 'text/javascript');
       script.setAttribute('src', 'http://leaflet.github.io/Leaflet.draw/leaflet.draw.js');
       document.getElementsByTagName('head')[0].appendChild(script);

           var script = document.createElement('script');
       script.setAttribute('type', 'text/javascript');
       script.setAttribute('src', '../junk/leaflet-realtime.js');
       document.getElementsByTagName('head')[0].appendChild(script);

           var script = document.createElement('script');
       script.setAttribute('type', 'text/javascript');
       script.setAttribute('src', 'http://maps.stamen.com/js/tile.stamen.js?v1.2.3');
       document.getElementsByTagName('head')[0].appendChild(script);
/*
           var script = document.createElement('script');
       script.setAttribute('type', 'text/javascript');
       script.setAttribute('src', 'http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js');
       document.getElementsByTagName('head')[0].appendChild(script);
*/
     }
        this.init_map =  function()
	{
	
		function onEachFeature(feature, layer) {
	
	  if (feature.properties) {
                 var popCon;
                     popCon = "<h4>"  + feature.properties.title.toUpperCase() + "</h4>";
                     popCon =  popCon + "<a href=" + feature.properties.link.href + "> (LINK TO SOURCE)</a><br>";
                     popCon = popCon + feature.properties.summary.content ;
                }
             layer.bindPopup(popCon);
             var ctr = layer.getBounds().getCenter();
             var smallIcon = L. icon(
				{iconUrl:feature.properties.iconURL, 
				 iconSize: [32,32]
				});
             var marker = new L.Marker(ctr, {icon:smallIcon});
             marker.bindPopup(popCon);
             markerLayer.addLayer(marker);
             markerLayer.addTo(map);
		};
$('#layout_main').html(html.get('modules/device_map/devicemap.html'));

        function onEachFeature(feature, layer) {
          if (feature.properties) {
                 var popCon;
                     popCon = "<h4>"  + feature.properties.title.toUpperCase() + "</h4>";
                     popCon =  popCon + "<a href=" + feature.properties.link.href + "> (LINK TO SOURCE)</a><br>";
                     popCon = popCon + feature.properties.summary.content ;
                }
             layer.bindPopup(popCon);
             var ctr = layer.getBounds().getCenter();
             var smallIcon = L. icon(
                                {iconUrl:feature.properties.iconURL,
                                 iconSize: [16,16]
                                });
             var marker = new L.Marker(ctr, {icon:smallIcon});
             marker.bindPopup(popCon);
             markerLayer.addLayer(marker);
             markerLayer.addTo(map);
                };

function getOutput() {
  getRequest(
      '../modules/device_map/html/timestamp.php', // URL for the PHP file
       drawOutput,  // handle successful request
       drawError    // handle error
  );
  return false;
}
// handles drawing an error message
function drawError() {
    var container = document.getElementById('timestamp');
    container.innerHTML = 'Bummer: Alerts file not found!';
}
// handles the response, adds the html
function drawOutput(responseText) {
    var container = document.getElementById('timestamp');
    responseText = responseText.replace(/"/g, "");
    container.innerHTML = responseText;
}
// helper function for cross-browser request object
function getRequest(url, success, error) {
    var req = false;
    try{
        // most browsers
        req = new XMLHttpRequest();
    } catch (e){
        // IE
        try{
            req = new ActiveXObject("Msxml2.XMLHTTP");
        } catch(e) {
            // try an older version
            try{
                req = new ActiveXObject("Microsoft.XMLHTTP");
            } catch(e) {
                return false;
            }
        }
    }
    if (!req) return false;
    if (typeof success != 'function') success = function () {};
    if (typeof error!= 'function') error = function () {};
    req.onreadystatechange = function(){
        if(req.readyState == 4) {
            return req.status === 200 ?
                success(req.responseText) : error(req.status);
        }
    }
    req.open("GET", url, true);
    req.send(null);
    return req;
}
/*
var timeInSecs;
var ticker;

function startTimer(secs){
timeInSecs = parseInt(secs)-1;
ticker = setInterval("tick()",1000);   // every second
}

function tick() {
var secs = timeInSecs;
if (secs>0) {
timeInSecs--;
}
else {
clearInterval(ticker); // stop counting at zero
startTimer(60);  // remove forward slashes in front of startTimer to repeat if required
}

document.getElementById("countdown").innerHTML = "Map will refresh in " + secs + " seconds.\n";
}

startTimer(60);  // 60 seconds
*/

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}


function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('time').innerHTML = "Local Time: " + h + ":" + m + ":" + s;
    t = setTimeout(function () {
        startTime()
    }, 500);
}
startTime();
getOutput();
var naadStyle = {
                color: "#2262CC",
                weight: 0,
                opacity: 0.1,
                fillOpacity: 0.1,
                fillColor: "#CC2247"
        };


//var map = new L.Map('map',{attributionControl:false}).setView([60.2928,-134.25921], 13);
var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
var markerLayer = new L.layerGroup();
var OSMBase = L.tileLayer(
                'https://{s}.tiles.mapbox.com/v3/geoprism.h4g8f1k5/{z}/{x}/{y}.png', {
                attribution: '&copy; ' + mapLink ,
                maxZoom: 18
                });

         var watercolor = new  L.StamenTileLayer("watercolor");
         var toner= new  L.StamenTileLayer("toner");

         var bases = {
             "Watercolor":watercolor,
             "Contrast":toner,
             "OpenStreetMap": OSMBase
                    }
        var map = L.map('map',{layers:[toner,watercolor, OSMBase],attributionControl:false}).setView([60.2928,-134.25921], 13);
                L.control.layers(bases).addTo(map);
                var markerLayer = new L.layerGroup();
var alerts = L.realtime({
        url: '../modules/device_map/includes/alerts.json',
        crossOrign: false,
        type: 'json',
       },{
        interval: 60 * 1000,
        style: function (feature) {
        if (feature.properties.category[6].term != "urgency=Past")
         {
         return {color: "#2262CC", weight: 0, opacity: 0.1, fillOpacity: 0.1, fillColor: "#CC2247"}
         } else
         {
         return {color: "#2262CC", weight: 0, opacity: 0.1, fillOpacity: 0.1, fillColor: "#0f0f0f"}
         }
        },
       onEachFeature: onEachFeature,
         filter: function(feature, layer) {
             return feature.properties.category[3].term == "language=en-CA"
                    && feature.properties.category[0].term != "status=Test"
//                    && feature.properties.category[6].term != "urgency=Past"
        ;}
         }).addTo(map);
map.setView([64,-98],3);
alerts.on('update', function() {
//map.fitBounds(alerts.getBounds(), {maxZoom: 3});
    getOutput();
});
	var usalert = L.tileLayer.wms('http://gis.srh.noaa.gov/arcgis/services/watchwarn/MapServer/WMSServer', {
		format: 'img/png',
		transparent: true,
		layers: 0,
		reuseTiles: true 
		}).addTo(map);

$.getJSON("../modules/device_map/includes/canleg.json",function(data) {
    for (var i = 0; i < data.length; i++) {
        drawRow(data[i]);
        }
        function drawRow(rowData) {
        var row = $("<tr />")
        $("#legendCAN").append(row);
        row.append($("<td>" + rowData.label + "</td>"));
        row.append($("<td><img src='data:image/png;base64," +
                rowData.imageData + "'></td>"));
                }
});
$.getJSON("../modules/device_map/includes/usaleg.json",function(data) {
    for (var i = 0; i < data.length; i++) {
        drawRow(data[i]);
        }
        function drawRow(rowData) {
        var row = $("<tr />")
        $("#legendUSA").append(row);
        row.append($("<td>" + rowData.label + "</td>"));
        row.append($("<td><img src='data:image/png;base64," +
                rowData.imageData + "'></td>"));
                }
});
        var credits = L.control.attribution({position: 'bottomleft'}).addTo(map);
        var naadLink= '<a href="http://rss1.naad-adna.pelmorex.com">NAAD GeoRSS</a>';
        var noaaLink= '<a href="http://gis.srh.noaa.gov/arcgis/services/watchwarn/MapServer/WMSServer?request=GetCapabilities&service=WMS">NOAA WMS</a>';
    credits.addAttribution('&#124; ' + naadLink + ' &#124; ' + noaaLink);

  } //end init_map
  
    this.resize = function()
    {
    if(!$('#map_container:visible').length) return;

    // we're on fullscreen mode.
    if($('#map_container').css('position')=='fixed')
    {
      $('#map_container').css({'width': $(window).width()+'px', 'height': $(window).height()+'px'});
    }
    // we're not on fullscreen mode.
    else
    {
      $('#map_container').css({'width': '100%', 'height': '100%'});
    }
  }
}

$(document).ready(function() {

	ModuleDevicemap.init_module();

});


