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
  
  public function get_one($id)
  {

    $this->db->where('device_id',$id);
    $devicemap = $this->db->get_one('module_device_map');
   
    if($devicemap) {
      $devicemap['device']=$this('get_device',$id);  
    }

    return $devicemap;

  }

  public function get_all()
  {
    return $this->db->get('module_device_map');
  }

  public function get($params)
  {

    foreach($params as $name=>$value) $$name=$value;

    if($filters) foreach($filters as $filter)
    {
      $column = $filter['column'];
      $value = $filter['value'];
      $operator = (empty($filter['operator']) ? '=' : $filter['operator']);

      $this->db->where($column,$value,$operator);
    }

    if($orderby) $this->db->orderby($orderby,(!empty($orderdesc) ? 'desc' : 'asc'));

    if($limit) $this->db->limit($limit);

    if($offset) $this->db->offset($offset);

    $result = $this->db->get('module_device_map');

    if($result === false) return false;
  
    return $result;

  }

  // get a device.
  public function get_device($id)
  {

    $this->db->where('id',$id);
    $device = $this->db->get('devices');

    return $device;

  }

public function save($data,$id=false)
  {
    if($id)
	{

      $this->db->where('device_id',$id);
      $update = $this->db->update('module_device_map',$data);

      if(!$update) return false;
	}
	else
	{ return false;
	}
	return true;
  }
  
}
