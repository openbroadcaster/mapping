#!/usr/bin/perl -w

# This is a custom GeoRSS to GeoJSON converter specifically written for the NSW
# RFS Major Incident Feed at http://www.rfs.nsw.gov.au/feeds/majorIncidents.xml

# Originally I used ogr2ogr to convert the GeoRSS to GeoJSON however because the
# RFS feed at worst case doesn't adhere to the GeoRSS specification and at best
# case makes an interesting use of the specification, the OGR driver simply
# doesn't handle the RFS GeoRSS file as I need it too.
#
# Specifically the RFS Major Incidents GeoRSS file contains several
# <georss:point> or <georss:polygon> elements per RSS item. We want these
# represented in the GeoJSON file as GeometryCollections retaining all the
# <georss:point> and <georss:polygon> elements.
#
# Since there is no way to get in touch with the right people at RFS to discuss
# this issue, and even if I did get in touch I doubt they would just roll out a
# better solution quickly I have hacked together this conversion script.
#
# The good thing is that with my testing so far it seems to work very well as
# required. The bad thing is I haven't made it as robust and error proof as
# possible.
#
# I did try at least 3 RSS reader modules in Perl, but two crashed when trying
# to read the GeoRSS and one had a problem with reading multiple
# <georss:polygon> elements (it actually concatenated all the values, so
# coordinate pair lists together which is really wrong), but a plain old
# XML::Simple parser works great, especially since it is hard coded for the RFS
# GeoRSS feed.

# This script is released under the Creative Commons Zero CC0 license
#
# To the extent possible under law, the person who associated CC0
# with this work has waived all copyright and related or neighboring
# rights to this work.
# http://creativecommons.org/publicdomain/zero/1.0/

use warnings;
use strict;

# library to parse source dbf file
use XBase;

# library to generate destination JSON file
use JSON;

# check program usage
if (@ARGV < 2) {
    print STDERR "Usage: $0 <my.dbf> <output.geojson>\n";
    exit 1;
}

# take the first argument as the source georss file
my $geodbf_file = $ARGV[0];
#
# take the second argument as the destination geojson file
my $geojson_file = $ARGV[1];


# ensure we can read the source georss file
if ( ! -r $geodbf_file ) {
    print STDERR "'$geodbf_file' can't be read.\n";
    exit 1;
}

# parse the dbf file using an XBase parser
       my $table = new XBase $geodbf_file or die XBase->errstr;
       my $data = {
               header => [ $table->field_names ],
               types  => [ $table->field_types ],
               lengths=> [ $table->field_lengths ],
               decimals=> [ $table->field_decimals ],
               items => [],
       };


       for (0 .. $table->last_record) {
               my $item = $table->get_record_as_hash($_);
               push @{ $data->{items} }, $item;
       }



# if ($geodbf_file == "Comments.dbf") {
# during development it was handy to Dump the whole $doc structure
# use Data::Dumper;
# print Dumper ($data);
# exit;
# }

# helper function to take a dbf lat and long string values and
# create a GeoJSON geometry object
sub dbf_to_geojson_point($) {
    my ($s) = @_;
    my ($lat, $lon) = split(/ /, $s);
    if (!defined $lat || !defined $lon) {
        print STDERR "WARNING: Point element but less than 2 coordinates in the list.\n";
        return undef;
    }
    $lat = $lat + 0; # force as number for JSON writer
    $lon = $lon + 0;

    my $g = { 
        'type' => 'Point',
        'coordinates' => [ $lon, $lat ]
    };
    return $g;
}


# store for target json features (from rss items)
my @features = ();
# for each RSS item (i.e. each major incident)...

foreach my $item (@{$data->{'items'}}) {
    # each geojson feature shall have properties and an optional geometry
    # here we pull the properties from the rss item elements
    my %properties = ();
    foreach my $element (qw/PROVINCE CITY CALL_SIGN FREQUENCY LATITUDE LONGITUDE TYPE CALLS_BANR NAME ADDR1 ADDR2 ADDR3 ADDR4/) {
        if (defined $item->{$element}) {
           $properties{$element} = $item->{$element};
	   } 
       }
        
    # here we pull and construct the geometry
    my $geometry = {};
    # if latlng elements are present for this feature
    if (defined $item->{'LONGITUDE'} || defined $item->{'LATITUDE'}) {
        # FIXME could simplify this...
        my $number_of_points = 0;
keys %{$item};
my $lat = ${$item}{'LATITUDE'}/10000;
my $lng =  -1*(${$item}{'LONGITUDE'})/10000;

my $point = ($lat." ".$lng);
# use Data::Dumper;
# print Dumper($point);
# exit;
	if (defined $point || (ref($point) eq "ARRAY")) {
               $geometry = dbf_to_geojson_point($point);
            } else {
                # programming error
                $geometry = undef;
            };
	};
    my %feature = (
        'type' => 'Feature',
        'properties' => \%properties
    	);
    # if the feature had georss geometries then also add a geometry to the
    # geojson

    if (defined $geometry) {
        $feature{'geometry'} = \%{$geometry};
    }

    push @features, \%feature;
}
my $geojson = { 'type' => "FeatureCollection" };
$geojson->{'features'} = \@features;

open (my $geojson_fh, ">", $geojson_file) or die "Can't open '$geojson_file' for writting.\n";
print $geojson_fh encode_json($geojson) . "\n";


