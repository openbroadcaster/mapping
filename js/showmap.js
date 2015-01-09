function getOutput() {
  getRequest(
      'timestamp.php', // URL for the PHP file
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
var map = new L.Map('map',{attributionControl:false}).setView([60.2928,-134.25921], 13);
var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
var markerLayer = new L.layerGroup();
var OSMBase = L.tileLayer(
		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; ' + mapLink ,
		maxZoom: 18
		}).addTo(map);

var alerts = L.realtime({
	url: '../includes/alerts.json',
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
       onEachFeature: function(feature,layer){
             if (feature.properties) {
                 var popCon;
                     popCon = "<p>" + feature.properties.title + "</p>";
                     popCon =  popCon + "<a href=" + feature.properties.link.href + ">Link</a>\n";
                     popCon = popCon + "<p>" + feature.properties.summary.content + "</p>";
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
         },
         filter: function(feature, layer) {
             return feature.properties.category[3].term == "language=en-CA"
                    && feature.properties.category[0].term != "status=Test"
//                    && feature.properties.category[6].term != "urgency=Past"
        ;}
         }).addTo(map);
    alerts.on('update', function() {
    map.fitBounds(alerts.getBounds(), {maxZoom: 3});
    getOutput();
});

	var usalert = L.tileLayer.wms('http://gis.srh.noaa.gov/arcgis/services/watchwarn/MapServer/WMSServer', {
		format: 'img/png',
		transparent: true,
		layers: 0,
		reuseTiles: true 
		}).addTo(map);

$.getJSON("../includes/canleg.json",function(data) {
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
$.getJSON("../includes/usaleg.json",function(data) {
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

