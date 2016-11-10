var mapboxgl = require('mapbox-gl');
let d3 = require("d3");

// import { bankPoints } from '../../../geometry/bankPoints.js';

mapboxgl.mapboxAccessToken = "pk.eyJ1IjoibmV3YW1lcmljYW1hcGJveCIsImEiOiJjaXVmdTUzbXcwMGdsMzNwMmRweXN5eG52In0.AXO-coBbL621lzrE14xtEA";

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
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-79.4512, 43.6568],
    zoom: 13
});

map.addControl(new mapboxgl.Geocoder());

// newamericamapbox.0qvq0l4l