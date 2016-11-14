let mapboxgl = require('mapbox-gl');
window.mapboxgl = mapboxgl;
require('mapbox-gl-geocoder');
// let d3 = require("d3");

// import { bankPoints } from '../../../geometry/bankPoints.js';

mapboxgl.acessToken = 'pk.eyJ1IjoibmV3YW1lcmljYW1hcGJveCIsImEiOiJjaXVmdTUzbXcwMGdsMzNwMmRweXN5eG52In0.AXO-coBbL621lzrE14xtEA';
mapboxgl.config.ACCESS_TOKEN = 'pk.eyJ1IjoibmV3YW1lcmljYW1hcGJveCIsImEiOiJjaXVmdTUzbXcwMGdsMzNwMmRweXN5eG52In0.AXO-coBbL621lzrE14xtEA';
console.log(mapboxgl);
// var southWest = L.latLng(15, -165),
//     northEast = L.latLng(72, -65),
//     bounds = L.latLngBounds(southWest, northEast);


// var map = L.map('map', {
// 		zoom: 4,
// 		center: L.latLng(39.8282, -98.5795),
// 		maxBounds: bounds,
// 		minZoom: 3,
// 		maxZoom: 10,
// 	});



// let tiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
// 	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
// 	subdomains: 'abcd',
// }).addTo(map);

// d3.json("https://na-data-projects.s3.amazonaws.com/data/financial_opportunity/Bank2014.json", (d, error) => {

// 	console.log(d, error);
// 	L.geoJson(d).addTo(map);

// });

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/newamericamapbox/civcm5ziy00d92imrwswlo1wv',
    zoom: 3,
    center: [-98.5795, 39.8282]

});

// map.on('load', function() {
	
// 	console.log(map.getLayer('banks'));
// });

map.addControl(new mapboxgl.Geocoder({
	country:'us'
}));

map.addControl(new mapboxgl.NavigationControl());

var toggleableLayerIds = [ 'banks', 'altcredit', 'ncua', 'usps', 'censustracts_white_4','censustracts_white_5' ];

for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
}
