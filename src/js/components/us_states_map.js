import $ from 'jquery';

import { Tooltip } from "./tooltip.js";
import { Legend } from "./legend.js"; 

import { getColorScale } from "./get_color_scale.js";

import { usStates } from '../../geography/us-states.js';

let d3 = require("d3");

let id, dataUrl, colorVar, tooltipVars, filterVars;
let colorScale, tooltip, legend, geometry, dataMin, dataMax;


export class UsStatesMap {
	
	constructor(projectVars) {
		({id, dataUrl, colorVar, tooltipVars, filterVars} = projectVars);

		this.w = $(id).width();

		this.svg = d3.select(id)
					.append("svg");

		tooltip = new Tooltip(id, "state", tooltipVars)

		legend = new Legend(id);

		this.setDimensions(this.w);
	}

	setDimensions(w) {
		console.log(w);
		this.w = w;
		this.h = w/2;

		this.svg
			.attr("width", this.w)
			.attr("height", this.h);

		//Define map projection
		let projection = d3.geoAlbersUsa()
				.scale(this.w)
				.translate([this.w/2, this.h/2]);

		//Define path generator
		this.pathGenerator = d3.geoPath()
						 .projection(projection);
	}

	initialRender() {
		console.log("in initial render");
		
		d3.json(dataUrl, (d) => {
			this.data = d.Sheet1;
			this.setScale();
			this.bindDataToGeom();
			this.buildGraph();

			this.setLegend();

			console.log("finished rendering");
		});
	}

	setScale() {
		console.log("data is ")
		console.log(this.data);

		dataMin = Number(d3.min(this.data, function(d) { return d[colorVar]; })); 
		dataMax = Number(d3.max(this.data, function(d) { return d[colorVar]; }));

		colorScale = getColorScale("quantize", 5, "blue");
		colorScale.domain([dataMin, dataMax]);
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
		   		var value = d.properties[colorVar];
		   		return value ? colorScale(value) : "#ccc";
		    })
		    .on("mouseover", this.mouseover)
		    .on("mouseout", this.mouseout);
	}

	setLegend() {
		legend.setScale(dataMin, dataMax, colorScale);
	}

	
	resize(w) {
		this.setDimensions(w);
		this.paths.attr("d", this.pathGenerator);
	}

	changeFilter(newVar) {
		colorVar = newVar;
		this.setScale();
		this.setLegend();
		this.paths
			.style("fill", (d) => {
		   		var value = d.properties[colorVar];
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
	   		var value = d.properties[colorVar];
	   		return value ? colorScale(value) : "#ccc";
	    });
	    tooltip.hide();
	}
			
}