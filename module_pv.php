<?

/*     
    Copyright 2012 OpenBroadcaster, Inc.

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

class DeviceMapModule extends OBFModule
{

	public $name = 'Device Map';
	public $description = 'Provide a map displaying location and status of OpenBroadcaster devices.';

	public function callbacks()
	{

	}
	public function install()
	{
/*
		$this->db->query('CREATE TABLE IF NOT EXISTS `module_devicemap` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `device_id` int(10) unsigned NOT NULL,
  `coords` POINT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;');
*/
                $this->db->query('ALTER TABLE devices ADD COLUMN(`lng` decimal(8,5) NOT NULL DEFAULT -134.25921)');
                $this->db->query('ALTER TABLE devices ADD COLUMN(`lat` decimal(8,5) NOT NULL DEFAULT 60.29280)');
                $this->db->query('UPDATE devices SET lng=-134.2592146, lat=60.2928019');
		$data = array();
		$data['name'] = 'view_devicemap';
		$data['description'] = 'view map produced by device map module';
		$data['category'] = 'devices';
	
		$this->db->insert('users_permissions',$data);

                $data = array();
                $data['name'] = 'edit_devicemap';
                $data['description'] = 'edit map produced by device map module';
                $data['category'] = 'devices';

                $this->db->insert('users_permissions',$data);
		return true;

	}

	public function uninstall()
	{

/*		$this->db->query('DROP TABLE  `module_devicemap`');
*/
		$this->db->query('ALTER TABLE devices DROP COLUMN `lng`');
		$this->db->query('ALTER TABLE devices DROP COLUMN `lat`');
		$this->db->where('name','view_devicemap');
		$this->db->delete('users_permissions');
		$this->db->where('name','edit_devicemap');
		$this->db->delete('users_permissions');
		return true;

	}
}
