#!/bin/sh

# This script will attempt to download the latest RFS Major Incidents GeoRSS
# feed and convert it to a GeoJSON feed.

# This script is licensed CC0 by Andrew Harvey <andrew.harvey4@gmail.com>
#
# To the extent possible under law, the person who associated CC0
# with this work has waived all copyright and related or neighboring
# rights to this work.
# http://creativecommons.org/publicdomain/zero/1.0/

INCIDENT_FEED="http://ptwc.weather.gov/feeds/ptwc_rss_pacific.xml"
# INCIDENT_FEED="http://www.rfs.nsw.gov.au/feeds/majorIncidents.xml"

geojson="tsunami.json"

# check program usage
# if [ -z "$geojson" ] ; then
#  echo "Usage: $0 <alerts.json>"
#  exit 1
# fi

# make a temporary file to store the GeoRSS incident feed
FILE=`mktemp tmp.XXXXXXXXXX.xml`

# if mktemp fails for any reason then don't proceed
if [ $? -ne 0 ] ; then
  exit 2
fi

# try to download the latest incident feed
wget --quiet --output-document="$FILE" "$INCIDENT_FEED"

# If wget fails for any reason then don't proceed.
# Be aware that this will leave the old cached version in place!
# I think slightly out of date information is better than none at all.
if [ $? -ne 0 ] ; then
   rm -f "$FILE"
   exit 3
fi

# if the geoJSON file already exists remove it because The GeoJSON driver does
# not overwrite existing files.
if [ -e "$geojson" ] ; then
  rm -f "$geojson"
fi
# convert the GeoRSS to GeoJSON
./tsunami_georss.pl "$FILE" "$geojson" 2> /dev/null

# remove the temporary incident feed
rm -f "$FILE"

# success
exit 0
