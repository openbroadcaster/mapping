ObMap
=====
Show NAAD and NOAA weather watch alerts on a map

INSTALL
=====
Clone git repo for module: 
 "git clone -b Prod https://github.com/openbroadcaster/ObMap.git device_map"

Change ownership of all files to openbroadcaster:
 "chown openbroadcaster:openbroadcaster device_map/ -R"

Install required PERL modules (as root):
perl -MCPAN -e shell 'install XML::Simple XML::Twig JSON'

Change to includes drectory:
 "cd device_map/includes/"
	
Run shell script:
 './convert_emerg_feed.sh' to seed alerts file.

Edit main js/layout.js at line 188:
     following 'layout.set_main_size();'
	"ModuleDevicemap.init_map();"

Add a CRON job to run conversion script. For example, to run every 15 minutes:
 */15 * * * * cd /var/www/html/OpenBC/modules/device_map/includes && ./convert_emerg_feed.pl

Install the module from the admin/module menu.


