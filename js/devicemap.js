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
	$('#obmenu-media').prepend('<li style="font-size:0.8em;" data-permissions="view_map"><a href="javascript: ModuleDevicemap.init_map();">ems alerts</a></li>');
	$('#obmenu-admin').append('<li  style="font-size:0.8em;" data-permissions="edit_map"><a href="javascript: ModuleDevicemap.init_map();"> Map Settings</a></li>');

//static leaflet files placed in js and css directories

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
       script.setAttribute('src', 'http://maps.stamen.com/js/tile.stamen.js?v1.2.3');
       document.getElementsByTagName('head')[0].appendChild(script);
     }	

this.init_map =  function()
	{
	
$('#layout_main').html(html.get('modules/device_map/devicemap.html'));
function recentActive(lastconnect) {
        var nowMinus1H = Math.round((new Date()).getTime()/1000);
        if(isNaN(lastconnect)){return false;} else {var dateToTest = lastconnect};
        var diffMinutes = Math.round( (dateToTest  - nowMinus1H )/60/60)
        if (isNaN(diffMinutes)) {return false};
        if (diffMinutes > -1000) {return true} else {return false};     
}  

var curIcon = new ObsIcon({
        iconUrl: './modules/device_map/css/images/icons/black/broadcast.png',
        })
;
var emergencyIcon = new ObsIcon({
        iconUrl: './modules/device_map/css/images/icons/red/broadcast.png',
        })
;

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
		};

var naadStyle = {
		color: "#2262CC",
		weight: 0,
		opacity: 0.1,
		fillOpacity: 0.1,
		fillColor: "#CC2247"
	};	    

var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
var markerLayer = new L.layerGroup();
var OSMBase = L.tileLayer(
		'https://{s}.tiles.mapbox.com/v3/geoprism.h4g8f1k5/{z}/{x}/{y}.png', {
		attribution: '&copy; ' + mapLink ,
		maxZoom: 18
		});

var watercolor = new  L.StamenTileLayer("watercolor");
var toner= new  L.StamenTileLayer("toner");
                    
var map = L.map('map',{layers:[OSMBase,toner,watercolor],attributionControl:false}).setView([60.2928,-134.25921], 13);
var credits = L.control.attribution({position: 'bottomleft'}).addTo(map);
var modisLink = '<a href="http://earthdata.nasa.gov/data/nrt-data/firms">MODIS Hotspots:NASA</a>';
var modis24 = L.tileLayer.wms('https://firms.modaps.eosdis.nasa.gov/wms/?', {
		format: 'img/png',
		version: '1.1.1',
		transparent: false,
		minZoom: 4,
		layers: 'fires24',
		crs: L.CRS.EPSG4326,
		reuseTiles: true,
		attribution:  '&copy; ' + modisLink 
		}).addTo(map);

var modis48 = L.tileLayer.wms('https://firms.modaps.eosdis.nasa.gov/wms/?', {
		format: 'img/png',
		version: '1.1.1',
		transparent: false,
		minZoom: 3,
		layers: 'fires48',
		crs: L.CRS.EPSG4326,
		reuseTiles: true,
		attribution:  '&copy; ' + modisLink
		});
var noaaLink= '<a href="http://gis.srh.noaa.gov/arcgis/services/watchwarn/MapServer/WMSServer?request=GetCapabilities&service=WMS">NOAA WMS</a>';
var usalert = L.tileLayer.wms('http://216.38.80.5/arcgis/services/watchwarn/MapServer/WmsServer?', {
		format: 'img/png',
		transparent: true,
		layers: 0,
		reuseTiles: true,
		attribution: '&copy; ' + noaaLink 
		}).addTo(map);

var naadLink= '<a href="http://rss1.naad-adna.pelmorex.com">NAAD GeoRSS</a>';
var alerts = L.realtime({
	url: '../modules/device_map/includes/alerts.json',
	crossOrign: false,
	type: 'json',
       },{
	interval: 300 * 1000,
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
                    && feature.properties.category[0].term != "status=Test";
//                    && feature.properties.category[6].term != "urgency=Past"
        }
         });
markerLayer.addLayer(alerts);
markerLayer.addTo(map);
credits.addAttribution('&#124; ' + naadLink);

var bases = {
            "Watercolor":watercolor,
            "Contrast":toner,
            "OpenStreetMap": OSMBase
             };
