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
        $('#obmenu-admin li:nth-last-child(3)').append('<ul class="hidden" style="font-size:1.2em;" data-permissions="edit_map"><li><a href="javascript: ModuleDevicemap.init_map();"> Map Settings</a></li></ul>');

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
       script.setAttribute('src', '../junk/js/leaflet-realtime.js');
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
                    
var map = L.map('map',{layers:[toner,watercolor, OSMBase],attributionControl:false}).setView([60.2928,-134.25921], 13);
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
alerts.on('update', function() {
//map.fitBounds(alerts.getBounds(), {maxZoom: 3});
});
var usalert = L.tileLayer.wms('http://gis.srh.noaa.gov/arcgis/services/watchwarn/MapServer/WMSServer', {
		format: 'img/png',
		transparent: true,
		layers: 0,
		reuseTiles: true 
		}).addTo(map);
var bases = {
            "Watercolor":watercolor,
            "Contrast":toner,
            "OpenStreetMap": OSMBase
             };
var overlays = {
	"Canada Alert Areas" : alerts,
        "CAP Alert Symbols" : markerLayer,
        "U.S.A. Alert Areas": usalert
	};

var layerControl = L.control.layers(bases, overlays).addTo(map); 
map.setView([64,-98],3);
map.on('overlayremove', function(eventLayer){
        if (eventLayer.name=='U.S.A. Alert Areas')
          { $("#legendUSA").hide() }
        else if (eventLayer.name=='CAP Alert Symbols')
          { $("#legendCAN").hide() }
});
map.on('overlayadd', function(eventLayer){
        if (eventLayer.name=='U.S.A. Alert Areas')
          { $("#legendUSA").show() }
        else if (eventLayer.name=='CAP Alert Symbols')
          { $("#legendCAN").show() }
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

var credits = L.control.attribution({position: 'bottomleft'}).addTo(map);
var naadLink= '<a href="http://rss1.naad-adna.pelmorex.com">NAAD GeoRSS</a>';
var noaaLink= '<a href="http://gis.srh.noaa.gov/arcgis/services/watchwarn/MapServer/WMSServer?request=GetCapabilities&service=WMS">NOAA WMS</a>';
credits.addAttribution('&#124; ' + naadLink + ' &#124; ' + noaaLink);

 } //end init_map

}
$(document).ready(function() {

	ModuleDevicemap.init_module();

});



