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



export class MapboxMap {
    constructor(vizSettings, imageFolderId) {
        if (!mapboxgl.supported()) {
            alert('Your browser does not support Mapbox GL');
            return;
        }
        let {id, mapboxStyleUrl, additionalLayers, insetMapSettings, source, filters, popupContentFunction} = vizSettings;
        this.id = id;
        this.source = source;
        this.filters = filters;
        this.additionalLayers = additionalLayers;
        this.insetMapSettings = insetMapSettings;
        this.popupContentFunction = popupContentFunction;

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

        if (insetMapSettings) { 
            this.createInsetMaps();
        }

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
            this.map.addSource(this.source.id,{
                'type': 'vector',
                'url': this.source.url
            });
            this.addLayers();

            this.addTooltip();

            this.addFilters();
        });
    }

    addControls() {
        this.map.addControl(new mapboxgl.Geocoder({
            country:'us',
        }));

        this.map.addControl(new mapboxgl.NavigationControl());
    }

    addLayers() {
        this.additionalLayerNames = [];
        for (let i = 0; i < this.additionalLayers.length; i++) {
            let currLayer = this.additionalLayers[i],
                numBins = currLayer.numBins,
                dataMin = currLayer.customDomain[0],
                dataMax = currLayer.customDomain[1];
            let dataSpread = dataMax - dataMin;
            let binInterval = dataSpread/numBins;

            this.additionalLayerNames.push(currLayer.variable);

            let colorStops = [];

            for (let j = 0; j < numBins; j++) {
                colorStops.push([dataMin + j*binInterval, this.colorScales[i].range()[j]]);
            }

            console.log(colorStops);
            this.map.addLayer(
                {
                    'id': currLayer.variable,
                    'source': this.source.id,
                    'source-layer': this.source.sourceLayer,
                    'type': 'fill',
                    // 'filter': ['>', , 0],
                    'paint': {
                        'fill-color': {
                            property: currLayer.variable,
                            stops: colorStops
                        },
                        'fill-opacity': .85,
                        'fill-outline-color': {
                            stops: [
                                [7, "rgba(0,0,0,0)"],
                                [11, colors.white]
                            ]
                        }
                    }
                },'water'
            );

            i != 0 ? this.map.setLayoutProperty(currLayer.variable, 'visibility', 'none') : null;

            this.addClickLayer();
        }
    }

    addClickLayer() {
       this.map.addLayer({
            "id": "click-layer",
            "type": "fill",
            'source': this.source.id,
            'source-layer': this.source.sourceLayer,
            "paint": {
                "fill-color": "rgba(0,0,0,0)",
                "fill-opacity": 0,
                'fill-outline-color': colors.black
            },
            "filter": ["==", "GEOID2", ""]
        },'water');
    }

    addTooltip() {
        this.map.on('click', (e) => {
            var features = this.map.queryRenderedFeatures(e.point, { layers: this.additionalLayerNames });
            // console.log(e.lngLat);
            // console.log(features[0]);
            if (!features.length) {
                this.popup.remove();
                this.map.setFilter("click-layer", ["==", "GEOID2", ""]);
                return;
            }

            let feature = features[0];
            // console.log(feature.layer.paint);

            // feature.layer.paint["fill-color"] = "green";
            // console.log(feature.layer.paint);
           
            this.popup
                .setLngLat(e.lngLat)
                .setHTML(this.popupContentFunction(feature))
                .addTo(this.map);

            this.map.setFilter("click-layer", ["==", "GEOID2", feature.properties.GEOID2]);
        });
    }

    addFilters() {
        let filterGroupContainer = d3.select(this.id).append("div")
            .attr("class", "mapbox-map__filter-group-container")
        let i = 0;
        for (let filter of this.filters) {
            filterGroupContainer.append("div")
                .attr("class", "mapbox-map__filter-group")
                .attr("id", "filter-" + i);

            this.addFilter("#filter-" + i, filter.filterVars, filter.toggleInsets, filter.canToggleMultiple);
            i++;
        }
    }

    addFilter(menuDomId, filterVars, toggleInsets, canToggleMultiple) {
        let $menu = $(menuDomId);
        let map = this.map;
        let toggleInsetFunction = this.toggleInsetMaps.bind(this);
        for (var i = 0; i < filterVars.length; i++) {
            var id = filterVars[i].variable;

            var link = document.createElement('a');
            link.href = '#';
            link.className = !canToggleMultiple && i != 0 ? '' : 'active';
            link.textContent = filterVars[i].displayName;
            link.value = id;

            link.onclick = function (e) {
                if (!canToggleMultiple) {
                    $menu.children(".active").removeClass("active");
                    for (let filterVar of filterVars) {
                        map.setLayoutProperty(filterVar.variable, 'visibility', 'none');
                        toggleInsets ? toggleInsetMaps(layer, 'none') : null;
                    }
                }
                var clickedLayer = this.value;
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

        for (let settingsObject of this.insetMapSettings) {
            insetContainer.append("div")
                .attr('class', 'mapbox-map__inset')
                .attr("id", 'inset-map-' + i);

            var insetMap = new mapboxgl.Map({
                container: 'inset-map-' + i,
                style: 'mapbox://styles/newamericamapbox/civcm5ziy00d92imrwswlo1wv',
                zoom: settingsObject.zoom,
                minZoom: settingsObject.zoom,
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
        this.colorScales = [];
        for (let i = 0; i < this.additionalLayers.length; i++) {
            this.colorScales[i] = getColorScale(null, this.additionalLayers[i]);
        }
        console.log(this.colorScales[0].range());
    }
}