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

let cityCoords = [
    {"city": "Baltimore", "ltLng":[-76.6122, 39.2904]},
    {"city": "BatonRouge", "ltLng":[-91.1536895874024, 30.449347293721914]},
    {"city": "Birmingham", "ltLng":[-86.8025, 33.5207]},
    {"city": "Boston", "ltLng":[-71.0589, 42.3601]},
    {"city": "Dallas", "ltLng":[-96.7970, 32.7767]},
    {"city": "Jacksonville", "ltLng":[-81.6557, 30.3322]},
    {"city": "KansasCity", "ltLng":[-94.56289298400809, 39.088708678050665]},
    {"city": "Minneapolis", "ltLng":[-93.2650, 44.9778]},
    {"city": "NewHaven", "ltLng":[-72.9279, 41.3083]},
    {"city": "Oakland", "ltLng":[-122.2711, 37.8044]},
    {"city": "Phoenix", "ltLng":[-112.0740, 33.4484]},
    {"city": "Portland", "ltLng":[-122.6765, 45.5231]},
    {"city": "SaltLakeCity", "ltLng":[-111.8910, 40.765545689215514]},
    {"city": "Seattle", "ltLng":[-122.3321, 47.6062]},
    {"city": "StLouis", "ltLng":[-90.1994, 38.6270]}
];

export class MapboxMap {
    constructor(vizSettings, imageFolderId) {
        if (!mapboxgl.supported()) {
            alert('Your browser does not support Mapbox GL');
            return;
        }
        let {id, mapboxStyleUrl, additionalLayers, tooltipVars, insetMapSettings, source, filters, popupContentFunction, popupColumns, toggleOffLayers, existingLayers} = vizSettings;
        this.id = id;
        this.source = source;
        this.filters = filters;
        this.additionalLayers = additionalLayers;
        this.existingLayers = existingLayers;
        this.tooltipVars = tooltipVars;
        this.insetMapSettings = insetMapSettings;
        this.popupContentFunction = popupContentFunction;
        this.toggleOffLayers = toggleOffLayers;
        this.colorStops = [];
        this.currToggledIndex = 0;

        this.currSnapshotIndex = 0;


        let mapContainer = d3.select(id).append("div")
            .attr("id", id.replace("#", "") + '-map-container')
            .style("width", "1350px")
            .style("height", "1350px")
            .style("margin", "30px");

        console.log($(id));
        this.map = new mapboxgl.Map({
            container: id.replace("#", "") + '-map-container',
            style: mapboxStyleUrl,
            zoom: 13,
            center: cityCoords[this.currSnapshotIndex].ltLng,
            minZoom: 13,
            maxZoom: 13,
            attributionControl: false,
            interactive: false
        });

        if (insetMapSettings) { 
            this.createInsetMaps();
        }

        this.setColorScales();

        // this.addControls();
        
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

            // this.map.setLayoutProperty('ncua', 'visibility', 'visible');
            // this.map.setPaintProperty('altcredit', 'circle-radius', 10);
            // this.map.setPaintProperty('banks', 'circle-radius', 10);
            // this.map.setPaintProperty('ncua', 'circle-radius', 10);

            // this.map.setPaintProperty('altcredit', 'circle-blur', 0);
            // this.map.setPaintProperty('banks', 'circle-blur', 0);
            // this.map.setPaintProperty('ncua', 'circle-blur', 0);

            this.addLayers();

            // this.addTooltip();

            // this.addFilters();

            // this.addLegend();

            let loadNumber = 0;
            let currCity = cityCoords[this.currSnapshotIndex];

            this.map.on("render", () => {
                // console.log("rendered!");
                // console.log(this.map.loaded());
                console.log(loadNumber);
                console.log(this.map.getCenter());

              if(this.map.loaded() && loadNumber >= 0) {
                
                
                let canvas = this.map.getCanvas();
                            // console.log(canvas);
                            // var image = new Image();
                            // image.src = canvas.toDataURL("image/png");
                            var link = document.createElement("a");
                            link.download = currCity.city + 'FamPov.png';
                            link.href = canvas.toDataURL("image/png");
                            link.click();
                            link.remove();
                            // console.log(image);
                            // $("#image-export").append(image);

                
                this.currSnapshotIndex++;
                currCity = cityCoords[this.currSnapshotIndex];
                console.log(currCity);
                console.log(this.map.getPaintProperty('ncua', 'circle-radius'));
                this.map.setCenter(currCity.ltLng);
                
              }

                if(this.map.loaded()) {
                    loadNumber++;
                }
              
            });
        });

        

        

        // for (let cityCoord of cityCoords) {
        //     console.log(cityCoord);
        //     this.map.setCenter(cityCoord);
        //     loadNumber = 0;
        // }

    }

    addControls() {
        this.map.addControl(new mapboxgl.Geocoder({
            country:'us',
            types: ['country', 'region', 'district', 'place', 'postcode']
        }));

        this.map.addControl(new mapboxgl.NavigationControl({position: 'top-left'}));
    }

    addLayers() {
        this.additionalLayerNames = [];
        for (let i = 0; i < 1; i++) {
            let currLayer = this.additionalLayers[i],
                numBins = currLayer.numBins,
                dataMin = currLayer.customDomain[0],
                dataMax = currLayer.customDomain[1];
            let dataSpread = dataMax - dataMin;
            dataSpread -= dataSpread/4;
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
            console.log(this.colorScales[i].domain());
            console.log(this.colorScales[i].range());
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

        for (let layer of this.existingLayers) {
            console.log(layer);
            this.map.setLayoutProperty(layer.variable, 'visibility', 'none')
        }

        

        // this.addClickLayer();
        
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
            // console.log(e.lngLat);
            // console.log(features[0]);
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
            .on("change", (a, b, c) => {
                let selectedIndex = d3.event.srcElement.selectedIndex;
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
        console.log(this.colorScales[0].range());
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
        console.log(currColorStops);

        this.cellList ? this.cellList.remove() : null;
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

        // [this.dataMin, this.dataMax] = this.colorScale.domain();
        // let dataSpread = this.dataMax - this.dataMin;
        // this.binInterval = dataSpread/this.numBins;
        // this.legendCellDivs = [];

        // for (let i = 0; i < this.numBins; i++) {
        //     this.valsShown.push(i);
        //     let cell = this.cellList.append("li")
        //         .classed("legend__cell", true);

        //     if (this.disableValueToggling) {
        //         cell.style("cursor", "initial");
        //     } else {
        //         cell.on("click", () => { this.toggleValsShown(i); valChangedFunction(this.valsShown); });
        //     }
        //     this.appendCellMarker(cell, i);
        //     valCounts ? this.appendValCount(cell, i, valCounts) : null;
        //     this.appendCellText(cell, i, scaleType, format);
            
        //     this.legendCellDivs[i] = cell;
        // }

    }

    getLegendCellLabel(currColorStops, i) {
        let format = this.additionalLayers[this.currToggledIndex].format;
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