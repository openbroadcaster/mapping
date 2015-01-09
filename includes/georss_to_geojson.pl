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

# use warnings;
use strict;

# library to parse source RSS file
use XML::Simple;
use XML::Twig;

# library to generate destination JSON file
use JSON;

# check program usage
if (@ARGV < 2) {
    print STDERR "Usage: $0 <majorIncidents.xml> <majorIncidents.geojson>\n";
    exit 1;
}

# take the first argument as the source georss file
my $georss_file = $ARGV[0];
#
# take the second argument as the destination geojson file
my $geojson_file = $ARGV[1];

my $twig = new XML::Twig( twig_handlers => {
                feed => \&feed
        },
);      
$twig->parsefile($georss_file);
$twig->set_pretty_print('indented');
$twig->print_to_file('alerts.xml');

sub feed {
        my ( $twig, $feed) = @_;
}


# ensure we can read the source georss file
if ( ! -r $georss_file ) {
    print STDERR "'$georss_file' can't be read.\n";
    exit 1;
}

# parse the RSS file using an XML parser
my $xml = XML::Simple->new();
my $doc = $xml->XMLin($ARGV[0], KeyAttr=>[]);
# during development it was handy to Dump the whole $doc structure
#use Data::Dumper;
#print Dumper ($doc);
#exit;

# helper function to take a GeoRSS Point and Polygon coordinate pair string list
# and generate GeoJSON geometries
sub generateGeometries($$) {
    my ($point, $polygon) = @_;

    # GeoJSON geometry object
    my @geometries = ();

    my @points;
    if (ref($point) eq "ARRAY") { # many points
        push @points, @{$point};
    } else {
        push @points, $point;
    }

    # for each point geometry
    foreach my $p (@points) {
        my $g = georss_to_geojson_point($p);

        if (defined $g) {
            push @geometries, $g;
        }
    }

    my @polygons;
    if (ref($polygon) eq "ARRAY") { # many polygons
        push @polygons, @{$polygon};
    } else {
        push @polygons, $polygon;
    }

    foreach my $p (@polygons) {
        my $g = georss_to_geojson_polygon($p);

        if (defined $g) {
            push @geometries, $g;
        }
    }

    return \@geometries;
}

# helper function to take a GeoRSS Polygon <georss:polygon> string value and
# create a GeoJSON geometry object
sub georss_to_geojson_polygon($) {
    my ($s) = @_;

    my @georss_coords = split(/ /, $s);

    # check coords list is even otherwise we don't have a complete list of
    # coordinate pairs
    if ((scalar @georss_coords % 2) != 0) {
        print STDERR "WARNING: Coordinate pair list is odd, so we don't have a complete paired list.\n";
        return undef;
    }
    
    my @coords;
    for (my $i = 0; $i < scalar @georss_coords; $i += 2) {
        my ($lat, $lon) = ($georss_coords[$i], $georss_coords[$i+1]);

        $lat = $lat + 0; # force as number for JSON writer
        $lon = $lon + 0;

        push @coords, [ $lon, $lat ]
    }

    if (scalar @coords < 4) {
        print STDERR "WARNING: Expecting to produce a LinearRing but only " . scalar @coords . " coordinate pairs found.\n";
        return undef;
    }
    # FIXME add check for 1st point == last point

    my $g = { 
        'type' => 'Polygon',
        'coordinates' => [ \@coords ] # just paste in coordinates as exterior rings each time
    };

    return $g;
}

# helper function to take a GeoRSS Point <georss:point> string value and
# create a GeoJSON geometry object
sub georss_to_geojson_point($) {
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

foreach my $item (@{$doc->{'entry'}}) {
    # each geojson feature shall have properties and an optional geometry
    # here we pull the properties from the rss item elements
    my %properties = ();
    foreach my $element (qw/id title link summary category/) {
        if (defined $item->{$element}) {
           $properties{$element} = $item->{$element};
	   }
       }
        if (defined $item->{'category'} && defined $item->{'category'}[8]) {
		my $type = (split /=/,$item->{'category'}[8]{term})[1];
		$type = '../css/images/ems/'.$type.'.png';
		$type =~ s/\s//g;
        	$properties{'iconURL'} = $type;
    }   
    # here we pull and construct the geometry
    my $geometry = {};
    # if GeoRSS elements are present for this feature
    if (defined $item->{'georss:point'} || defined $item->{'georss:polygon'}) {
        # FIXME could simplify this...
        my $number_of_points = 0;
        my $number_of_polygons = 0;

        if (defined $item->{'georss:point'}) {
            if (ref($item->{'georss:point'}) eq "ARRAY") {
                $number_of_points += scalar @{$item->{'georss:point'}};
            } else {
                $number_of_points += 1;
            }
        }
        if (defined $item->{'georss:polygon'}) {
            if (ref($item->{'georss:polygon'}) eq "ARRAY") {
                $number_of_polygons += scalar @{$item->{'georss:polygon'}};
            } else {
                $number_of_polygons += 1;
            }
        }
        my $number_of_geometries = $number_of_points + $number_of_polygons;
        if ($number_of_geometries == 1) {
            if ($number_of_points == 1) {
               $geometry = georss_to_geojson_point($item->{'georss:point'});
            } elsif ($number_of_polygons == 1) {
                $geometry = georss_to_geojson_polygon($item->{'georss:polygon'});
            } else {
                # programming error
                $geometry = undef;
            }
        } else {
            $geometry = { 
                'type' => 'GeometryCollection',
                'geometries' => generateGeometries($item->{'georss:point'}, $item->{'georss:polygon'})
            };
        }
    } else {
        $geometry = undef;
    }

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

