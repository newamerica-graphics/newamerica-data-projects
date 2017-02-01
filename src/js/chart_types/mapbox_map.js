let mapboxgl = require('mapbox-gl');
window.mapboxgl = mapboxgl;
require('mapbox-gl-geocoder');
let GeoJSON = require('geojson');

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
        
        Object.assign(this, vizSettings);

        let mapContainer = d3.select(this.id).append("div")
            .attr("id", this.id.replace("#", "") + '-map-container')
            .style("width", "100%")
            .style("height", "700px");

        Object.assign(this.mapboxSettings, {
            container: this.id.replace("#", "") + '-map-container',
            minZoom: 4,
            maxZoom: 15,
            attributionControl: true
        })

        console.log(this.mapboxSettings);

        this.map = new mapboxgl.Map(this.mapboxSettings);

        // this.setColorScales();

        this.addControls();
        
        // this.popup = mapContainer.append("div")
        //     .attr("class", "mapbox-map__popup columns-"  + popupColumns)
        //     .style("display", "none");

        // this.popupClose = this.popup.append("div")
        //     .attr("class", "mapbox-map__popup__close")
        //     .on("click", () => {
        //         this.popup.style("display", "none");
        //         this.map.setFilter("click-layer", ["==", "GEOID2", ""]);
        //     });

        // this.popupContent = this.popup.append("div");

    }

    render(data) {
        console.log(data);
        this.setColorScale(data[this.primaryDataSheet]);
        this.setRadiusScale(data[this.primaryDataSheet]);

        console.log(this.colorScale.domain());
        console.log(this.colorScale.range());
        this.processData(data[this.primaryDataSheet]);
        this.map.on('load', () => {
            this.map.addSource("dataSource", this.source);
            this.map.addLayer({
                "id": "points",
                "type": "circle",
                "source": "dataSource",
                "paint": {
                  'circle-color': {
                        property: this.colorVar.variable,
                        type: 'categorical',
                        stops: this.colorStops
                    },
                    'circle-radius': {
                        property: this.radiusVar.variable,
                        stops: this.radiusStops
                    }
                }
            });

            console.log(this.map.getSource("dataSource"));

            // this.addTooltip();

            // this.addFilters();

            // this.addLegend();
        });

    }

    processData(data) {
        console.log(data);
        this.data = GeoJSON.parse(data, {Point: ['geo_lat', 'geo_lon']});
        this.source = {
            "type": "geojson",
            "data" : this.data
        }
        console.log(this.data);
    }

    addControls() {
        this.map.addControl(new mapboxgl.Geocoder({
            country:'pk',
            types: ['region', 'district', 'place', 'postcode']
        }));

        this.map.addControl(new mapboxgl.NavigationControl({position: 'top-left'}));
    }

    // addTooltip() {
    //     this.map.on('click', (e) => {
    //         var features = this.map.queryRenderedFeatures(e.point, { layers: this.additionalLayerNames });
    //         // console.log(e.lngLat);
    //         // console.log(features[0]);
    //         if (!features.length) {
    //             this.popup.style("display", "none");
    //             this.map.setFilter("click-layer", ["==", "GEOID2", ""]);
    //             return;
    //         }

    //         let feature = features[0];
           
    //         this.popupContent
    //             .html(this.popupContentFunction(feature));

    //         this.popup.style("display", "block");


    //         this.map.setFilter("click-layer", ["==", "GEOID2", feature.properties.GEOID2]);
    //         let newZoom = this.map.getZoom() < 7 ? 7 : this.map.getZoom();
    //         this.map.flyTo({
    //             center: e.lngLat,
    //             zoom: newZoom
    //         });
    //     });
    // }

    // addFilters() {
    //     let filterGroupContainer = d3.select(this.id).append("div")
    //         .attr("class", "mapbox-map__filter-group-container")
    //     let i = 0;
    //     for (let filter of this.filters) {
    //         let currFilter = filterGroupContainer.append("div")
    //             .attr("id", "filter-" + i);

    //         if (filter.canToggleMultiple) {
    //             this.addMultiToggleFilter(currFilter, filter.filterVars, filter.toggleInsets);
    //         } else {
    //             this.addSelectFilter(currFilter, filter.filterVars, filter.label);
    //         }
    //         i++;
    //     }
    // }

    // addSelectFilter(filterDomElem, filterVars, hasLabel) {
    //     filterDomElem.attr("class", "mapbox-map__filter-group select");

    //     if (hasLabel) {
    //         filterDomElem.append("div")
    //             .attr("class", "mapbox-map__filter-group__label")
    //             .text("Base Layer:");
    //     }

    //     let selectBox = filterDomElem.append('select')
    //         .attr("class", "mapbox-map__filter-group__select")
    //         .classed("has-label", hasLabel)
    //         .on("change", (a, b, c) => {
    //             let selectedIndex = d3.event.srcElement.selectedIndex;
    //             for (let i = 0; i < filterVars.length; i++) {
    //                 let visibility = i == selectedIndex ? 'visible' : 'none';
    //                 this.map.setLayoutProperty(filterVars[i].variable, 'visibility', visibility);
    //             }

    //             this.currToggledIndex = selectedIndex;
    //             this.setLegendContents()
    //         });

    //     for (let i = 0; i < filterVars.length; i++) {
    //         selectBox.append('option')
    //             .text(filterVars[i].displayName);
    //     }
    // }

    // addMultiToggleFilter(filterDomElem, filterVars, toggleInsets) {
    //     filterDomElem.attr("class", "mapbox-map__filter-group multi-toggle")
    //     let map = this.map;
    //     let toggleInsetFunction = this.toggleInsetMaps.bind(this);
    //     for (let i = 0; i < filterVars.length; i++) {
    //         let id = filterVars[i].variable;

    //         let currFilter = filterDomElem.append('div')
    //             .attr("class", "mapbox-map__filter-group__multi-toggle-option")
    //             .classed("active", () => {
    //                 if (this.toggleOffLayers) {
    //                     for (let layer of this.toggleOffLayers) {
    //                         if (layer.variable === filterVars[i].variable) {
    //                             return false;
    //                         }
    //                     }
    //                 }
    //                 return true;
    //             })
    //             .attr("value", id)
    //             .on("click", (a, index, elem) => {
    //                 var clickedLayer = d3.select(elem[0]).attr("value");
    //                 d3.event.preventDefault();
    //                 d3.event.stopPropagation();

    //                 var visibility = this.map.getLayoutProperty(clickedLayer, 'visibility');

    //                 if (visibility === 'visible') {
    //                     this.map.setLayoutProperty(clickedLayer, 'visibility', 'none');
    //                     toggleInsets ? this.toggleInsetMaps(clickedLayer, 'none') : null;
    //                     d3.select(elem[0]).classed("active", false);
    //                 } else {
    //                     d3.select(elem[0]).classed("active", true);
    //                     toggleInsets ? this.toggleInsetMaps(clickedLayer, 'visible') : null;
    //                     this.map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
    //                 }
    //             });

    //         currFilter.append("svg")
    //             .attr("height", 10)
    //             .attr("width", 10)
    //           .append("circle")
    //             .attr("r", 4)
    //             .attr("cx", 5)
    //             .attr("cy", 5)
    //             .attr("fill", filterVars[i].color)


    //         currFilter.append("h5")
    //             .text(filterVars[i].displayName);
    //     }
    // }


    setColorScale(data) {
        this.colorScale = getColorScale(data, this.colorVar);
        
        this.colorStops = [];
        for (let i = 0; i < this.colorScale.domain().length; i++) {
            this.colorStops.push([this.colorScale.domain()[i], this.colorScale.range()[i]]);
        }
    }

    setRadiusScale(data) {
        let extents = d3.extent(data, (d) => { return Number(d[this.radiusVar.variable]); });
        console.log(extents);
        this.radiusScale = d3.scaleLinear()
            .domain(extents)
            .range([5, 30]);

        this.radiusStops = [];

        this.radiusStops.push([this.radiusScale.domain()[0], this.radiusScale.range()[0]]);
        this.radiusStops.push([this.radiusScale.domain()[1], this.radiusScale.range()[1]]);

        console.log(this.radiusStops);
    }

    // addLegend() {
    //     this.legend = d3.select(this.id + " .mapboxgl-canvas-container")
    //         .append("div")
    //         .attr("class", "mapbox-map__legend")

    //     this.cellContainer = this.legend.append("div")
    //         .attr("class", "mapbox-map__legend__cell-container");

    //     this.setLegendContents();
    // }

    // setLegendContents() {
    //     let currColorStops = this.colorStops[this.currToggledIndex];
    //     console.log(currColorStops);

    //     this.cellList ? this.cellList.remove() : null;
    //     this.cellList = this.cellContainer.append("ul")
    //         .attr("class", "mapbox-map__legend__cell-list");

    //     for (let i = 0; i < currColorStops.length; i++) {
    //         let cell = this.cellList.append("li")
    //             .attr("class", "mapbox-map__legend__cell");

    //         cell.append("svg")
    //             .attr("class", "mapbox-map__legend__color-swatch-container")
    //             .attr("height", 10)
    //             .attr("width", 10)
    //            .append("rect")
    //             .attr("class", "mapbox-map__legend__color-swatch")
    //             .attr("x1", 0)
    //             .attr("y1", 0)
    //             .attr("height", 10)
    //             .attr("width", 10)
    //             .attr("fill", currColorStops[i][1]);

    //         cell.append("h5")
    //             .attr("class", "mapbox-map__legend__cell-label")
    //             .text(this.getLegendCellLabel(currColorStops, i));

    //     }

    //     // [this.dataMin, this.dataMax] = this.colorScale.domain();
    //     // let dataSpread = this.dataMax - this.dataMin;
    //     // this.binInterval = dataSpread/this.numBins;
    //     // this.legendCellDivs = [];

    //     // for (let i = 0; i < this.numBins; i++) {
    //     //     this.valsShown.push(i);
    //     //     let cell = this.cellList.append("li")
    //     //         .classed("legend__cell", true);

    //     //     if (this.disableValueToggling) {
    //     //         cell.style("cursor", "initial");
    //     //     } else {
    //     //         cell.on("click", () => { this.toggleValsShown(i); valChangedFunction(this.valsShown); });
    //     //     }
    //     //     this.appendCellMarker(cell, i);
    //     //     valCounts ? this.appendValCount(cell, i, valCounts) : null;
    //     //     this.appendCellText(cell, i, scaleType, format);
            
    //     //     this.legendCellDivs[i] = cell;
    //     // }

    // }

    // getLegendCellLabel(currColorStops, i) {
    //     let format = this.additionalLayers[this.currToggledIndex].format;
    //     if (i == 0) {
    //         return "Less than " + formatValue(currColorStops[1][0], format);
    //     } else if (i == currColorStops.length - 1) {
    //         return "More than " + formatValue(currColorStops[i][0], format);
    //     } else {
    //         return formatValue(currColorStops[i][0], format) + " - " + formatValue(currColorStops[i+1][0], format);
    //     }
    // }

    resize() {
        let insetDivs = $(".mapbox-map__inset")
        let width = insetDivs.width();
        insetDivs.height(width);
    }

    changeValue(value) {
        console.log("changing mapbox value " + value);
        if (this.map.loaded() && value) {
            this.map.setFilter('points', ['==', 'year', String(value)]);
        }
    }
}