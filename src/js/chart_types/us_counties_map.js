import $ from 'jquery';

import { Tooltip } from "../components/tooltip.js";
import { Legend } from "../components/legend.js";
import { Chart } from "../layouts/chart.js"

import { getColorScale } from "../helper_functions/get_color_scale.js";
import { colors } from "../helper_functions/colors.js";

import { usGeom } from '../../geography/us.js';

import { formatValue, deformatValue } from "../helper_functions/format_value.js";

import * as global from "./../utilities.js";

let d3 = require("d3");
let topojson = require("topojson");

export class UsCountiesMap extends Chart {
	constructor(vizSettings) {
		let {id, tooltipVars, filterVars, primaryDataSheet, secondaryDataSheet } = vizSettings;
		super(id);

		this.id = id;
		// this.filterVars = filterVars;
		this.primaryDataSheet = primaryDataSheet;
		this.secondaryDataSheet = secondaryDataSheet;

		// this.currFilterIndex = 0;
		// this.currFilterVar = this.filterVars[this.currFilterIndex].variable;

		let mapContainer = d3.select(id)
			.append("div");

		this.svg = mapContainer
			.append("svg")
			.attr("class", "us-states-svg");

		// this.tooltip = new Tooltip(id, tooltipVars, null, null);
		// let legendSettings = {};
		// legendSettings.id = id;
		// legendSettings.showTitle = true;
		// legendSettings.markerSettings = { shape:"circle", size:10 };
		// legendSettings.orientation = "vertical-right";

		// this.legend = new Legend(legendSettings);

		this.setDimensions();
		this.currYear = "1996";
	}

	setDimensions() {
		let containerWidth = $(this.id).width();
		this.w = containerWidth;

		this.h = 3*this.w/5;

		let translateX = this.w/2;
		let scalingFactor = 5*this.w/4;

		if (containerWidth > global.showLegendBreakpoint) {
			translateX -= global.legendWidth/2;
			this.h = this.w/2;
			scalingFactor = this.w;
			// this.legend.setOrientation("vertical-right");
		} else {
			// this.legend.setOrientation("horizontal-left");
		}

		this.svg
			.attr("height", this.h)
			.attr("width", "100%");

		//Define map projection
		let projection = d3.geoAlbersUsa()
				.scale(scalingFactor)
				.translate([translateX, this.h/2]);

		//Define path generator
		this.pathGenerator = d3.geoPath()
						 .projection(projection);
	}

	render(data) {	
		this.data = data[this.primaryDataSheet];

		this.usCountiesTopoJson = topojson.feature(usGeom, usGeom.objects.counties).features;

		this.bindDataToGeom();
		this.setScale();
		this.buildGraph();

		super.render();
	}

	processData() {
		for (let variable of this.filterVars) {
			for (let d of this.data) {
				if (d[variable.variable] && !$.isNumeric(d[variable.variable])) {
					d[variable.variable] = deformatValue(d[variable.variable]);
				}
			}
		}
	}

	setScale() {
		let dataMax = d3.max(this.data, (d) => { return Number(d['2016']); });

		console.log(dataMax);

		let colorScaleSettings = {};
		colorScaleSettings.scaleType = "linear";
		colorScaleSettings.variable = this.currYear;
		colorScaleSettings.customDomain = [0, dataMax];
		colorScaleSettings.customRange = [colors.white, colors.red.light];

		this.colorScale = getColorScale(this.data, colorScaleSettings);
	}


	bindDataToGeom() {
		for (let dataElem of this.data) {
			let dataID = dataElem.fips;

			for (let geom of this.usCountiesTopoJson) {
				if (dataID == geom.id) {
					geom.data = dataElem;
					break;
				}
			}
		}
	}

	buildGraph() {
		this.paths = this.svg.append("g")
	      .attr("class", "counties")
	    .selectAll("path")
	      .data(this.usCountiesTopoJson)
	    .enter().append("path")
	      .attr("fill", (d) => { return d.data ? this.colorScale(d.data[this.currYear]) : "#fff"; })
	      .attr("stroke", colors.grey.light)
	      .attr("stroke-width", 1)
	      .attr("d", this.pathGenerator);

		// this.svg.append("path")
		// 	.datum(topojson.mesh(usGeom, usGeom.objects.states, function(a, b) { return a !== b; }))
		// 	.attr("class", "states")
		// 	.attr("d", this.pathGenerator);
	}

  changeFilter(value) {
    this.currYear = value;

    this.paths
      .attr("fill", (d) => { return d.data ? this.colorScale(d.data[this.currYear]) : "#fff"; })
  }

	setLegend() {
		let legendSettings = {};

		legendSettings.title = this.filterVars[this.currFilterIndex].displayName;
		legendSettings.format = this.filterVars[this.currFilterIndex].format;
		legendSettings.scaleType = this.filterVars[this.currFilterIndex].scaleType;
		legendSettings.colorScale = this.colorScale;
		legendSettings.valChangedFunction = this.changeVariableValsShown.bind(this);

		this.legend.render(legendSettings);
	}

	setFilterGroup() {
		this.filterGroup.render(this.changeFilter.bind(this));
	}

	
	resize() {
		this.setDimensions();
		this.paths.attr("d", this.pathGenerator);
	}


	changeVariableValsShown(valsShown) {
		this.paths
			.style("fill", (d) => {
		   		var value = d.properties[this.currFilterVar];
		   		if (value) {
		   			let binIndex = this.colorScale.range().indexOf(this.colorScale(value));
		   			if (valsShown.indexOf(binIndex) > -1) {
		   				return this.colorScale(value);
		   			}
		   		}
		   		return "#ccc";
		    });
	}

	mouseover(datum, path, eventObject) {
		d3.select(path).style("stroke-width", "3");
		
		let mousePos = [];
		mousePos[0] = eventObject.pageX;
		mousePos[1] = eventObject.pageY;
		this.tooltip.show(datum.properties, mousePos);
	}

	mouseout(path) {
		d3.select(path).style("stroke-width", "1");
	    this.tooltip.hide();
	}
			
}