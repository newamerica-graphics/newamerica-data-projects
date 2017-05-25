import $ from 'jquery';

import { Tooltip } from "../components/tooltip.js";
import { Legend } from "../components/legend.js";
import { FilterGroup } from "../components/filter_group.js";

import { colors } from "../helper_functions/colors.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";

import { usGeom } from '../../geometry/us.js';
import { worldGeom } from '../../geometry/world.js';

import { formatValue, deformatValue } from "../helper_functions/format_value.js";
import { defineFillPattern } from "../helper_functions/define_fill_pattern.js";

import * as global from "./../utilities.js";

let d3 = require("d3");
let topojson = require("topojson");

export class PinDropMap {
	constructor(vizSettings) {
		Object.assign(this, vizSettings);
		
		this.currFilterIndex = 0;
		this.currFilterVar = this.filterVars[this.currFilterIndex].variable;

		this.setGeometry(this.geometryType);

		if (this.filterGroupSettings && !this.filterGroupSettings.hidden) {
			this.filterGroup = this.filterVars.length > 1 ? new FilterGroup(vizSettings) : null;
		}

		let mapContainer = d3.select(this.id)
			.append("div");

		this.svg = mapContainer
			.append("svg")
			.attr("class", "us-states-svg");

		this.g = this.svg.append("g");

		if (this.tooltipVars) {
			let tooltipSettings = { "id":this.id, "tooltipVars":this.tooltipVars, "showOnlyVars":this.tooltipShowOnly, "highlightActive": true }

			this.tooltip = new Tooltip(tooltipSettings);
		}

		if (this.legendSettings) {
			this.legendSettings.id = this.id;
			this.legendSettings.markerSettings = { shape:"circle", size:10 };

			this.legend = new Legend(this.legendSettings);
		}

		this.svgDefs = this.svg.append("defs");

		this.setDimensions();
	}

	setGeometry(geometryType) {
		if (geometryType == "world") {
			this.geometry = topojson.feature(worldGeom, worldGeom.objects.countries).features;
		} else {
			this.geometry = topojson.feature(usGeom, usGeom.objects[geometryType]).features;
		}
	}

	setDimensions() {
		let containerWidth = $(this.id).width();
		console.log(containerWidth);
		console.log(global.showLegendBreakpoint);
		this.w = containerWidth;

		this.h = this.geometryType == "world" ? 2*this.w/5 : 3*this.w/5;

		let translateX = this.w/2;
		let scalingFactor = 5*this.w/4;

		if (this.legendSettings && this.legendSettings.orientation == "vertical-right") {
			if (containerWidth > global.showLegendBreakpoint) {
				translateX -= global.legendWidth/2;
				this.h = this.w/2;
				scalingFactor = this.w;
				this.legend.setOrientation("vertical-right");
			} else {
				this.legend.setOrientation("horizontal-center");
			}
		}

		this.svg
			.attr("height", this.h)
			.attr("width", "100%");

		//Define map projection
		this.projection = this.setProjection(scalingFactor, translateX);

		//Define path generator
		this.pathGenerator = d3.geoPath()
						 .projection(this.projection);
	}

	setProjection(scalingFactor, translateX) {
		if (this.geometryType == "world") {
			this.g.attr("transform", "translate(0, " + this.h/12 + ")");
			return d3.geoEquirectangular()
				.scale(this.w/6.5)
				.rotate([-12,0])
			    .translate([translateX, this.h/2]);
		} else {
			return d3.geoAlbersUsa()
				.scale(scalingFactor)
				.translate([translateX, this.h/2]);
		}
	}

	render(data) {
		this.data = data[this.primaryDataSheet];
		this.varDescriptionData = this.varDescriptionSheet ? data[this.varDescriptionSheet] : null;

		this.setScale();

		this.buildGraph();
		this.legendSettings ? this.setLegend() : null;
		this.filterGroup ? this.setFilterGroup() : null;
	}

	setScale() {
		this.colorScale = getColorScale(this.data, this.filterVars[this.currFilterIndex]);
	}

	buildGraph() {
		this.paths = this.g.selectAll("path")
		   .data(this.geometry)
		   .enter()
		   .append("path");

		this.paths
			.attr("d", (d) => { return this.pathGenerator(d) })
		    .style("fill", colors.grey.medium_light)
		    .style("stroke", this.stroke.color || "white")
		    .style("stroke-width", this.stroke.width || "1")
		    .style("stroke-opacity", this.stroke.opacity || "1")
		    .style("cursor", this.zoomable ? "pointer" : "auto")
		    .on("click", (d, index, paths) => {
		    	if (this.zoomable) {
		    		return this.zoom(d, paths[index], d3.event);
		    	}
		    });

		this.points = this.g.selectAll("circle")
			.data(this.data).enter()
			.append("circle")
			.attr("cx", (d) => { return this.projection([d.long, d.lat])[0]; })
			.attr("cy", (d) => { return this.projection([d.long, d.lat])[1]; })
			.attr("r", "5.5px")
			.attr("fill", (d) => { return this.setFill(d); })
			.attr("stroke", "white")
			.attr("stroke-width", "1px")
			.on("mouseover", (d, index, paths) => { return this.mouseover(d, paths[index], d3.event)})
		    .on("mouseout", () => { return this.mouseout(); })
	}

