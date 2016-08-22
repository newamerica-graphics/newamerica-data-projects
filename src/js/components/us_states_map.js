import $ from 'jquery';

import { Tooltip } from "./tooltip.js";
import { Legend } from "./legend.js";

import { getColorScale } from "./get_color_scale.js";

import { usStates } from '../../geography/us-states.js';

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
		console.log("in initial render");
		
		this.data = data;
		this.setScale();
		this.bindDataToGeom();
		this.buildGraph();

		this.setLegend();

		// let table = new Table("#test1", this.data);

		console.log("finished rendering");
	}

	setScale() {
		console.log(this.data);
		dataMin = Number(d3.min(this.data, function(d) { return d[currFilterVar]; })); 
		dataMax = Number(d3.max(this.data, function(d) { return d[currFilterVar]; }));

		colorScale = getColorScale(filterVars[currFilterIndex], dataMin, dataMax);
		// colorScale.domain([dataMin, dataMax]);
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
		    .style("fill", (d) => {
		   		var value = d.properties[currFilterVar];
		   		return value ? colorScale(value) : "#ccc";
		    })
		    .on("mouseover", this.mouseover)
		    .on("mouseout", this.mouseout);
	}

	setLegend() {
		let currFilterDisplayName = filterVars[currFilterIndex].displayName;
		legend.setScale(currFilterDisplayName, dataMin, dataMax, colorScale);
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
		d3.select(this).style("fill", "orange");
		let mousePos = d3.mouse(this);
		tooltip.show(d.properties, mousePos);
		// this.tooltip
		// 	.classed('hidden', false)
  //           .attr('style', 'left:' + (mouse[0] + 15) + 'px; top:' + (mouse[1] - 35) + 'px');
	}

	mouseout() {
		d3.select(this).style("fill", function(d) {
	   		var value = d.properties[currFilterVar];
	   		return value ? colorScale(value) : "#ccc";
	    });
	    tooltip.hide();
	}

	toggleVisibility() {
		console.log("toggling visibility of map!");
		$(id).toggle();
	}
			
}