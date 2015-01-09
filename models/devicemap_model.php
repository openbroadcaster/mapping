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

class DevicemapModel extends OBFModel
{
  
    public function save_new_location($data, $id=false)
  {
  if($id){
    $device_lat = $data['lat'];
    $device_lng = $data['lng'];

      $this->db->where('id',$id);
      $update = $this->db->update('devices',$data);
      if(!$update) return false;
    }
    return true;

  }
    public function validate($data,$id=false)
  {

    $error = false;

    if(empty($data['position'])) $error = 'A device position is required.';

    elseif($id && !$this->db->id_exists('devices',$id)) $error = 'The device you are attempted to edit does not exist.';
  
    if($error) return array(false,$error);

    return array(true,'');
  }
  }