	setLegend() {
		this.legendSettings.title = this.filterVars[this.currFilterIndex].displayName;
		this.legendSettings.format = this.filterVars[this.currFilterIndex].format;
		this.legendSettings.scaleType = this.filterVars[this.currFilterIndex].scaleType;
		this.legendSettings.colorScale = this.colorScale;
		this.legendSettings.valChangedFunction = this.changeVariableValsShown.bind(this);
		this.legendSettings.varDescriptionData = this.varDescriptionData;
		this.legendSettings.varDescriptionVariable = this.filterVars[this.currFilterIndex].variable;

		this.legend.render(this.legendSettings);
	}

	setFilterGroup() {
		this.filterGroup.render(this.changeFilter.bind(this));
	}
	
	resize() {
		this.setDimensions();
		this.paths.attr("d", (d) => { return this.pathGenerator(d) });

		this.points
			.attr("cx", (d) => { return this.projection([d.long, d.lat])[0]; })
			.attr("cy", (d) => { return this.projection([d.long, d.lat])[1]; });

		this.legendSettings ? this.legend.resize() : null;
	}

	changeFilter(variableIndex) {
		this.currFilterIndex = variableIndex;
		this.currFilterVar = this.filterVars[this.currFilterIndex].variable;

		this.setScale();
		this.legendSettings ? this.setLegend() : null;
		this.points.style("fill", (d) => { return this.setFill(d); })
	}

	mouseover(datum, path, eventObject) {
		let mousePos = [];
		mousePos[0] = eventObject.pageX;
		mousePos[1] = eventObject.pageY;
		
		this.points
			.attr("stroke-width", (d) => { return datum == d ? "2px" : "1px"})
		
		this.tooltip ? this.tooltip.show(datum, mousePos, this.filterVars[this.currFilterIndex], d3.select(path).style("fill")) : null;
	}

	mouseout(path) {
	    this.tooltip ? this.tooltip.hide() : null;
	    this.points
			.attr("stroke-width", "1px")
	}

	changeVariableValsShown(valsShown) {
		this.points
			.style("display", (d) => {
		   		let value = d ? d[this.currFilterVar] : null;
		   		if (value) {
		   			// to account for cases where values can be split across multiple categories
		   			let splitVals = value.split(";");
		   			if (splitVals.length > 1) {
		   				let fillColor1 = this.colorScale(splitVals[0].trim()),
		   					fillColor2 = this.colorScale(splitVals[1].trim()),
		   					binIndex1 = this.colorScale.range().indexOf(fillColor1),
		   					binIndex2 = this.colorScale.range().indexOf(fillColor2);
		   				if (valsShown.indexOf(binIndex1) > -1 || valsShown.indexOf(binIndex2) > -1) {
			   				return "block";
			   			}
		   			} else {
		   				let fillColor = this.colorScale(splitVals[0].trim())
		   				let binIndex = this.colorScale.range().indexOf(fillColor);
		   				if (valsShown.indexOf(binIndex) > -1) {
			   				return "block";
			   			}
		   			}
		   		}
		   		return "none";
		    });
	}

	setFill(d) {
		if (d && d[this.currFilterVar]) {
	   		let value = d[this.currFilterVar];
	   		if (this.filterVars[this.currFilterIndex].canSplitCategory) {
	   			let splitVals = value.split(";");
	   			if (splitVals.length > 1) {
	   				let id = Math.round(Math.random() * 10000);
	   				this.svgDefs = defineFillPattern(splitVals, id, this.colorScale, this.svgDefs, "point");
	   				return "url(#pattern" + id + ")";
	   			}
	   		}
	   		return this.colorScale(value);
	   	} else {
	   		return colors.grey.medium_light;
	   	}
	}

	zoom(datum, path, eventObject) {
		let x, y, k;

		if (datum && this.centered !== datum) {
			let centroid = this.pathGenerator.centroid(datum);
			x = centroid[0];
			y = centroid[1];
			k = 4;
			this.centered = datum;
			this.zoomOutPrompt.style("display", "block");
		} else {
			x = this.w / 2;
			y = this.h / 2;
			k = 1;
			this.centered = null;
			this.zoomOutPrompt.style("display", "none");
		}

		this.g.selectAll("path")
		  .classed("active", this.centered && function(d) { return d === this.centered; });

		this.g.transition()
		  .duration(750)
		  .attr("transform", "translate(" + this.w / 2 + "," + this.h / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
		  .style("stroke-width", 1.5 / k + "px")
		  .on("end", () => { return this.centered ? this.tooltip.show(datum.data, [this.w / 2 + 30, this.h / 2]) : null; })

	}
			
}