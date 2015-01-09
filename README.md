ObMap
=====

REQUIREMENTS
============
<a href="http://jquery.com">jQuery</a><br>
<a href="http://leafletjs.com">Leafletjs</a> javascript library.<br>
<a href="https://github.com/perliedman/leaflet-realtime">Leaflet-Realtime</a> plugin for adding map layers for live tracking of GPS, sensor data, etc.

DESCRIPTION
===========
Show NAAD and NOAA public alerts on a map

ObMap presently works as a standalone application, but follows the OpenBroadcaster plugin framework to allow for future integration into the <a href="https://github.com/openbroadcaster/Server"> Server Platform</a>.

The National Alert Aggregation & Dissemination (NAAD)<a href="https://alerts.pelmorex.com/activealertscanada/"> GeoRSS</a> feed provides realtime Active Public Safety Messages (CAP-CP) alerts issued by Authorized Government Agencies for Canada (see <a href="https://alerts.pelmorex.com/techinfo/">tech info</a> for specs). The feed may be found at <a href="http://rss.naad-adna.pelmorex.com/">http://rss.naad-adna.pelmorex.com/</a>.<br> Conversion of the GeoRSS feed into geoJSON makes use of Andrew Harvey's excellent <a href="https://github.com/andrewharvey/map.rfs"> prototype</a>

The National Oceanic & Atmospheric Administration (NOAA) provides a <a href="http://gis.srh.noaa.gov/arcgis/rest/services/watchwarn/MapServer">WMS map service</a> that shows where a warning of hazardous weather or hydrologic event is occurring, imminent or likely.

