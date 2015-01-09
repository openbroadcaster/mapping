ObMap
=====

Show NAAD and NOAA public alerts on a map
This module makes use of <a href=http://leafletjs.com/reference.html"">Leafletjs</a>, a lightweight, open source Javascript Library for interactive maps.
 
The <a href="https://github.com/perliedman/leaflet-realtime">Leaflet-Realtime</a> plugin extends L.GeoJSON allowing realtime updates to map layers, e.g. live GPS tracking, sensor data etc.

ObMap presently works as a standalone application, but follows the OpenBroadcaster plugin framework to allow for future integration into the <a href="https://github.com/openbroadcaster/Server"> Server Platform</a>.

The National Alert Aggregation & Dissemination (NAAD)<a href="https://alerts.pelmorex.com/activealertscanada/"> GeoRSS</a> feed provides realtime Active Public Safety Messages (CAP-CP) alerts issued by Authorized Government Agencies for Canada (see <a href="https://alerts.pelmorex.com/techinfo/">tech info</a> for specs). The feed may be found at <a href="http://rss.naad-adna.pelmorex.com/">http://rss.naad-adna.pelmorex.com/</a>. Conversion of the GeoRSS feed into geoJSON makes use of Andrew Harvey's excellent <a href="https://github.com/andrewharvey/map.rfs"> prototype</a>

The National Oceanic & Atmospheric Administration (NOAA) provides a <a href="http://gis.srh.noaa.gov/arcgis/rest/services/watchwarn/MapServer">WMS map service</a> that shows where a warning of hazardous weather or hydrologic event is occurring, imminent or likely.

