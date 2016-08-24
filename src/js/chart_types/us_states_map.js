import $ from 'jquery';

import { Tooltip } from "../components/tooltip.js";
import { Legend } from "../components/legend.js";

import { getColorScale } from "../helper_functions/get_color_scale.js";

import { usStates } from '../../geography/us-states.js';

import { formatValue, deformatValue } from "../helper_functions/format_value.js";

import * as global from "./../utilities.js";

let d3 = require("d3");

let svg, w, h;
let id, currFilterIndex, currFilterVar, tooltipVars, filterVars;
let colorScale, tooltip, legend, geometry, dataMin, dataMax, paths;

export class UsStatesMap {
	
	constructor(vizSettings) {
		({id, tooltipVars, filterVars} = vizSettings);
		currFilterIndex = 0;
		currFilterVar = filterVars[currFilterIndex].variable;

		

		svg = d3.select(id)
			.append("svg");



		tooltip = new Tooltip(id, "state", tooltipVars)

		legend = new Legend(id);

		this.setDimensions();
	}

	setDimensions() {
		w = $(id).width();
		h = w/2;

		svg
			.attr("width", w)
			.attr("height", h);

		let translateX = w/2;

		w > global.showLegendBreakpoint ? translateX -= global.legendWidth/2 : null;
		//Define map projection
		let projection = d3.geoAlbersUsa()
				.scale(w)
				.translate([translateX, h/2]);

		//Define path generator
		this.pathGenerator = d3.geoPath()
						 .projection(projection);
	}

	render(data) {	
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
		paths = svg.selectAll("path")
		   .data(usStates.features)
		   .enter()
		   .append("path");

		paths.attr("d", this.pathGenerator)
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
		legend.render(currFilterDisplayName, currFilterFormat, colorScale, this.changeVariableValsShown);
	}

	
	resize() {
		this.setDimensions();
		paths.attr("d", this.pathGenerator);
	}

	changeFilter(newVarIndex) {
		currFilterIndex = newVarIndex;
		currFilterVar = filterVars[currFilterIndex].variable;

		this.setScale();
		this.setLegend();
		paths
			.style("fill", (d) => {
		   		var value = d.properties[currFilterVar];
		   		return value ? colorScale(value) : "#ccc";
		    })
	}

	changeVariableValsShown(valsShown) {
		console.log(valsShown);
		paths
			.style("fill", (d) => {
		   		var value = d.properties[currFilterVar];
		   		if (value) {
		   			let binIndex = colorScale.range().indexOf(colorScale(value));
		   			if (valsShown.indexOf(binIndex) > -1) {
		   				return colorScale(value);
		   			}
		   		}
		   		return "#ccc";
		    });
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
		$(id).toggle();
	}
			
}