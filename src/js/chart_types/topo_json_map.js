import $ from 'jquery';

import { Tooltip } from "../components/tooltip.js";
import { Legend } from "../components/legend.js";
import { FilterGroup } from "../components/filter_group.js";

import { colors } from "../helper_functions/colors.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";

import { formatValue, deformatValue } from "../helper_functions/format_value.js";
import { defineFillPattern } from "../helper_functions/define_fill_pattern.js";

import * as global from "./../utilities.js";

let d3 = require("d3");
let topojson = require("topojson");

export class TopoJsonMap {
	constructor(vizSettings) {
		Object.assign(this, vizSettings);

		this.currFilter = this.filterVars[0];
		
		if (this.interaction == "click") { this.currClicked == null}; 

		this.defaultFill = this.defaultFill ? this.defaultFill : "#fff";

		this.setGeometry(this.geometryType);

		if (this.filterGroupSettings && !this.filterGroupSettings.hidden) {
			this.filterGroup = this.filterVars.length > 1 ? new FilterGroup(vizSettings) : null;
		}

		let mapContainer = d3.select(this.id)
			.append("div");

		if (this.zoomable) {
			this.zoomOutPrompt = mapContainer
				.append("div")
				.attr("class", "zoom-out-prompt")
				.text("Return to Full Map")
				.on("click", () => { return this.zoom(null, null, null); });
		}

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
		this.centered = true;
	}

	setGeometry(geometryType) {
		this.geometryPromise = new Promise((resolve, reject) => {
			let filename = geometryType === "world" ? "world.json" : "us.json";
			
			d3.json("https://na-data-projects.s3.amazonaws.com/geography/" + filename, (error, data) => {
				let retGeom;

				if (geometryType == "world") {
					retGeom = topojson.feature(data, data.objects.countries).features;
				} else {
					retGeom = topojson.feature(data, data.objects[geometryType]).features;
				}

				resolve(retGeom);
			})

		})
			
	}

	setDimensions() {
		let containerWidth = $(this.id).width();
		this.w = containerWidth;

		this.h = this.geometryType == "world" ? 2*this.w/5 : 3*this.w/5;

		let translateX = this.w/2;
		let scalingFactor = 5*this.w/4;
		this.smallStateInsetLabelXPos = this.w - this.w/10;

		if (this.legendSettings && this.legendSettings.orientation == "vertical-right") {
			if (containerWidth > global.showLegendBreakpoint) {
				translateX -= global.legendWidth/2;
				this.h = this.w/2;
				scalingFactor = this.w;
				this.legend.setOrientation("vertical-right");
				this.smallStateInsetLabelXPos -= this.w > 900 ? this.w/6 : this.w/5;
			} else {
				this.legend.setOrientation("horizontal-center");
			}
		}

		this.svg
			.attr("height", this.h)
			.attr("width", "100%");

		if (this.smallStateInsetLabel) {
			this.setSmallStateInsetLabelPosition();
		}

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
		this.varDescriptionData = this.varDescriptionSheet ? data[this.varDescriptionSheet] : null;

		this.geometryPromise.then((geometry) => {
			this.geometry = geometry;

			this.setScale();
			this.bindDataToGeom();
			this.buildGraph();
			this.legendSettings ? this.setLegend() : null;
			if (!this.hideFilterGroup) {
				this.filterGroup ? this.setFilterGroup() : null;
			}
		})
		
	}

