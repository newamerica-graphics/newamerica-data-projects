import $ from 'jquery';

import { Tooltip } from "./tooltip.js";
import { Legend } from "./legend.js";

import { getColorScale } from "./get_color_scale.js";

import { usStates } from '../../geography/us-states.js';

import { formatValue, deformatValue } from "./format_value.js";

import * as global from "./../utilities.js";

let d3 = require("d3");

let id, currFilterIndex, currFilterVar, tooltipVars, filterVars;
let colorScale, tooltip, legend, geometry, dataMin, dataMax;

export class UsStatesMap {
	
	constructor(divId, projectVars) {
		id = divId;
		({tooltipVars, filterVars} = projectVars);
		currFilterIndex = 0;
		currFilterVar = filterVars[currFilterIndex].variable;

		this.svg = d3.select(id)
					.append("svg");

		tooltip = new Tooltip(id, "state", tooltipVars)

		legend = new Legend(id);

		this.setDimensions($(id).width());
	}

	setDimensions(w) {
		this.w = w;
		this.h = w/2;

		this.svg
			.attr("width", this.w)
			.attr("height", this.h);

		let translateX = this.w/2;

		w > global.showLegendBreakpoint ? translateX -= global.legendWidth/2 : null;
		//Define map projection
		let projection = d3.geoAlbersUsa()
				.scale(this.w)
				.translate([translateX, this.h/2]);

		//Define path generator
		this.pathGenerator = d3.geoPath()
						 .projection(projection);
	}

	initialRender(data) {	
		this.data = data;
		console.log(this.data);
		this.processData();
		this.setScale();
		this.bindDataToGeom();
		this.buildGraph();
		this.setLegend();
	}

	processData() {
		for (let variable of filterVars) {
			for (let d of this.data) {
				if (d[variable.variable]) {
					d[variable.variable] = deformatValue(d[variable.variable]);
				}
			}
		}
	}

	setScale() {
		dataMin = Number(d3.min(this.data, function(d) { return d[currFilterVar] ? d[currFilterVar] : null; })); 
		dataMax = Number(d3.max(this.data, function(d) { return d[currFilterVar] ? d[currFilterVar] : null; }));

		colorScale = getColorScale(filterVars[currFilterIndex], dataMin, dataMax);
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
		   		var value = d.properties[currFilterVar];
		   		return value ? colorScale(value) : "#ccc";
		    })
		    .style("stroke", "white")
		    .on("mouseover", this.mouseover)
		    .on("mouseout", this.mouseout);
	}

	setLegend() {
		let currFilterDisplayName = filterVars[currFilterIndex].displayName;
		let currFilterFormat = filterVars[currFilterIndex].format;
		legend.render(currFilterDisplayName, currFilterFormat, colorScale);
	}

	
	resize(w) {
		this.setDimensions(w);
		this.paths.attr("d", this.pathGenerator);
	}

	changeFilter(newVarIndex) {
		currFilterIndex = newVarIndex;
		currFilterVar = filterVars[currFilterIndex].variable;

		this.setScale();
		this.setLegend();
		this.paths
			.style("fill", (d) => {
		   		var value = d.properties[currFilterVar];
		   		return value ? colorScale(value) : "#ccc";
		    })
	}

	mouseover(d) {
		d3.select(this).style("stroke-width", "3");
		let mousePos = d3.mouse(this);
		tooltip.show(d.properties, mousePos);
		// this.tooltip
		// 	.classed('hidden', false)
  //           .attr('style', 'left:' + (mouse[0] + 15) + 'px; top:' + (mouse[1] - 35) + 'px');
	}

	mouseout() {
		d3.select(this).style("stroke-width", "1");
	    tooltip.hide();
	}

	toggleVisibility() {
		console.log("toggling visibility of map!");
		$(id).toggle();
	}
			
}