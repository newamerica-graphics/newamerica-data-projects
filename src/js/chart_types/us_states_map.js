import $ from 'jquery';

import { Tooltip } from "../components/tooltip.js";
import { Legend } from "../components/legend.js";
import { FilterGroup } from "../components/filter_group.js";
import { Chart } from "../layouts/chart.js"

import { getColorScale } from "../helper_functions/get_color_scale.js";

import { usStates } from '../../geography/us-states.js';

import { formatValue, deformatValue } from "../helper_functions/format_value.js";

import * as global from "./../utilities.js";

let d3 = require("d3");

export class UsStatesMap extends Chart {
	
	constructor(vizSettings) {
		let {id, tooltipVars, filterVars} = vizSettings;
		super(id);

		this.id = id;
		this.filterVars = filterVars;

		this.currFilterIndex = 0;
		this.currFilterVar = this.filterVars[this.currFilterIndex].variable;

		this.filterGroup = new FilterGroup(vizSettings);

		let mapContainer = d3.select(id)
			.append("div");

		this.svg = mapContainer
			.append("svg");

		this.tooltip = new Tooltip(id, "state", tooltipVars)

		this.legend = new Legend(id);

		this.setDimensions();
	}

	setDimensions() {
		this.w = $(this.id).width();
		this.h = this.w/2;

		this.svg
			.attr("width", this.w)
			.attr("height", this.h);

		let translateX = this.w/2;

		this.w > global.showLegendBreakpoint ? translateX -= global.legendWidth/2 : null;
		//Define map projection
		let projection = d3.geoAlbersUsa()
				.scale(this.w)
				.translate([translateX, this.h/2]);

		//Define path generator
		this.pathGenerator = d3.geoPath()
						 .projection(projection);
	}

	render(data) {	

		console.log(this.paths);
		this.data = data;
		this.processData();
		this.setScale();
		this.bindDataToGeom();
		this.buildGraph();
		this.setLegend();
		this.setFilterGroup();

		super.render();

		console.log(this.paths);
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
		let colorScaleSettings = {};

		colorScaleSettings.scaleType = this.filterVars[this.currFilterIndex].scaleType;
		colorScaleSettings.color = this.filterVars[this.currFilterIndex].color;
		colorScaleSettings.numBins = this.filterVars[this.currFilterIndex].numBins;

		colorScaleSettings.dataMin = Number(d3.min(this.data, (d) => { return d[this.currFilterVar] ? Number(d[this.currFilterVar]) : null; })); 
		colorScaleSettings.dataMax = Number(d3.max(this.data, (d) => { return d[this.currFilterVar] ? Number(d[this.currFilterVar]) : null; }));
		this.colorScale = getColorScale(colorScaleSettings);
	}


	bindDataToGeom() {
		let data = this.data;

		for (let elem of data) {
			let dataState = elem.state;

			for (let state of usStates.features) {
				if (dataState == state.properties.name) {
					state.properties = elem;
					break;
				}
			}
		}
	}

	buildGraph() {
		this.paths = this.svg.selectAll("path")
		   .data(usStates.features)
		   .enter()
		   .append("path");

		this.paths.attr("d", this.pathGenerator)
			.classed("map-feature", true)
		    .style("fill", (d) => {
		   		var value = d.properties[this.currFilterVar];
		   		return value ? this.colorScale(value) : "#ccc";
		    })
		    .attr("value", function(d,i) { return i; })
		    .style("stroke", "white")
		    .on("mouseover", (d, index, paths) => { return this.mouseover(d, paths[index]); })
		    .on("mouseout", (d, index, paths) => { return this.mouseout(paths[index]); });
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
		this.paths
			.style("fill", (d) => {
		   		var value = d.properties[this.currFilterVar];
		   		return value ? this.colorScale(value) : "#ccc";
		    })
	}

	changeVariableValsShown(valsShown) {
		console.log(valsShown);
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

	mouseover(datum, path) {
		d3.select(path).style("stroke-width", "3");
		console.log(path);
		let mousePos = d3.mouse(path);
		console.log(mousePos);
		this.tooltip.show(datum.properties, mousePos);
	}

	mouseout(path) {
		d3.select(path).style("stroke-width", "1");
	    this.tooltip.hide();
	}
			
}