	setScale() {
		this.colorScale = getColorScale(this.data, this.currFilter);
		if (this.currFilter.format == "number" && this.colorScale.domain()[0] == 0) {
			this.colorScale.domain([1, this.colorScale.domain()[1]])
		}
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

		this.paths.attr("d", (d) => {return this.addSmallStateInsets && d.id == 11 ? this.smallStateCirclePathGenerator() : this.pathGenerator(d)})
		    .style("fill", (d) => { return this.setFill(d); })
		    .style("opacity", ".9")
		    .attr("value", function(d,i) { return i; })
		    .style("stroke", this.stroke.color || "white")
		    .style("stroke-width", this.stroke.width || "1")
		    .style("stroke-opacity", this.stroke.opacity || "1")
		    .style("cursor", this.zoomable || this.interaction == "click" || this.clickToProfile ? "pointer" : "auto")
		    .on("mouseover", (d, index, paths) => { return this.mouseover(d, paths[index], d3.event) })
		    .on("mouseout", (d, index, paths) => { return this.mouseout(paths[index]) })
		    .on("click", (d, index, paths) => {
		    	if (this.zoomable) {
		    		return this.zoom(d, paths[index], d3.event);
		    	} else if (this.interaction == "click") {
		    		return this.clicked(d, paths[index], d3.event);
		    	} else if (this.clickToProfile) {
		    		window.location.href = this.clickToProfile.url + encodeURI(d.data[this.clickToProfile.variable].toLowerCase());
		    	}
		    });

		if (this.addSmallStateInsets) {
			this.smallStateInsetLabel = this.g.append("text")
				.attr("fill", "white")
				.style("alignment-baseline", "middle")
				.style("pointer-events", "none")
				.style("font-weight", "bold")
				.style("text-anchor", "middle")
				.style("font-size", "13px")
				.text("DC");

			this.setSmallStateInsetLabelPosition();
		}
	}

	setFill(d) {
		if (d.data && (d.data[this.currFilter.variable] || d.data[this.currFilter.variable] === 0)) {
	   		var value = d.data[this.currFilter.variable];

	   		if (value == 0) { return this.defaultFill }
	   		if (this.currFilter.canSplitCategory) {
	   			let splitVals = value.split(";");
	   			if (splitVals.length > 1) {
	   				let id = d.data[this.geometryVar.variable];
	   				this.svgDefs = defineFillPattern(splitVals, id, this.colorScale, this.svgDefs, "polygon");
					
	   				return "url(#pattern" + id + ")";
	   			}
	   		}
	   		if (this.currFilter.scaleType == "quantize" || this.currFilter.scaleType == "linear") {
	   			if (isNaN(value)) {
	   				return this.defaultFill;
	   			}
	   		}
	   		return this.colorScale(value);
	   	} else {
	   		return this.defaultFill;
	   	}
	}

	setLegend() {
		this.legendSettings.title = this.currFilter.altLegendTitle || this.currFilter.displayName;
		this.legendSettings.format = this.currFilter.format;
		this.legendSettings.scaleType = this.currFilter.scaleType;
		this.legendSettings.colorScale = this.colorScale;
		this.legendSettings.valChangedFunction = this.changeVariableValsShown.bind(this);
		this.legendSettings.varDescriptionData = this.varDescriptionData;
		this.legendSettings.varDescriptionVariable = this.currFilter.variable;

		this.legend.render(this.legendSettings);
	}

	setFilterGroup() {
		this.filterGroup.render(this.changeFilter.bind(this));
	}

	
	resize() {
		this.setDimensions();
		this.paths.attr("d", (d) => {return this.addSmallStateInsets && d.id == 11 ? this.smallStateCirclePathGenerator() : this.pathGenerator(d)});
		this.legendSettings ? this.legend.resize() : null;
	}

	changeFilter(newFilter) {
		this.currFilter = newFilter;

		this.setScale();
		this.legendSettings ? this.setLegend() : null;
		this.paths.transition().duration(400).style("fill", (d) => { return this.setFill(d); })
			.style("stroke-width", this.stroke.width || "1")

		this.currClicked ? this.mouseout(this.currClicked) : null;
		this.dashboardChangeFunc ? this.dashboardChangeFunc({currFilter: this.currFilter}, this) : null;

	}

	changeValue(newVal) {
		let i = 0;
		let newRange = [];
		for (let value of this.colorScale.domain()) {
			if (Number(value) <= newVal) {
				newRange[i] = this.currFilter.customRange[0];
			} else {
				newRange[i] = "#ccc";
			}
			i++;
		}

		this.colorScale.range(newRange);
		this.paths
			.style("fill", (d) => {
				if (d.data) {
					let value = Number(d.data[this.currFilter.variable]);
					if (value) {
			   			return this.colorScale(value);
			   		}
			   	}
			   	return "#ccc";
		    });
	}

