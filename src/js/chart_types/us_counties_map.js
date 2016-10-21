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

let minYear = "1996";
let maxYear = "2016";

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

		this.tooltip = new Tooltip(id, tooltipVars, null, null, false);
		let legendSettings = {};
		legendSettings.id = id;
		legendSettings.showTitle = true;
		legendSettings.markerSettings = { shape:"circle", size:10 };
		legendSettings.orientation = "vertical-right";

		this.legend = new Legend(legendSettings);

		this.currFilterVar = filterVars[0];

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
		this.secondaryData = data[this.secondaryDataSheet];
	    this.secondaryDataByYear = d3.nest()
	      .key((d) => {return d["year"];})
	      .map(data[this.secondaryDataSheet]);

		this.usCountiesTopoJson = topojson.feature(usGeom, usGeom.objects.counties).features;
		this.bindDataToGeom();
		this.setScale();
		this.buildGraph();
		this.setLegend();
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

		let colorScaleSettings = {};
		colorScaleSettings.scaleType = "linear";
		colorScaleSettings.variable = this.currYear;
		colorScaleSettings.customDomain = [0, dataMax];
		colorScaleSettings.customRange = [colors.white, colors.red.light];

		this.colorScale = getColorScale(this.data, colorScaleSettings);

	    this.eventColorScale = getColorScale(this.secondaryData, this.currFilterVar);
	    this.valsShown = [];
	    for (let i = 0; i < this.eventColorScale.domain().length; i++) {
	    	this.valsShown.push(i);
	    }
	   
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
	      .attr("fill", (d) => { return d.data ? this.setFill(d.data) : "#fff"; })
	      .attr("stroke", colors.grey.dark)
	      .attr("stroke-width", .3)
	      .attr("d", this.pathGenerator)
	      .on("mouseover", (d, index, paths) => { return this.mouseover(d, paths[index], d3.event); })
		  .on("mouseout", (d, index, paths) => { return this.mouseout(paths[index]); });

		// this.svg.append("path")
		// 	.datum(topojson.mesh(usGeom, usGeom.objects.states, function(a, b) { return a !== b; }))
		// 	.attr("class", "states")
		// 	.attr("d", this.pathGenerator);
	}

	changeFilter(value) {
	    this.currYear = value;
	    this.changeVariableValsShown(this.valsShown);
	    // this.paths
	    //   .attr("fill", (d) => { return d.data ? this.setFill(d.data) : "#fff"; });
	}

	setLegend() {
		let legendSettings = {};

		legendSettings.title = this.currFilterVar.displayName;
		legendSettings.format = this.currFilterVar.format;
		legendSettings.scaleType = this.currFilterVar.scaleType;
		legendSettings.colorScale = this.eventColorScale;
		legendSettings.valChangedFunction = this.changeVariableValsShown.bind(this);

		this.legend.render(legendSettings);
	}

	
	resize() {
		this.setDimensions();
		this.paths.attr("d", this.pathGenerator);
	}

	setFill(data) {
	    let fips = data.fips;
	    let currYearEvents = this.secondaryDataByYear.get(this.currYear);

	    for (let yearEvent of currYearEvents) {
	      let fipsArray = yearEvent.county_fips.split(", ");
	      if (fipsArray.indexOf(fips) >= 0) {
	      	let binIndex = this.eventColorScale.domain().indexOf(yearEvent.event_category);
			if (this.valsShown.indexOf(binIndex) > -1) {
	        	return this.eventColorScale(yearEvent.event_category);
	        }
	      }
	    }
	    return "#fff";

	    // to show cumulative values
	    // return this.colorScale(data[this.currYear]);

	}

  
	changeVariableValsShown(valsShown) {
		console.log(valsShown);
		this.valsShown = valsShown;
		this.paths
			.style("fill", (d) => { return d.data ? this.setFill(d.data) : "#fff"; });
	}

	mouseover(datum, path, eventObject) {
		d3.select(path).style("stroke-width", "2");

		console.log(datum);

		let mousePos = [];
		mousePos[0] = eventObject.pageX;
		mousePos[1] = eventObject.pageY;

		let currYearEvents = this.secondaryDataByYear.get(this.currYear);

	    for (let yearEvent of currYearEvents) {
	      let fipsArray = yearEvent.county_fips.split(", ");
	      if (fipsArray.indexOf(String(this.zeroPad(datum.id, 5))) >= 0) {
	      	this.tooltip.show(yearEvent, mousePos);
	      }
	    }
	}

	mouseout(path) {
		d3.select(path).style("stroke-width", ".3");
	    this.tooltip.hide();
	}

	zeroPad(n, digits, z) {
	  z = z || '0';
	  n = n + '';
	  return n.length >= digits ? n : new Array(digits - n.length + 1).join(z) + n;
	}
			
}