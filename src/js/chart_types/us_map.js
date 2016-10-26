import $ from 'jquery';

import { Tooltip } from "../components/tooltip.js";
import { Legend } from "../components/legend.js";
import { FilterGroup } from "../components/filter_group.js";
import { Chart } from "../layouts/chart.js"

import { getColorScale } from "../helper_functions/get_color_scale.js";

import { usGeom } from '../../geometry/us.js';

import { formatValue, deformatValue } from "../helper_functions/format_value.js";

import * as global from "./../utilities.js";

let d3 = require("d3");
let topojson = require("topojson");

export class UsMap extends Chart {
	
	constructor(vizSettings) {
		let {id, tooltipVars, filterVars, primaryDataSheet, geometryVar, geometryType, hasStroke } = vizSettings;
		super(id);

		this.id = id;
		this.filterVars = filterVars;
		this.primaryDataSheet = primaryDataSheet;
		this.geometryVar = geometryVar;
		this.geometry = topojson.feature(usGeom, usGeom.objects[geometryType]).features;
		this.hasStroke = hasStroke;

		this.currFilterIndex = 0;
		this.currFilterVar = this.filterVars[this.currFilterIndex].variable;

		this.filterGroup = filterVars.length > 1 ? new FilterGroup(vizSettings) : null;

		let mapContainer = d3.select(id)
			.append("div");

		this.svg = mapContainer
			.append("svg")
			.attr("class", "us-states-svg");

		this.tooltip = new Tooltip(id, tooltipVars, null, null);
		let legendSettings = {};
		legendSettings.id = id;
		legendSettings.showTitle = true;
		legendSettings.markerSettings = { shape:"circle", size:10 };
		legendSettings.orientation = "vertical-right";

		this.legend = new Legend(legendSettings);

		this.setDimensions();
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
			this.legend.setOrientation("vertical-right");
		} else {
			this.legend.setOrientation("horizontal-left");
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
		this.processData();
		this.setScale();
		console.log(this.colorScale.domain());
		this.bindDataToGeom();
		this.buildGraph();
		this.setLegend();
		this.filterGroup ? this.setFilterGroup() : null;

		// super.render();
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
		this.colorScale = getColorScale(this.data, this.filterVars[this.currFilterIndex]);
	}


	bindDataToGeom() {
		for (let dataElem of this.data) {
			let dataId = dataElem[this.geometryVar.variable];

			for (let geogElem of this.geometry) {
				if (dataId == geogElem.id) {
					geogElem.data = dataElem;
					break;
				}
			}
		}
		console.log(this.geometry);
	}

	buildGraph() {
		this.paths = this.svg.selectAll("path")
		   .data(this.geometry)
		   .enter()
		   .append("path");

		this.paths.attr("d", this.pathGenerator)
		    .style("fill", (d) => { return this.setFill(d); })
		    .attr("value", function(d,i) { return i; })
		    .style("stroke", "white")
		    .style("stroke-width", this.hasStroke ? "1" : "0")
		    .on("mouseover", (d, index, paths) => { return this.mouseover(d, paths[index], d3.event); })
		    .on("mouseout", (d, index, paths) => { return this.mouseout(paths[index]); });
	}

	setFill(d) {
		if (d.data) {
	   		var value = d.data[this.currFilterVar];
	   		return value ? this.colorScale(value) : "#ccc";
	   	} else {
	   		return "#fff";
	   	}
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

	changeFilter(variableIndex) {
		this.currFilterIndex = variableIndex;
		this.currFilterVar = this.filterVars[this.currFilterIndex].variable;

		this.setScale();
		this.setLegend();
		this.paths.style("fill", (d) => { return this.setFill(d); })
	}

	changeVariableValsShown(valsShown) {
		this.paths
			.style("fill", (d) => {
		   		var value = d.data[this.currFilterVar];
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
		this.tooltip.show(datum.data, mousePos);
	}

	mouseout(path) {
		d3.select(path).style("stroke-width", "1");
	    this.tooltip.hide();
	}
			
}