	changeVariableValsShown(valsShown) {
		this.paths
			.transition().duration(500)
			.style("fill", (d) => {
		   		var value = d.data ? d.data[this.currFilter.variable] : null;
		   		if (value) {
		   			// to account for cases where values can be split across multiple categories
		   			let splitVals = value.split(";");
		   			if (splitVals.length > 1) {
		   				let fillColor1 = this.colorScale(splitVals[0].trim()),
		   					fillColor2 = this.colorScale(splitVals[1].trim()),
		   					binIndex1 = this.colorScale.range().indexOf(fillColor1),
		   					binIndex2 = this.colorScale.range().indexOf(fillColor2);
		   				if (valsShown.indexOf(binIndex1) > -1 && valsShown.indexOf(binIndex2) > -1) {
		   					// returns cross-hatch
			   				return this.setFill(d);
			   			} else if (valsShown.indexOf(binIndex1) > -1) {
			   				return fillColor1;
			   			} else if (valsShown.indexOf(binIndex2) > -1) {
			   				return fillColor2;
			   			}
		   			} else {
		   				let fillColor = this.setFill(d)
		   				let binIndex = this.colorScale.range().indexOf(fillColor);
		   				if (valsShown.indexOf(binIndex) > -1) {
			   				return fillColor;
			   			}
		   			}
		   		}
		   		return "#ccc";
		    });
	}

	mouseover(datum, path, eventObject) {
		if (this.mouseoverOnlyIfValue) {
			if (!datum.data || !datum.data[this.currFilter.variable]) {
				return;
			}
		} 
		if (this.currClicked != path) {
			d3.select(path)
				.style("stroke", this.stroke.hoverColor || "white")
				.style("stroke-width", this.stroke.hoverWidth || "3")
				.style("fill-opacity", this.stroke.hoverOpacity || "1");
		}

		if (this.interaction != "click") {
			let mousePos = [];
			mousePos[0] = eventObject.pageX;
			mousePos[1] = eventObject.pageY;
			this.dashboardChangeFunc ? this.dashboardChangeFunc({dataPoint: datum.data, color: d3.select(path).style("fill"), currFilter: this.currFilter}, this) : null;
			
			this.tooltip ? this.tooltip.show(datum.data, mousePos, this.currFilter, d3.select(path).style("fill")) : null;
		}
	}

	mouseout(path) {
		if (this.currClicked != path) {
			d3.select(path)
				.style("stroke", this.stroke.color || "white")
			    .style("stroke-width", this.stroke.width || "1")
			    .style("fill-opacity", this.stroke.opacity || "1")
		}

		if (this.interaction != "click") {
	    	this.tooltip ? this.tooltip.hide() : null;
	    }
	}

	clicked(datum, path, eventObject) {
		if (this.currClicked) {
			d3.select(this.currClicked)
				.style("stroke", this.stroke.color || "white")
			    .style("stroke-width", this.stroke.width || "1")
			    .style("fill-opacity", this.stroke.opacity || "1")
			this.currClicked = null;
		}
		if (datum && (datum.data || datum.data == 0)) {
			d3.select(path)
				.style("stroke", "white")
			    .style("stroke-width", "3");
			this.dashboardChangeFunc ? this.dashboardChangeFunc({dataPoint: datum.data, color: d3.select(path).style("fill"), currFilter: this.currFilter}, this) : null;
			this.currClicked = path
		} else {
			this.dashboardChangeFunc ? this.dashboardChangeFunc({currFilter: this.currFilter}, this) : null;
		}
	}

	smallStateCirclePathGenerator(d) {
		let diameter = 25,
			radius = diameter/2;

		return "M " + this.smallStateInsetLabelXPos + ", " + this.h/2 + "m -" + radius + ", 0a " + radius + "," + radius + " 0 1,0 " + diameter + ",0a " + radius + "," + radius + " 0 1,0 -" + diameter + ",0";
	}

	setSmallStateInsetLabelPosition() {
		this.smallStateInsetLabel
			.attr("transform", "translate(" +  this.smallStateInsetLabelXPos + "," + this.h/2 + ")");
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