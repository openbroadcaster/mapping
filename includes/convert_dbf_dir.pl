#!/bin/sh

# This script will attempt to download the latest INDCAN dbf
# feed and convert it to a GeoJSON feed.
# make a temporary file to store the DBF zip
FILE=`mktemp tmp.XXXXXXXXXX.zip`
DBF_SRC="http://spectrum.ic.gc.ca/engineering/engdoc/baserad.zip"

# if mktemp fails for any reason then don't proceed
if [ $? -ne 0 ] ; then
  exit 2
fi

wget --quiet --output-document="$FILE" "$DBF_SRC" 

# If wget fails for any reason then don't proceed.
# Be aware that this will leave the old cached version in place!
# I think slightly out of date information is better than none at all.
if [ $? -ne 0 ] ; then
   rm -f "$FILE"
   exit 3
fi

basepath=./data
basedir=data/baserad
#if [ -d "$basedir" ]; then
#    printf '%s\n' "Removing directory ($basedir)"
#    rm -rf "$basedir"
#fi

unzip $FILE -d $basedir
chmod 755 $basedir

for f in $basedir/fmstatio.dbf $basedir/tvstatio.dbf $basedir/amstatio.dbf $basedir/contacts.dbf 
do
	# convert the GeoRSS to GeoJSON
	printf '%s\n' "Converting $f to ${f%.dbf}.geojson"
	./dbf_to_geojson.pl "$f" "${f%.dbf}.geojson" 2> /dev/null
	if [ $? -ne 0 ]; then
		printf '%s\n' "Conversion failed for $basedir/${f%.dbf}.geojson"
		exit
	else
		chown webapp:webapp ${f%.dbf}.geojson 
	fi
done 
# remove the temporary incident feed
rm -f "$FILE"

# success
exit 0
