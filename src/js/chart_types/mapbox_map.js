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
        let {id, mapboxStyleUrl, additionalLayers, tooltipVars, insetMapSettings, source, filters, popupContentFunction, toggleOffLayers} = vizSettings;
        this.id = id;
        this.source = source;
        this.filters = filters;
        this.additionalLayers = additionalLayers;
        this.tooltipVars = tooltipVars;
        this.insetMapSettings = insetMapSettings;
        this.popupContentFunction = popupContentFunction;
        this.toggleOffLayers = toggleOffLayers;


        let mapContainer = d3.select(id).append("div")
            .attr("id", id.replace("#", "") + '-map-container')
            .style("width", "100%")
            .style("height", "700px");

        console.log($(id));
        this.map = new mapboxgl.Map({
            container: id.replace("#", "") + '-map-container',
            style: mapboxStyleUrl,
            zoom: 4,
            center: [-98.5795, 39.8282],
            minZoom: 4,
            maxZoom: 15,
            attributionControl: true
        });

        if (insetMapSettings) { 
            this.createInsetMaps();
        }

        this.setColorScales();

        this.addControls();
        
        this.popup = mapContainer.append("div")
            .attr("class", "mapbox-map__popup")
            .style("display", "none");
    }

    render() {
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
            types: ['country', 'region', 'place', 'postcode']
        }));

        this.map.addControl(new mapboxgl.NavigationControl({position: 'top-left'}));
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

            let fillColorStops = [],
                outlineColorStops = [];

            for (let j = 0; j < numBins; j++) {
                let outlineColor = this.colorScales[i].range()[j].replace("rgb", "rgba").replace(")", ", .7)");
                console.log(outlineColor);
                fillColorStops.push([dataMin + j*binInterval, this.colorScales[i].range()[j]]);
                outlineColorStops.push([{zoom: 1, value: dataMin + j*binInterval}, outlineColor]);
                outlineColorStops.push([{zoom: 11, value: dataMin + j*binInterval}, "white"]);
            }

            console.log(fillColorStops);
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
                            stops: fillColorStops
                        },
                        'fill-opacity': {
                            stops: [ [0, 1], [11, .75]]
                        },
                        'fill-outline-color': {
                            property: currLayer.variable,
                            type: "interval",
                            stops: outlineColorStops
                        }
                    }
                },'water'
            );

            i != 0 ? this.map.setLayoutProperty(currLayer.variable, 'visibility', 'none') : null;
        }

        this.addClickLayer();
        
        // if (this.toggleOffLayers) {
        //     for (let layer of this.toggleOffLayers) {
        //         this.map.setLayoutProperty(layer.variable, 'visibility', 'none')
        //     }
        // }
    }

    addClickLayer() {
       this.map.addLayer({
            "id": "click-layer",
            "type": "fill",
            'source': this.source.id,
            'source-layer': this.source.sourceLayer,
            "paint": {
                "fill-color": "rgba(0,0,0,0)",
                "fill-opacity": 1,
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
                this.popup.style("display", "none");
                this.map.setFilter("click-layer", ["==", "GEOID2", ""]);
                return;
            }

            let feature = features[0];
           
            this.popup
                .html(this.popupContentFunction(feature));

            this.popup.style("display", "block");

            this.map.setFilter("click-layer", ["==", "GEOID2", feature.properties.GEOID2]);
            let newZoom = this.map.getZoom() < 7 ? 7 : this.map.getZoom();
            this.map.flyTo({
                center: e.lngLat,
                zoom: newZoom
            });
        });
    }

    addFilters() {
        let filterGroupContainer = d3.select(this.id).append("div")
            .attr("class", "mapbox-map__filter-group-container")
        let i = 0;
        for (let filter of this.filters) {
            let currFilter = filterGroupContainer.append("div")
                .attr("class", "mapbox-map__filter-group")
                .attr("id", "filter-" + i);

            this.addFilter(currFilter, filter.filterVars, filter.toggleInsets, filter.canToggleMultiple);
            i++;
        }
    }

    addFilter(filterDomElem, filterVars, toggleInsets, canToggleMultiple) {
        let map = this.map;
        let toggleInsetFunction = this.toggleInsetMaps.bind(this);
        for (let i = 0; i < filterVars.length; i++) {
            let id = filterVars[i].variable;

            filterDomElem.append('a')
                .attr("href", '#')
                .classed("active", () => {
                    if (canToggleMultiple) {
                        if (this.toggleOffLayers) {
                            for (let layer of this.toggleOffLayers) {
                                if (layer.variable === filterVars[i].variable) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    }
                    
                    return i == 0;
                })
                .text(filterVars[i].displayName)
                .attr("value", id)
                .on("click", (a, index, elem) => {
                    if (!canToggleMultiple) {
                        filterDomElem.select(".active").classed("active", false);
                        for (let filterVar of filterVars) {
                            this.map.setLayoutProperty(filterVar.variable, 'visibility', 'none');
                            toggleInsets ? toggleInsetMaps(layer, 'none') : null;
                        }
                    }
                    var clickedLayer = d3.select(elem[0]).attr("value");
                    d3.event.preventDefault();
                    d3.event.stopPropagation();

                    var visibility = this.map.getLayoutProperty(clickedLayer, 'visibility');

                    if (visibility === 'visible') {
                        this.map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                        toggleInsets ? this.toggleInsetMaps(clickedLayer, 'none') : null;
                        d3.select(elem[0]).classed("active", false);
                    } else {
                        d3.select(elem[0]).classed("active", true);
                        toggleInsets ? this.toggleInsetMaps(clickedLayer, 'visible') : null;
                        this.map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
                    }
                });
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
                .attr("id", 'inset-map-' + i)
                .on("click", () => { 
                    this.map.flyTo({
                        center: settingsObject.center,
                        zoom: 7
                    })
                });

           let insetMap = new mapboxgl.Map({
                container: 'inset-map-' + i,
                style: 'mapbox://styles/newamericamapbox/civcm5ziy00d92imrwswlo1wv',
                zoom: settingsObject.zoom,
                center: settingsObject.center,
                attributionControl: false,
                interactive: false
            });

            // if (this.toggleOffLayers) {
            //     for (let layer of this.toggleOffLayers) {
            //         insetMap.setLayoutProperty(layer.variable, 'visibility', 'none')
            //     }
            // }

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

    resize() {
        let insetDivs = $(".mapbox-map__inset")
        let width = insetDivs.width();
        insetDivs.height(width);
    }
}