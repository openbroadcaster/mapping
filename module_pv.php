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
        public $description = 'Provide a map displaying location of EMS Alerts and status of OpenBroadcaster devices.';

        public function callbacks()
        {

        }
        public function install()
        {
        $this->db->query('CREATE TABLE IF NOT EXISTS `module_map_bases` (
          `baselayer` varchar(255) NOT NULL,
          PRIMARY KEY (`baselayer`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;');

        $this->db->query('CREATE TABLE `module_device_map` (
          `device_id` int(10) unsigned NOT NULL,
          `device_coords` point NOT NULL,
          `zoomlevel` tinyint(4) NOT NULL,
          `baselayer` varchar(255) NOT NULL,
          PRIMARY KEY (`device_id`),
          FOREIGN KEY fk_bases(`baselayer`) REFERENCES module_map_bases(baselayer)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;');

        //View permission
        $data = array();
        $data['name'] = 'view_map';
        $data['description'] = 'view map';
        $data['category'] = 'device';

        $this->db->insert('users_permissions',$data);

        //Edit permission
        $data = array();
        $data['name'] = 'edit_map';
        $data['description'] = 'edit map defaults';
        $data['category'] = 'device';

        $this->db->insert('users_permissions',$data);
                        return true;
        }

        public function uninstall()
        {

        $this->db->query('DROP TABLE  `module_device_map`');
        $this->db->query('DROP TABLE  `module_map_bases`');

        $this->db->where('name','view_map');
        $this->db->delete('users_permissions');
        $this->db->where('name','edit_map');
        $this->db->delete('users_permissions');
        return true;

        }
}