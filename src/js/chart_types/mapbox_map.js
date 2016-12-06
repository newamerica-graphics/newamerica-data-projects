let mapboxgl = require('mapbox-gl');
window.mapboxgl = mapboxgl;
require('mapbox-gl-geocoder');

import { colors } from "../helper_functions/colors.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";
import { formatValue } from "../helper_functions/format_value.js";

import $ from 'jquery';

let d3 = require("d3");

mapboxgl.acessToken = 'pk.eyJ1IjoibmV3YW1lcmljYW1hcGJveCIsImEiOiJjaXVmdTUzbXcwMGdsMzNwMmRweXN5eG52In0.AXO-coBbL621lzrE14xtEA';
mapboxgl.config.ACCESS_TOKEN = 'pk.eyJ1IjoibmV3YW1lcmljYW1hcGJveCIsImEiOiJjaXVmdTUzbXcwMGdsMzNwMmRweXN5eG52In0.AXO-coBbL621lzrE14xtEA';

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

export class MapboxMap {
    constructor(vizSettings, imageFolderId) {
        let {id, mapboxStyleUrl, layerVars} = vizSettings;
        this.id = id;
        this.layerVars = layerVars;

        d3.select(id).append("div")
            .attr("id", "map-container")
            .style("width", "100%")
            .style("height", "700px");

        this.map = new mapboxgl.Map({
            container: 'map-container',
            style: mapboxStyleUrl,
            zoom: 4,
            center: [-98.5795, 39.8282],
            minZoom: 4,
            maxZoom: 15
        });

        this.createInsetMaps();

        this.setColorScales();

        let popupOffsets = {
            'left': [50, -100],
        };

        this.popup = new mapboxgl.Popup({
            anchor: 'left',
            offset: popupOffsets,
            closeButton: false,
            closeOnClick: false
        });
    }

    render() {
        this.addControls();
        this.map.on('load', () => {
            this.map.addSource('census-tracts',{
                'type': 'vector',
                'url': 'mapbox://newamericamapbox.7zun44wf'
            });
            this.addLayers();

            this.addTooltip();

            this.addFilters();
        });

       
    }

    addControls() {
        this.map.addControl(new mapboxgl.Geocoder({
            country:'us'
        }));

        this.map.addControl(new mapboxgl.NavigationControl());
    }

    addLayers() {
        let i = 0;
        for (let variable in this.layerVars) {
            let dataMin = this.layerVars[variable].customDomain[0],
                dataMax = this.layerVars[variable].customDomain[1];
            let dataSpread = dataMax - dataMin;
            let binInterval = dataSpread/5;

            let colorStops = [];

            for (let i = 0; i < 5; i++) {
                colorStops.push([dataMin + i*binInterval, this.colorScales[variable].range()[i]]);
            }
            this.map.addLayer(
                {
                    'id': variable,
                    'source': 'census-tracts',
                    'source-layer':'CensusTracts_2014data2K_2-3r3ays',
                    'type': 'fill',
                    // 'filter': ['>', , 0],
                    'paint': {
                        'fill-color': {
                            property: this.layerVars[variable].variable,
                            stops: colorStops
                        },
                        'fill-opacity': .7
                    }
                },'water'
            );

            i != 0 ? this.map.setLayoutProperty(variable, 'visibility', 'none') : null;
            i++;
        }
    }

    addTooltip() {
        this.map.on('mousemove', (e) => {
            var features = this.map.queryRenderedFeatures(e.point, { layers: Object.keys(this.layerVars) });
            console.log(e.lngLat);
            console.log(features[0]);
            if (!features.length) {
                this.popup.remove();
                return;
            }

            let feature = features[0];
            
            let splitPieces = feature.properties.Geography.split(", ");

            let popupProperties = "";

            for (let variable in this.layerVars) {
                let varName = this.layerVars[variable].variable;
                popupProperties += "<li class='popup__property'>" +
                            "<h5 class='popup__property__label'>" + this.layerVars[variable].displayName + "</h5>" +
                            "<h5 class='popup__property__value'>" + formatValue(feature.properties[varName], this.layerVars[variable].format)  + "</h5>" +
                        "</li>";
            }

            this.popup
                .setLngLat(e.lngLat)
                .setHTML(
                    "<h5 class='popup__state'>" + splitPieces[2] + "</h5>" +
                    "<h3 class='popup__county'>" + splitPieces[1] + "</h3>" +
                    "<h5 class='popup__tract'>" + splitPieces[0] + "</h5>" +
                    "<ul class='popup__properties'>" + popupProperties + "</ul>"
                )
                .addTo(this.map);
        });
    }

    addFilters() {
        let pointLayerIds = [ 'banks', 'altcredit', 'ncua', 'usps'],
            polygonLayerIds = Object.keys(this.layerVars);

        this.addFilter("#point-layer-menu", pointLayerIds, true, true);
        this.addFilter("#polygon-layer-menu", polygonLayerIds, false, false);
    }

    addFilter(menuDomId, ids, toggleInsets, canToggleMultiple) {
        let $menu = $(menuDomId);
        let map = this.map;
        let toggleInsetFunction = this.toggleInsetMaps.bind(this);
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
                    toggleInsets ? toggleInsetFunction(clickedLayer, 'none') : null;
                    this.className = '';
                } else {
                    this.className = 'active';
                    toggleInsets ? toggleInsetFunction(clickedLayer, 'visible') : null;
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                }
            };
            $menu.append(link);
        }
    }

    createInsetMaps() {
        this.insetMaps = [];
        let i = 1;
        let insetContainer = d3.select(this.id).append("div")
            .attr("class", "mapbox-map__inset-container");

        for (let settingsObject of insetMapSettings) {
            insetContainer.append("div")
                .attr('class', 'mapbox-map__inset')
                .attr("id", 'inset-map-' + i);

            var insetMap = new mapboxgl.Map({
                container: 'inset-map-' + i,
                style: 'mapbox://styles/newamericamapbox/civcm5ziy00d92imrwswlo1wv',
                zoom: settingsObject.zoom,
                center: settingsObject.center,
            });
            this.insetMaps.push(insetMap);
            i++;
        }
    }

    toggleInsetMaps(clickedLayer, visibilityVal) {
        for (let insetMap of this.insetMaps) {
            insetMap.setLayoutProperty(clickedLayer, 'visibility', visibilityVal);
        }
    }


    setColorScales() {
        this.colorScales = {};
        for (let variable in this.layerVars) {
            this.colorScales[variable] = getColorScale(null, this.layerVars[variable]);
        }
    }
}