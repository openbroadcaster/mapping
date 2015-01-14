<?

/*     
    Copyright 2012-2013 OpenBroadcaster, Inc.

    This file is part of OpenBroadcaster Server.

    OpenBroadcaster Server is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    OpenBroadcaster Server is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with OpenBroadcaster Server.  If not, see <http://www.gnu.org/licenses/>.
*/

class Devicemap extends OBFController
{

  public function __construct()
  {
    parent::__construct();
    $this->DevicemapModel = $this->load->model('devicemap');
    $this->user->require_permission('view_map');
  }

  public function device_location_list()
  {

    $this->user->require_authenticated();
  
    $params['filters'] = $this->data('filters');
    $params['orderby'] = $this->data('orderby');
    $params['orderdesc'] = $this->data('orderdesc');
    $params['limit'] = $this->data('limit');
    $params['offset'] = $this->data('offset');

    if($params['orderby'] == false) $params['orderby'] = 'name';

    $devicelocs = $this->DevicemapModel('get',$params);

    if($devicelocs===false) return array(false,'An unknown error occurred while fetching device locations.');


    return array(true,'Device locations.',$devicelocs);

  }

  public function saveLocation()
  {

    $this->user->require_permission('edit_map');

    $id = trim($this->data('id'));
    $data['zoomLevel'] = $this->data('zoom');
    $data['baselayer'] = $this->data('base');
    $data['longitude'] = $this->data('lng');
    $data['latitude'] = $this->data('lat');

    $this->DevicemapModel('save',$data,$id);

    return array(true,'Device location saved.',$id);

  }

  public function get()
  {

    $this->user->require_permission('view_map');
    $id = $this->data('_device_id');
    $devicemap = $this->DevicemapModel('get_one');

    if($devicemap)
    {

      return array(true,'devicemap',$devicemap;
    }

    else return array(false,'Device location not found.');

  }
  
  public function getGeoJSON()
  {
    $this->user->require_permission('view_map');
  
    $devicelocs = $this->DevicemapModel('get',$params);

    if($devicelocs===false) return array(false,'An unknown error occurred while fetching device locations.');


    $geojson = array( 'type' => 'FeatureCollection', 'features' => array());

        foreach($devicelocs as $index=>$location)
          {
                //$last_connect = $location->device['last_connect'] ? "".$location->device['last_connect']."" : '<i>never</i>';
                $last_connect = $location->device['last_connect'] ? "".device['last_connect']."" : '<i>never</i>';
                $last_connect_schedule = "".$location->device['last_connect_schedule']."" ? "".($location->device['last_connect_schedule']."") : '<i>never</i>';
                $last_connect_playlog = "".$location->device['last_connect_playlog']."" ? "".($location->device['last_connect_playlog']."") : '<i>never</i>';
                $last_connect_media = "".$location->device['last_connect_media']."" ? "".($location->device['last_connect_media']."") : '<i>never</i>';
                $last_connect_emergency =   "".$location->device['last_connect_emergency']."" ? "".($location->device['last_connect_emergency']."") : '<i>never</i>';
                $has_audio = $location->device['support_audio']*4;
                $has_video = $location->device['support_video']*2;
                $has_images = $location->device['support_images'];
                $value = $has_audio + $has_video + $has_images;

                $version = "".$location->device['version']."" ? "".$location->device['version']."" : '<i>not available</i>';

           $marker = array(
            'type' => 'Feature',
            'properties' => array(
                'dev_id' => $location['device_id'],
                'title' => $location->device['name'],
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
                   'coordinates' => array($location['longitude'], $location['latitude'])
                      )
                );
                        array_push($geojson['features'],$marker);
        }

			return json_encode($geojson, JSON_NUMERIC_CHECK);
  }

}

