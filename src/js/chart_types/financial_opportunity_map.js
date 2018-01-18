let mapboxgl = require('mapbox-gl');
window.mapboxgl = mapboxgl;
var MapboxGeocoder = require('mapbox-gl-geocoder/mapbox-gl-geocoder.js');

import { colors } from "../helper_functions/colors.js";
import { formatValue } from "../helper_functions/format_value.js";

import $ from 'jquery';

let d3 = require("d3");

mapboxgl.acessToken = 'pk.eyJ1IjoibmV3YW1lcmljYW1hcGJveCIsImEiOiJjaXVmdTUzbXcwMGdsMzNwMmRweXN5eG52In0.AXO-coBbL621lzrE14xtEA';
mapboxgl.config.ACCESS_TOKEN = 'pk.eyJ1IjoibmV3YW1lcmljYW1hcGJveCIsImEiOiJjaXVmdTUzbXcwMGdsMzNwMmRweXN5eG52In0.AXO-coBbL621lzrE14xtEA';

export class FinancialOpportunityMap {
    constructor(vizSettings, imageFolderId) {
        if (!mapboxgl.supported()) {
            alert('Your browser does not support Mapbox GL');
            return;
        }
        let {id, mapboxStyleUrl, additionalLayers, tooltipVars, insetMapSettings, source, filters, popupContentFunction, popupColumns, toggleOffLayers} = vizSettings;
        this.id = id;
        this.source = source;
        this.filters = filters;
        this.additionalLayers = additionalLayers;
        this.tooltipVars = tooltipVars;
        this.insetMapSettings = insetMapSettings;
        this.popupContentFunction = popupContentFunction;
        this.toggleOffLayers = toggleOffLayers;
        this.colorStops = [];
        this.currToggledIndex = 0;

        let mapContainer = d3.select(id).append("div")
            .attr("id", id.replace("#", "") + '-map-container')
            .style("width", "100%")
            .style("height", "700px");

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

        this.addControls();
        
        this.popup = mapContainer.append("div")
            .attr("class", "mapbox-map__popup columns-"  + popupColumns)
            .style("display", "none");

        this.popupClose = this.popup.append("div")
            .attr("class", "mapbox-map__popup__close")
            .on("click", () => {
                this.popup.style("display", "none");
                this.map.setFilter("click-layer", ["==", "GEOID2", ""]);
            });

        this.popupContent = this.popup.append("div");

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

            this.addLegend();
        });

    }

    addControls() {
        this.map.addControl(new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            country:'us',
            types: 'country,region,district,place,postcode'
        }), 'top-left');

        this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    }

    addLayers() {
        this.additionalLayerNames = [];
        for (let i = 0; i < this.additionalLayers.length; i++) {
            let currLayer = this.additionalLayers[i],
                numBins = currLayer.numBins,
                customDomain = currLayer.customDomain,
                customRange = currLayer.customRange;

            this.additionalLayerNames.push(currLayer.variable);

            let fillColorStops = [],
                outlineColorStops = [];

            for (let j = 0; j < numBins; j++) {
                // let outlineColor = this.colorScales[i].range()[j].replace("rgb", "rgba").replace(")", ", .7)");
                fillColorStops.push([customDomain[j], customRange[j]]);
                // outlineColorStops.push([{zoom: 1, value: dataMin + j*binInterval}, outlineColor]);
                // outlineColorStops.push([{zoom: 11, value: dataMin + j*binInterval}, "white"]);
            }
            
            this.colorStops[i] = fillColorStops;
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
                            type: "interval",
                            stops: fillColorStops
                        },
                        'fill-opacity': {
                            stops: [ [0, 1], [11, .75]]
                        },
                        // 'fill-outline-color': {
                        //     property: currLayer.variable,
                        //     type: "interval",
                        //     stops: outlineColorStops
                        // }
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
        },'admin-2-boundaries-dispute');
    }

    addTooltip() {
        this.map.on('click', (e) => {
            var features = this.map.queryRenderedFeatures(e.point, { layers: this.additionalLayerNames });
            if (!features.length) {
                this.popup.style("display", "none");
                this.map.setFilter("click-layer", ["==", "GEOID2", ""]);
                return;
            }

            let feature = features[0];
           
            this.popupContent
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
                .attr("id", "filter-" + i);

            if (filter.canToggleMultiple) {
                this.addMultiToggleFilter(currFilter, filter.filterVars, filter.toggleInsets);
            } else {
                this.addSelectFilter(currFilter, filter.filterVars, filter.label);
            }
            i++;
        }
    }

    addSelectFilter(filterDomElem, filterVars, hasLabel) {
        filterDomElem.attr("class", "mapbox-map__filter-group select");

        if (hasLabel) {
            filterDomElem.append("div")
                .attr("class", "mapbox-map__filter-group__label")
                .text("Base Layer:");
        }

        let selectBox = filterDomElem.append('select')
            .attr("class", "mapbox-map__filter-group__select")
            .classed("has-label", hasLabel)
            .on("change", (a, b, path) => {
                let selectedIndex = path[0].selectedIndex;
                for (let i = 0; i < filterVars.length; i++) {
                    let visibility = i == selectedIndex ? 'visible' : 'none';
                    this.map.setLayoutProperty(filterVars[i].variable, 'visibility', visibility);
                }

                this.currToggledIndex = selectedIndex;
                this.setLegendContents()
            });

        for (let i = 0; i < filterVars.length; i++) {
            selectBox.append('option')
                .text(filterVars[i].displayName);
        }

        selectBox.append('option')
            .text("None");
    }

    addMultiToggleFilter(filterDomElem, filterVars, toggleInsets) {
        filterDomElem.attr("class", "mapbox-map__filter-group multi-toggle")
        let map = this.map;
        let toggleInsetFunction = this.toggleInsetMaps.bind(this);
        for (let i = 0; i < filterVars.length; i++) {
            let id = filterVars[i].variable;

            let currFilter = filterDomElem.append('div')
                .attr("class", "mapbox-map__filter-group__multi-toggle-option")
                .classed("active", () => {
                    if (this.toggleOffLayers) {
                        for (let layer of this.toggleOffLayers) {
                            if (layer.variable === filterVars[i].variable) {
                                return false;
                            }
                        }
                    }
                    return true;
                })
                .attr("value", id)
                .on("click", (a, index, elem) => {
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

            currFilter.append("svg")
                .attr("height", 10)
                .attr("width", 10)
              .append("circle")
                .attr("r", 4)
                .attr("cx", 5)
                .attr("cy", 5)
                .attr("fill", filterVars[i].color)


            currFilter.append("h5")
                .text(filterVars[i].displayName);
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
                        zoom: 9
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
    }

    addLegend() {
        this.legend = d3.select(this.id + " .mapboxgl-canvas-container")
            .append("div")
            .attr("class", "mapbox-map__legend")

        this.cellContainer = this.legend.append("div")
            .attr("class", "mapbox-map__legend__cell-container");

        this.setLegendContents();
    }

    setLegendContents() {
        let currColorStops = this.colorStops[this.currToggledIndex];

        this.cellList ? this.cellList.remove() : null;

        if (currColorStops) {
            this.legend.style("display", "block"); 
        } else {
            this.legend.style("display", "none"); 
            return; 
        }

        this.cellList = this.cellContainer.append("ul")
            .attr("class", "mapbox-map__legend__cell-list");

        for (let i = 0; i < currColorStops.length; i++) {
            let cell = this.cellList.append("li")
                .attr("class", "mapbox-map__legend__cell");

            cell.append("svg")
                .attr("class", "mapbox-map__legend__color-swatch-container")
                .attr("height", 10)
                .attr("width", 10)
               .append("rect")
                .attr("class", "mapbox-map__legend__color-swatch")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("height", 10)
                .attr("width", 10)
                .attr("fill", currColorStops[i][1]);

            cell.append("h5")
                .attr("class", "mapbox-map__legend__cell-label")
                .text(this.getLegendCellLabel(currColorStops, i));

        }
    }

    getLegendCellLabel(currColorStops, i) {
        let format = this.additionalLayers[this.currToggledIndex].format,
            customLabels = this.additionalLayers[this.currToggledIndex].customLabels;

        if (customLabels) {
            return customLabels[i];
        }

        if (i == 0) {
            return "Less than " + formatValue(currColorStops[1][0], format);
        } else if (i == currColorStops.length - 1) {
            return "More than " + formatValue(currColorStops[i][0], format);
        } else {
            return formatValue(currColorStops[i][0], format) + " - " + formatValue(currColorStops[i+1][0], format);
        }
    }

    resize() {
        let insetDivs = $(".mapbox-map__inset")
        let width = insetDivs.width();
        insetDivs.height(width);
    }
}