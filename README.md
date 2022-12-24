Mapping
=====

DESCRIPTION
===========
Show NAAD and NOAA public alerts on a map

Mapping works as a standalone application and follows the OpenBroadcaster module framework to allow integration into the <a href="https://github.com/openbroadcaster/observer"> observer Platform</a>.

The National Alert Aggregation & Dissemination (NAAD)<a href="https://alerts.pelmorex.com/other-resource/"> GeoRSS</a> feed provides realtime Active Public Safety Messages (CAP-CP) alerts issued by Authorized Government Agencies for Canada (see <a href="https://alerts.pelmorex.com/techinfo/">tech info</a> for specs). The feed may be found at <a href="http://rss.naad-adna.pelmorex.com/">http://rss.naad-adna.pelmorex.com/</a>.<br> Conversion of the GeoRSS feed into geoJSON makes use of Andrew Harvey's excellent <a href="https://github.com/andrewharvey/map.rfs"> prototype</a>

The National Oceanic & Atmospheric Administration (NOAA) provides a <a href="https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS_Forecasts_Guidance_Warnings/watch_warn_adv/MapServer">WMS map service</a> shows where a warning of hazardous weather or hydrologic event is occurring, imminent or likely.

![ Mapping](img/mapping.jpg ){: .Mapping}

INSTALL
=====
Clone git repo for Mapping module into the webroot/modules/player_map directory: 
 "git clone https://github.com/openbroadcaster/mapping.git player_map"

You may need to change ownership of all files to be readable by the web-user:
 "chown web-user:web-user player_map/ -R"

Install required PERL modules (as root):
perl -MCPAN -e shell 'install XML::Simple XML::Twig JSON'

Change to includes drectory:
 "cd player_map/includes/"
	
Run shell script:
 './convert_emerg_feed.sh' to seed alerts file.

Edit main js/layout.js at line 188:
     following 'layout.set_main_size();'
	"ModulePlayermap.init_map();"

Add a CRON job to run conversion script. For example, to run every 15 minutes:
 */15 * * * * cd /var/www/html/OpenBC/modules/player_map/includes && ./convert_emerg_feed.pl

~~~~
<p><iframe scrolling="no" src="https://xxx.openbroadcaster.com/modules/device_map/html/showmap.html" title="OpenBroadcaster Canadian CAP Alerts Map" width="400" height="400" frameborder="0"></iframe></p
~~~~

Install the module from the admin/module menu in server to create a menu item.

Done - Show locations of installations of radio and signage
Done - Display green, when all operating and providing heartbeats
Done - Display an indicator when there is an emergency event underway
Done - RED X if unit is not managed and disappeared more than n time

TODO - Combine analytics and stats to show audience and listener metric
TODO - Show installs by domains, reporting versions and poll using heartbeats

COMPONENTS
============
<a href="http://jquery.com">jQuery</a><br>
<a href="http://leafletjs.com">Leafletjs</a> javascript library.<br>
<a href="https://github.com/perliedman/leaflet-realtime">Leaflet-Realtime</a> plugin for adding map layers for live tracking of GPS, sensor data, etc.


