<?php
header('Expires: Sun, 01 Jan 2014 00:00:00 GMT');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', FALSE);
header('Pragma: no-cache');
header('Content-type: application/json');
require('../../../components.php');

$load = OBFLoad::get_instance();
$db = OBFDB::get_instance();
// make sure this module is installed
$players_model = $load->model('players');
$players = $players_model('get_all');
if(!isset($players))die('No players found.');

    foreach($players as $index=>$player)
   {
      unset($players[$index]['password']); // never need to share this.

    }
		$geojson = array( 'type' => 'FeatureCollection', 'features' => array());
        
        foreach($players as $index=>$player)
          {
 		//$last_connect = $player['last_connect'] ? "".$player['last_connect']."" : '<i>never</i>';
 		$last_connect = $player['last_connect'] ? "".$player['last_connect']."" : '<i>never</i>';
        	$last_connect_schedule = "".$player['last_connect_schedule']."" ? "".($player['last_connect_schedule']."") : '<i>never</i>';
        	$last_connect_playlog = "".$player['last_connect_playlog']."" ? "".($player['last_connect_playlog']."") : '<i>never</i>';
        	$last_connect_media = "".$player['last_connect_media']."" ? "".($player['last_connect_media']."") : '<i>never</i>';
        	$last_connect_emergency =   "".$player['last_connect_emergency']."" ? "".($player['last_connect_emergency']."") : '<i>never</i>';
		$has_audio = $player['support_audio']*4;
		$has_video = $player['support_video']*2;
		$has_images = $player['support_images'];
		$value = $has_audio + $has_video + $has_images;

        	$version = "".$player['version']."" ? "".$player['version']."" : '<i>not available</i>';

           $marker = array( 
            'type' => 'Feature',
            'properties' => array(
                'dev_id' => $player['id'],
                'title' => $player['name'],
		'last_connect' => $last_connect,
		'last_connect_schedule' => $last_connect_schedule,
		'last_connect_playlog' => $last_connect_playlog,
		'last_connect_media' => $last_connect_media,
		'last_connect_emergency' => $last_connect_emergency,
		'icon_value' => $value,
		'version'=>  $version
                     ),
                'geometry' => array(
                    'type' => 'Point',
                   'coordinates' => array($player['longitude'], $player['latitude'])
                      ) 
                );   
          		array_push($geojson['features'],$marker);
 	}

echo  json_encode($geojson, JSON_NUMERIC_CHECK);           

?>

