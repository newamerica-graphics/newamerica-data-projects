import $ from 'jquery';

import { Tooltip } from "../components/tooltip.js";
import { Legend } from "../components/legend.js";
import { FilterGroup } from "../components/filter_group.js";

import { colors } from "../helper_functions/colors.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";

import { usGeom } from '../../geometry/us.js';
import { worldGeom } from '../../geometry/world.js';

import { formatValue, deformatValue } from "../helper_functions/format_value.js";

import * as global from "./../utilities.js";

let d3 = require("d3");
let topojson = require("topojson");

export class TopoJsonMap {
	constructor(vizSettings) {
		let {id, tooltipVars, filterVars, primaryDataSheet, geometryVar, geometryType, stroke, legendSettings, filterGroupSettings, zoomable, defaultFill } = vizSettings;

		this.id = id;
		this.filterVars = filterVars;
		this.primaryDataSheet = primaryDataSheet;
		this.geometryType = geometryType;
		this.geometryVar = geometryVar;
		this.stroke = stroke;
		this.legendSettings = legendSettings;
		this.filterGroupSettings = filterGroupSettings;
		this.currFilterIndex = 0;
		this.currFilterVar = this.filterVars[this.currFilterIndex].variable;
		this.zoomable = zoomable;

		this.defaultFill = defaultFill ? defaultFill : "#fff";

		this.setGeometry(geometryType);

		if (filterGroupSettings && !filterGroupSettings.hidden) {
			this.filterGroup = filterVars.length > 1 ? new FilterGroup(vizSettings) : null;
		}

		let mapContainer = d3.select(id)
			.append("div");

		if (zoomable) {
			this.zoomOutPrompt = mapContainer
				.append("div")
				.attr("class", "zoom-out-prompt")
				.text("Return to Full Map")
				.on("click", () => { return this.clicked(null, null, null); });
		}

		this.svg = mapContainer
			.append("svg")
			.attr("class", "us-states-svg");

		this.g = this.svg.append("g");

		let tooltipSettings = { "id":id, "tooltipVars":tooltipVars }

		this.tooltip = new Tooltip(tooltipSettings);

		if (legendSettings) {
			this.legendSettings.id = id;
			this.legendSettings.markerSettings = { shape:"circle", size:10 };

			this.legend = new Legend(legendSettings);
		}
		this.setDimensions();
		this.centered = true;
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
				this.legend.setOrientation("horizontal-left");
			}
		}

		this.svg
			.attr("height", this.h)
			.attr("width", "100%");

		//Define map projection
		let projection = this.setProjection(scalingFactor, translateX);

		//Define path generator
		this.pathGenerator = d3.geoPath()
						 .projection(projection);
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

		// this.processData();
		this.setScale();
		this.bindDataToGeom();
		this.buildGraph();
		this.legendSettings ? this.setLegend() : null;
		if (!this.hideFilterGroup) {
			this.filterGroup ? this.setFilterGroup() : null;
		}
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

	}

	buildGraph() {
		this.paths = this.g.selectAll("path")
		   .data(this.geometry)
		   .enter()
		   .append("path");

		this.paths.attr("d", this.pathGenerator)
		    .style("fill", (d) => { return this.setFill(d); })
		    .style("opacity", ".9")
		    .attr("value", function(d,i) { return i; })
		    .style("stroke", this.stroke.color || "white")
		    .style("stroke-width", this.stroke.width || "1")
		    .style("stroke-opacity", this.stroke.opacity || "1")
		    .style("cursor", this.zoomable ? "pointer" : "auto")
		    .on("mouseover", (d, index, paths) => { return this.mouseover(d, paths[index], d3.event); })
		    .on("mouseout", (d, index, paths) => { return this.mouseout(paths[index]); })
		    .on("click", (d, index, paths) => { return this.zoomable ? this.clicked(d, paths[index], d3.event) : null; });
	}

	setFill(d) {
		if (d.data) {
	   		var value = d.data[this.currFilterVar];
	   		return value ? this.colorScale(value) : this.defaultFill;
	   	} else {
	   		return this.defaultFill;
	   	}
	}

	setLegend() {
		this.legendSettings.title = this.filterVars[this.currFilterIndex].displayName;
		this.legendSettings.format = this.filterVars[this.currFilterIndex].format;
		this.legendSettings.scaleType = this.filterVars[this.currFilterIndex].scaleType;
		this.legendSettings.colorScale = this.colorScale;
		this.legendSettings.valChangedFunction = this.changeVariableValsShown.bind(this);

		this.legend.render(this.legendSettings);
	}

	setFilterGroup() {
		this.filterGroup.render(this.changeFilter.bind(this));
	}

	
	resize() {
		this.setDimensions();
		this.paths.attr("d", this.pathGenerator);
		this.legendSettings ? this.legend.resize() : null;
	}

	changeFilter(variableIndex) {
		this.currFilterIndex = variableIndex;
		this.currFilterVar = this.filterVars[this.currFilterIndex].variable;

		this.setScale();
		this.legendSettings ? this.setLegend() : null;
		this.paths.style("fill", (d) => { return this.setFill(d); })
	}

	changeValue(newVal) {
		let i = 0;
		let newRange = [];
		for (let value of this.colorScale.domain()) {
			if (Number(value) <= newVal) {
				newRange[i] = colors.turquoise.light;
			} else {
				newRange[i] = "#ccc";
			}
			i++;
		}

		this.colorScale.range(newRange);
		this.paths
			.style("fill", (d) => {
				if (d.data) {
					let value = Number(d.data[this.currFilterVar]);
			   		return this.colorScale(value);
			   	}
			   	return "#ccc";
		    });
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
		d3.select(path)
			.style("stroke", this.stroke.hoverColor || "white")
			.style("stroke-width", this.stroke.hoverWidth || "3")
			.style("stroke-opacity", this.stroke.hoverOpacity || "1");
		
		let mousePos = [];
		mousePos[0] = eventObject.pageX;
		mousePos[1] = eventObject.pageY;
		this.tooltip.show(datum.data, mousePos);
	}

	mouseout(path) {
		d3.select(path)
			.style("stroke", this.stroke.color || "white")
		    .style("stroke-width", this.stroke.width || "1")
		    .style("stroke-opacity", this.stroke.opacity || "1")
	    this.tooltip.hide();
	}

	clicked(datum, path, eventObject) {
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