<?  
header('Expires: Sun, 01 Jan 2014 00:00:00 GMT');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', FALSE);
header('Pragma: no-cache');
header('Content-type: application/json');
require('../../../components.php');

$load = OBFLoad::get_instance();
$db = OBFDB::get_instance();
// make sure this module is installed
$devices_model = $load->model('devices');
$devices = $devices_model('get_all');
if(!isset($devices))die('No devices found.');

    foreach($devices as $index=>$device)
   {
      unset($devices[$index]['password']); // never need to share this.

    }
		$geojson = array( 'type' => 'FeatureCollection', 'features' => array());
        
        foreach($devices as $index=>$device)
          {
 		//$last_connect = $device['last_connect'] ? "".$device['last_connect']."" : '<i>never</i>';
 		$last_connect = $device['last_connect'] ? "".$device['last_connect']."" : '<i>never</i>';
        	$last_connect_schedule = "".$device['last_connect_schedule']."" ? "".($device['last_connect_schedule']."") : '<i>never</i>';
        	$last_connect_playlog = "".$device['last_connect_playlog']."" ? "".($device['last_connect_playlog']."") : '<i>never</i>';
        	$last_connect_media = "".$device['last_connect_media']."" ? "".($device['last_connect_media']."") : '<i>never</i>';
        	$last_connect_emergency =   "".$device['last_connect_emergency']."" ? "".($device['last_connect_emergency']."") : '<i>never</i>';
		$has_audio = $device['support_audio']*4;
		$has_video = $device['support_video']*2;
		$has_images = $device['support_images'];
		$value = $has_audio + $has_video + $has_images;

        	$version = "".$device['version']."" ? "".$device['version']."" : '<i>not available</i>';

           $marker = array( 
            'type' => 'Feature',
            'properties' => array(
                'dev_id' => $device['id'],
                'title' => $device['name'],
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
                   'coordinates' => array($device['longitude'], $device['latitude'])
                      ) 
                );   
          		array_push($geojson['features'],$marker);
 	}

echo  json_encode($geojson, JSON_NUMERIC_CHECK);           

?>

