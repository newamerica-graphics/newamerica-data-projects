let mapboxgl = require('mapbox-gl');

window.mapboxgl = mapboxgl;
var MapboxGeocoder = require('mapbox-gl-geocoder/mapbox-gl-geocoder.min.js');
// require('mapbox-gl-geocoder');
let GeoJSON = require('geojson');

import { colors } from "../helper_functions/colors.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";
import { formatValue } from "../helper_functions/format_value.js";
import { PopupDataBox } from "../components/popup_data_box.js";
import { Slider } from "../components/slider.js";

import $ from 'jquery';

let d3 = require("d3");

mapboxgl.acessToken = 'pk.eyJ1IjoibmV3YW1lcmljYW1hcGJveCIsImEiOiJjaXVmdTUzbXcwMGdsMzNwMmRweXN5eG52In0.AXO-coBbL621lzrE14xtEA';
mapboxgl.config.ACCESS_TOKEN = 'pk.eyJ1IjoibmV3YW1lcmljYW1hcGJveCIsImEiOiJjaXVmdTUzbXcwMGdsMzNwMmRweXN5eG52In0.AXO-coBbL621lzrE14xtEA';
// MapboxGeocoder.acessToken = 'pk.eyJ1IjoibmV3YW1lcmljYW1hcGJveCIsImEiOiJjaXVmdTUzbXcwMGdsMzNwMmRweXN5eG52In0.AXO-coBbL621lzrE14xtEA';

// window.mapboxgl.acessToken = 'pk.eyJ1IjoibmV3YW1lcmljYW1hcGJveCIsImEiOiJjaXVmdTUzbXcwMGdsMzNwMmRweXN5eG52In0.AXO-coBbL621lzrE14xtEA';


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

        this.map = new mapboxgl.Map(this.mapboxSettings);

        this.addControls();

        this.map.on('click', (e) => {
            console.log(e.point);
            console.log(e);
            let features = this.map.queryRenderedFeatures(e.point, { layers: ['points'] });
            
            console.log(features);
            if (!features.length) {
                this.map.setFilter("points-selected", ["==", "id", ""]);
                this.dataBox.hide();
                return;
            }

            this.map.setFilter("points-selected", ["==", "id", features[0].properties.id]);

            this.dataBox.show(features[0].properties);
            
            let newZoom = this.map.getZoom() < 7 ? 7 : this.map.getZoom();
            this.map.flyTo({
                center: e.lngLat,
                zoom: newZoom
            });
        });

    }

    render(d) {
        if (this.filterInitialDataBy) {
            d[this.primaryDataSheet] = d[this.primaryDataSheet].filter((d) => { return d[this.filterInitialDataBy.field] == this.filterInitialDataBy.value; })
        }

        d[this.primaryDataSheet] = d[this.primaryDataSheet].filter((d) => { return d[this.radiusVar.variable] && Number(d[this.radiusVar.variable]) > 0 });

        this.setPopupDataBox();
        this.setColorScale(d[this.primaryDataSheet]);
        this.setRadiusScale(d[this.primaryDataSheet]);

        this.addSlider();
        this.slider.render(d);

        this.addLegend();

        this.processData(d[this.primaryDataSheet]);
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
                    },
                    'circle-stroke-color': "#ffffff",
                    'circle-stroke-width': 1,
                }
            });

            this.map.addLayer({
                "id": "points-selected",
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
                    },
                    'circle-stroke-color': "#ffffff",
                    'circle-stroke-width': 5,
                },
                "filter": ["==", "id", ""]
            });
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
        this.map.addControl(new MapboxGeocoder({
            accessToken: mapboxgl.accessToken, 
            country:'pk',
            // types: ['region', 'district', 'place', 'postcode']
        }), 'top-left');

        this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    }

    addSlider() {
        this.sliderContainer = d3.select(this.id + '-map-container')
            .append("div")
            .attr("id", "slider-container");

        this.sliderSettings.id = "#slider-container";
        this.sliderSettings.primaryDataSheet = this.primaryDataSheet;
        this.sliderSettings.filterChangeFunction = this.changeValue.bind(this);
        this.sliderSettings.startStopFunction = this.sliderStartStop.bind(this);
        this.slider = new Slider(this.sliderSettings);
    }


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
            .range([3, 30]);

        this.radiusStops = [];
        this.radiusStops.push([this.radiusScale.domain()[0], this.radiusScale.range()[0]]);
        this.radiusStops.push([this.radiusScale.domain()[1], this.radiusScale.range()[1]]);
    }

    setPopupDataBox() {
        this.dataBox = new PopupDataBox({
            id: this.id,
            dataBoxVars: this.dataBoxVars
        });
    }

    addLegend() {
        this.legend = d3.select(this.id + " .mapboxgl-canvas-container")
            .append("div")
            .attr("class", "mapbox-map__legend")

        this.cellContainer = this.legend.append("div")
            .attr("class", "mapbox-map__legend__cell-container");

        this.cellContainer.append("h5")
            .attr("class", "mapbox-map__legend__cell-container__label")
            .text(this.colorVar.displayName);

        this.setLegendCellContents();

        this.propCircleContainer = this.legend.append("div")
            .attr("class", "mapbox-map__legend__proportional-circle");

        this.propCircleContainer.append("h5")
            .attr("class", "mapbox-map__legend__proportional-circle__label")
            .text(this.radiusVar.displayName);

        this.setLegendPropCircleContents();
    }

    setLegendCellContents() {
        let legendCells = this.cellContainer.selectAll("div")
            .data(this.colorStops)
          .enter().append("div")
            .attr("class", "mapbox-map__legend__cell");

        legendCells.append("svg")
            .attr("class", "mapbox-map__legend__color-swatch-container")
            .attr("height", 10)
            .attr("width", 10)
           .append("circle")
            .attr("class", "mapbox-map__legend__color-swatch")
            .attr("cx", 5)
            .attr("cy", 5)
            .attr("r", 5)
            .attr("fill", (d) => { return d[1]; });

        legendCells.append("h5")
            .attr("class", "mapbox-map__legend__cell-label")
            .text((d) => { return d[0]; }); 
    }

    setLegendPropCircleContents() {
        let width = 80,
            height = 90;
        
        let svg = this.propCircleContainer
            .append("div")
            .attr("class", "mapbox-map__legend__proportional-circle__wrapper")
            .style("width", width + "px")
            .style("margin", "auto")
            .append("svg")
            .attr("height", height)
            .attr("width", width);

        svg.selectAll("circle")
            .data(this.radiusStops)
          .enter().append("circle")
            .attr("fill", "none")
            .attr("stroke", "#6b6d71")
            .attr("stroke-width", 1)
            .attr("cx", width/2)
            .attr("cy", height/2)
            .attr("r", (d) => { console.log(d); return d[1]; });

        svg.selectAll("text")
            .data(this.radiusStops)
          .enter().append("text")
            .attr("x", width/2)
            .attr("y", (d) => { console.log(d); return height/2 - d[1] - 3; })
            .attr("fill", "#6b6d71")
            .style("text-anchor", "middle")
            .text((d) => { console.log(d); return d[0]; });

    }

    resize() {
        this.slider.resize();
        
    }

    changeValue(value) {
        if (this.map.loaded() && value) {
            if (value == "all") {
                this.map.setFilter('points', ['!=', 'year', ""]);
            } else {
                this.map.setFilter('points', ['==', 'year', String(value)]);
            }
        }
    }

    sliderStartStop(animationState) {
        if (animationState == "playing") {
            this.map.setFilter("points-selected", ["==", "id", ""]);
            this.dataBox.hide();
        }
    }
}