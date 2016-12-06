require('../../../scss/index.scss');

let mapboxgl = require('mapbox-gl');
window.mapboxgl = mapboxgl;
require('mapbox-gl-geocoder');

import { getColorScale } from "../../helper_functions/get_color_scale.js";
import { colors } from "../../helper_functions/colors.js";
import { formatValue } from "../../helper_functions/format_value.js";

import $ from 'jquery';
// let d3 = require("d3");

// import { bankPoints } from '../../../geometry/bankPoints.js';

mapboxgl.acessToken = 'pk.eyJ1IjoibmV3YW1lcmljYW1hcGJveCIsImEiOiJjaXVmdTUzbXcwMGdsMzNwMmRweXN5eG52In0.AXO-coBbL621lzrE14xtEA';
mapboxgl.config.ACCESS_TOKEN = 'pk.eyJ1IjoibmV3YW1lcmljYW1hcGJveCIsImEiOiJjaXVmdTUzbXcwMGdsMzNwMmRweXN5eG52In0.AXO-coBbL621lzrE14xtEA';

let variables = {
    medhhinc: {"variable":"MEDHHINC", "displayName":"Median Household Income", "format": "price",  "scaleType": "quantize", "customDomain":[0, 250000], "customRange":[colors.grey.light, colors.black], "numBins":5},
    minority: {"variable":"MINORITY", "displayName":"% Minority", "format": "number", "scaleType": "quantize", "customDomain":[0, 100], "customRange":[colors.grey.light, colors.black], "numBins":5},
    fampov: {"variable":"FAMPOV", "displayName":"% Families Below Poverty Line", "format": "number", "scaleType": "quantize", "customDomain":[0, 100], "customRange":[colors.grey.light, colors.black], "numBins":5},
    medval: {"variable":"MEDVAL", "displayName":"Medium Value of Houshold Units", "format": "price", "scaleType": "quantize", "customDomain":[0, 1000000], "customRange":[colors.grey.light, colors.black], "numBins":5},
};

let insetMapSettings = [
    {
        title: "Atlanta",
        center: [-84.3880, 33.7490],
        zoom: 8
    },
    {
        title: "Chicago",
        center: [-87.6298, 41.8781],
        zoom: 8
    },
    {
        title: "Denver",
        center: [-104.9903, 39.7392],
        zoom: 8
    },
    {
        title: "Houston",
        center: [-95.3698, 29.7604],
        zoom: 8
    },
    {
        title: "New York",
        center: [-74.0059, 40.7128],
        zoom: 8
    },
    {
        title: "San Francisco",
        center: [-122.4194, 37.7749],
        zoom: 8
    },
    {
        title: "Washington D.C.",
        center: [-77.0369, 38.9072],
        zoom: 8
    },
]

let colorScales = {};
setColorScales();

let insetMaps = [];

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/newamericamapbox/civcm5ziy00d92imrwswlo1wv',
    zoom: 4,
    center: [-98.5795, 39.8282],
    minZoom: 4,
    maxZoom: 15
});

var popupOffsets = {
 'left': [50, -100],
 };

var popup = new mapboxgl.Popup({
        anchor: 'left',
        offset: popupOffsets,
        closeButton: false,
        closeOnClick: false
    });
    

createInsetMaps();

addControls();

map.on('load', function() {
    map.addSource('census-tracts',{
        'type': 'vector',
        'url': 'mapbox://newamericamapbox.7zun44wf'
    });

    addLayers();

    addTooltip();

    addFilters();
    
});

function createInsetMaps() {
    let i = 1;
    for (let settingsObject of insetMapSettings) {
        var insetMap = new mapboxgl.Map({
            container: 'inset-map-' + i,
            style: 'mapbox://styles/newamericamapbox/civcm5ziy00d92imrwswlo1wv',
            zoom: settingsObject.zoom,
            center: settingsObject.center,
        });
        insetMaps.push(insetMap);
        i++;
    }
}

function setColorScales() {
    for (let variable in variables) {
        colorScales[variable] = getColorScale(null, variables[variable]);
    }
}

