<?php
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

class PlayerMapModule extends OBFModule
{

        public $name = 'Player Map';
        public $description = 'Provide a map displaying location of EMS Alerts and status of OpenBroadcaster players.';

        public function callbacks()
        {

        }
        public function install()
        {
                $this->db->query('ALTER TABLE players ADD COLUMN(`longitude` decimal(8,5) NOT NULL DEFAULT -134.25921)');
                $this->db->query('ALTER TABLE players ADD COLUMN(`latitude` decimal(8,5) NOT NULL DEFAULT 60.29280)');
                $this->db->query('UPDATE players SET longitude=-134.2592146, lattude=60.2928019');
/*
        $this->db->query('CREATE TABLE IF NOT EXISTS `module_map_bases` (
          `baselayer` varchar(255) NOT NULL,
          PRIMARY KEY (`baselayer`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;');

        $this->db->query('CREATE TABLE `module_player_map` (
		  `player_id` int(10) unsigned NOT NULL,
		  `zoomlevel` tinyint(4) NOT NULL DEFAULT "3",
          `baselayer` varchar(255) NOT NULL,
		  `latitude` float NOT NULL DEFAULT "60.246",
		  `longitude` float NOT NULL DEFAULT "-134.531",
		  PRIMARY KEY (`player_id`),
		  KEY `module_player_map_ibfk_1` (`baselayer`),
  		CONSTRAINT `module_player_map_ibfk_1` FOREIGN KEY (`baselayer`) REFERENCES `module_map_bases` (`baselayer`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8;');

	$this->db->query('INSERT INTO obs.module_map_bases (baselayer) VALUES ("OSMBase")');
	$this->db->query('INSERT INTO obs.module_player_map (player_id,baselayer) SELECT players.id,"OSMBase" from players;');

*/
        //View permission
        $data = array();
        $data['name'] = 'view_map';
        $data['description'] = 'view map';
        $data['category'] = 'player';

        $this->db->insert('users_permissions',$data);

        //Edit permission
        $data = array();
        $data['name'] = 'edit_map';
        $data['description'] = 'edit map defaults';
        $data['category'] = 'player';

        $this->db->insert('users_permissions',$data);
                        return true;

 
       }

        public function uninstall()
        {

//	$this->db->query('ALTER TABLE players DROP COLUMN `longitude`');
//	$this->db->query('ALTER TABLE players DROP COLUMN `latitude`');

//        $this->db->query('DROP TABLE  `module_player_map`');
//        $this->db->query('DROP TABLE  `module_map_bases`');

        $this->db->where('name','view_map');
        $this->db->delete('users_permissions');
        $this->db->where('name','edit_map');
        $this->db->delete('users_permissions');
        return true;

 
       }
}