var clouds = L.OWM.clouds({showLegend: false, opacity: 0.5});
var snow  = L.OWM.snow({showLegend: true, legendPosition:'bottomright',opacity: 0.5});
var precipitation  = L.OWM.precipitation({showLegend: true, opacity: 0.5});
var overlays = {
//	"Canada Alert Areas" : alerts,
        "NAAD Alerts (CAN)" : markerLayer,
        "MODIS Fires - Past 24h" : modis24,
        "MODIS Fires - Past 48h" : modis48,
        "NOAA Alerts (USA)": usalert,
        "Clouds": clouds,
        "Snow": snow,
        "Precipitation": precipitation
	};

var layerControl = L.control.layers(bases, overlays).addTo(map); 

layerControl.on('overlayremove', function(layer,name) {
	if (name = 'modis24') { 
	  $("#legendMODIS").hide();
	}
 });
layerControl.on('overlayadd', function(layer,name) {
	if (name = 'modis24') { 
	  $("#legendMODIS").show();
	}
});
alerts.on('update', function() {
//map.fitBounds(alerts.getBounds(), {maxZoom: 3});
});

var oms = new OverlappingMarkerSpiderfier(map);
var bounds = new L.LatLngBounds([59.99,-141.0],[69.85,-123.81]);
$.getJSON("./modules/device_map/html/devices_geojson.php",function (data) {
	var devices = L.geoJson(data, {
		pointToLayer: function(feature,latlng){
			
        var dmarker = new L.Marker(latlng, {icon: curIcon });
			var last_connect = !isNaN(feature.properties.last_connect) ? format_timestamp(feature.properties.last_connect) : '<i>never</i>';
			var last_connect_schedule = !isNaN(feature.properties.last_connect_schedule) ? format_timestamp(feature.properties.last_connect_schedule) : '<i>never</i>';
			var last_connect_playlog = !isNaN(feature.properties.last_connect_playlog) ? format_timestamp(feature.properties.last_connect_playlog) : '<i>never</i>';
			var last_connect_media = !isNaN(feature.properties.last_connect_media) ? format_timestamp(feature.properties.last_connect_media) : '<i>never</i>';
			var popupContent = "<h4>" + feature.properties.title + "</h4><ul>" +
			 "<li>Last Connect: " + last_connect + "</li>" +
			 "<li>Last Schedule: " + last_connect_schedule + "</li>" +
			 "<li>Last Playlog: " + last_connect_playlog + "</li>" +
			 "<li>Last Media: " + last_connect_media + "</li>" +
			 "<li>Version: " + feature.properties.version + "</li>" +
			 "<li>Location: " + feature.geometry.coordinates[0] + "," + feature.geometry.coordinates[1] + "</li>" ;
		dmarker.desc = popupContent;
		map.addLayer(dmarker);
		oms.addMarker(dmarker);
		return dmarker;
		}
        });
	bounds.extend(devices.getBounds);
	map.fitBounds(bounds);
	});
	
	var popup = new L.Popup({closeButton: false, offset: new L.Point(0.5, -24)});
	oms.addListener('click', function(marker) {
		popup.setContent(marker.desc);
		popup.setLatLng(marker.getLatLng());
		map.openPopup(popup);
	});
	oms.addListener('spiderfy', function(markers) {
		for (var i = 0, len = markers.length; i < len; i ++) markers[i].setIcon(curIcon);
		map.closePopup();
	});
	oms.addListener('unspiderfy', function(markers) {
		for (var i = 0, len = markers.length; i < len; i ++) markers[i].setIcon(curIcon);
	});

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
$("#hideLegend").click(function () {
        $("#legend").hide(200);
        $("#map").animate({width:"95%"},300,function(){
        $("#hideLegend").hide();
        $("#showLegend").show();
        credits.removeFrom(map);
        map.invalidateSize(true);
        });
});
$("#showLegend").click(function() {
        $("#map").animate({width:"68%"},300,function(){
        $("#hideLegend").show();
        $("#showLegend").hide();
        $("#legend").show(200);
        map.invalidateSize(true);
        credits.addTo(map);
        });
});
map.on('overlayremove', function(eventLayer){
	if (eventLayer.name=='NOAA Alerts (USA)')
	  { $("#legendUSA").hide() } 
	else if (eventLayer.name=='NAAD Alerts (CAN)')
	  { $("#legendCAN").hide() }
});
map.on('overlayadd', function(eventLayer){
	if (eventLayer.name=='NOAA Alerts (USA)')
	  { $("#legendUSA").show() } 
	else if (eventLayer.name=='NAAD Alerts (CAN)')
	  { $("#legendCAN").show() }
});



$("#showLegend").hide();
 } //end init_map
}
$(document).ready(function() {

	ModuleDevicemap.init_module();

});