function addControls() {
    map.addControl(new mapboxgl.Geocoder({
    country:'us'
    }));

    map.addControl(new mapboxgl.NavigationControl());
}

function addLayers() {
    let i = 0;
    for (let variable in variables) {
        let dataMin = variables[variable].customDomain[0],
            dataMax = variables[variable].customDomain[1];
        let dataSpread = dataMax - dataMin;
        let binInterval = dataSpread/5;

        let colorStops = [];

        for (let i = 0; i < 5; i++) {
            colorStops.push([dataMin + i*binInterval, colorScales[variable].range()[i]]);
        }

        console.log(variable);
        map.addLayer(
            {
                'id': variable,
                'source': 'census-tracts',
                'source-layer':'CensusTracts_2014data2K_2-3r3ays',
                'type': 'fill',
                // 'filter': ['>', , 0],
                'paint': {
                    'fill-color': {
                        property: variables[variable].variable,
                        stops: colorStops
                    },
                    'fill-opacity': .7
                }
            },'water'
        );

        i != 0 ? map.setLayoutProperty(variable, 'visibility', 'none') : null;
        i++;
    }
}

function addTooltip() {
    map.on('mousemove', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: Object.keys(variables) });
        console.log(e.lngLat);
        console.log(features[0]);
        if (!features.length) {
            popup.remove();
            return;
        }

        let feature = features[0];
        // console.log(feature.properties);
        // Populate the popup and set its coordinates
        // based on the feature found.
        // let tract = feature.properties.Geography.match(/Census Tract ([0-9]|\.)+, /),
        
        let splitPieces = feature.properties.Geography.split(", ");

        let popupProperties = "";

        for (let variable in variables) {
            let varName = variables[variable].variable;
            popupProperties += "<li class='popup__property'>" +
                        "<h5 class='popup__property__label'>" + variables[variable].displayName + "</h5>" +
                        "<h5 class='popup__property__value'>" + formatValue(feature.properties[varName], variables[variable].format)  + "</h5>" +
                    "</li>";
        }

        popup
            .setLngLat(e.lngLat)
            .setHTML(
                "<h5 class='popup__state'>" + splitPieces[2] + "</h5>" +
                "<h3 class='popup__county'>" + splitPieces[1] + "</h3>" +
                "<h5 class='popup__tract'>" + splitPieces[0] + "</h5>" +
                "<ul class='popup__properties'>" + popupProperties + "</ul>"
            )
            .addTo(map);
    });
}

function addFilters() {
    let pointLayerIds = [ 'banks', 'altcredit', 'ncua', 'usps'],
        polygonLayerIds = Object.keys(variables);

    addFilter("#point-layer-menu", pointLayerIds, true, true);
    addFilter("#polygon-layer-menu", polygonLayerIds, false, false);
}

function addFilter(menuDomId, ids, toggleInsets, canToggleMultiple) {
    let $menu = $(menuDomId);
    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];

        var link = document.createElement('a');
        link.href = '#';
        link.className = !canToggleMultiple && i != 0 ? '' : 'active';
        link.textContent = id;

        link.onclick = function (e) {
            if (!canToggleMultiple) {
                $menu.children(".active").removeClass("active");
                for (let layer of ids) {
                    map.setLayoutProperty(layer, 'visibility', 'none');
                    toggleInsets ? toggleInsetMaps(layer, 'none') : null;
                }
            }
            var clickedLayer = this.textContent;
            e.preventDefault();
            e.stopPropagation();

            var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

            if (visibility === 'visible') {
                map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                toggleInsets ? toggleInsetMaps(clickedLayer, 'none') : null;
                this.className = '';
            } else {
                this.className = 'active';
                toggleInsets ? toggleInsetMaps(clickedLayer, 'visible') : null;
                map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
            }
        };
        $menu.append(link);
    }
}

function toggleInsetMaps(clickedLayer, visibilityVal) {
    for (let insetMap of insetMaps) {
        insetMap.setLayoutProperty(clickedLayer, 'visibility', visibilityVal);
    }
}
