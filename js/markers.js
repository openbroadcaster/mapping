var filterCanada = function (feature, layer) {
                return feature.properties["PROVINCE"] == "AB"|| feature.properties["PROVINCE"] == "BC" ||
                feature.properties["PROVINCE"] == "YT" || feature.properties["PROVINCE"] == "SK" ||
                feature.properties["PROVINCE"] == "MB" || feature.properties["PROVINCE"] == "ON" ||
                feature.properties["PROVINCE"] == "QC" || feature.properties["PROVINCE"] == "NL" ||
                feature.properties["PROVINCE"] == "NB" || feature.properties["PROVINCE"] == "NS" ||
                feature.properties["PROVINCE"] == "PE" || feature.properties["PROVINCE"] == "NF" ||
                feature.properties["PROVINCE"] == "NU"
                }
var ObsIcon_sm = L.Icon.extend({
options: {
		shadowUrl:
			'../css/images/icon-shadow.png',
		iconSize:     [32,32],
		shadowSize:   [50,32],
		iconAnchor:   [16,32],
		shadowAnchor: [5,32],
		popupAnchor:  [-1, -35]
		}
});

var ObsIcon = L.Icon.extend({
	options: {
			shadowUrl:
				'./modules/device_map/css/images/icons/black/icon-shadow_off.png',
			iconSize:     [20,20],
			shadowSize:   [20,30],
			iconAnchor:   [5,10],
			shadowAnchor: [-3,18],
			popupAnchor:  [-1,-35]
			}
	});
	var inactiveIcon = new ObsIcon({
		iconUrl: 'modules/device_map/css/images/device_default.png',
		});
	var activeIcon = new ObsIcon({
		iconUrl: 'modules/device_map/css/images/device_tv.png',
		});
	var emergencyIcon = new ObsIcon_sm({
		iconUrl: 'modules/device_map/css/images/device_tv_emergency.png',
		});
		
var naadStyle = {
            color: "#2262CC",
            weight: 0.1,
            opacity: 0.1,
            fillOpacity: 0.1,
            fillColor: "#CC2247"
        };

var AM_MarkerOptions = {
    radius: 2,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
var FM_MarkerOptions = {
    radius: 3,
    fillColor: "#00ff00",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
var TV_MarkerOptions = {
    radius: 5,
    fillColor: "#0000ff",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
var SAT_MarkerOptions = {
    radius: 4,
    fillColor: "#ff0000",
    color: "#f00",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
