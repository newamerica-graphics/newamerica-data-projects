import $ from 'jquery';

let d3 = require("d3");

import { Chart } from "../layouts/chart.js";
import { Legend } from "../components/legend.js";

import { colors } from "../helper_functions/colors.js";

import { getColorScale } from "../helper_functions/get_color_scale.js";

import { Tooltip } from "../components/tooltip.js"; 

let dotW = 10;
let dotOffset = 3;
let splitDistance = 3; //number of dots between split components

export class DotMatrix extends Chart {
	constructor(vizSettings, imageFolderId) {
		let {id, orientation, tooltipVars, tooltipImageVar, filterVars, dotsPerRow, isSubComponent, tooltip, colorScale, split} = vizSettings;
		
		super(id, isSubComponent);

		this.id = id;
		this.orientation = orientation;
		this.dotsPerRow = dotsPerRow;
		this.isSubComponent = isSubComponent;
		this.split = split;

		if (isSubComponent) {
			this.svg = d3.select(id)
				.append("svg")
				.attr("width", "100%");

			this.tooltip = tooltip;
			this.colorScale = colorScale;

		} else {
			let chartContainer = d3.select(id)
				.append("div")
				.attr("class", "chart-wrapper");

			this.svg = chartContainer
				.append("svg")
				.attr("width", "100%");

			this.tooltip = new Tooltip(id, tooltipVars, tooltipImageVar, imageFolderId);

			let legendSettings = {};
			legendSettings.id = id;
			legendSettings.showTitle = false;
			legendSettings.markerSettings = { shape:"rect", size:dotW };
			legendSettings.orientation = "horizontal-center";
			this.legend = new Legend(legendSettings);
		}

		this.currFilter = filterVars[0];
		this.currFilterVar = filterVars[0].variable;

	}

	render(data) {
		// console.log("rendering");
		this.data = this.processData(data);
		this.setDimensions();
		this.sortData();
		if (!this.isSubComponent) {
			this.setScale();
		}
		this.buildGraph();
		
		if (!this.isSubComponent) {
			this.setLegend();
			super.render();
		}
		
	}

	processData(data) {
		data = data.filter((d) => { return d[this.currFilterVar] != null });
		// console.log(this.currFilterVar);
		if (this.currFilter.scaleType === "linear") {
			for (var d of data) {
				if(!$.isNumeric(d[this.currFilterVar])) {
					d[this.currFilterVar] = null;
				}
			}

		} else if (this.currFilter.scaleType == "categorical") {
			for (var d of data) {
				// removes leading and trailing whitespace
				d[this.currFilterVar] ? d[this.currFilterVar] = d[this.currFilterVar].trim() : null;
			}
		}

		this.dataLength = data.length;

		return data;
	}

	sortData() {
		if (this.currFilter.scaleType === "linear") {
			this.data.sort((a, b) => { return a[this.currFilterVar] - b[this.currFilterVar];});
		} else if (this.currFilter.scaleType == "categorical") {
			if (this.currFilter.customDomain) {
				this.data.sort((a, b) => {
					let elem1 = this.currFilter.customDomain.indexOf(a[this.currFilterVar]);
					let elem2 = this.currFilter.customDomain.indexOf(b[this.currFilterVar]);

					if (elem1 == -1) {
						return 1;
					}

					if (elem2 == -1) {
						return -1;
					}

					if (elem1 < elem2) {
					    return -1;
					} else if (elem1 > elem2) {
						return 1;
					} else {
						return 0;
					}
				});
			} else {
				this.data.sort((a, b) => { 
					let elem1 = a[this.currFilterVar];
					let elem2 = b[this.currFilterVar];

					if (!elem1) {
						return 1;
					}

					if (!elem2) {
						return -1;
					}

					if (elem1 < elem2) {
					    return -1;
					} else if (elem1 > elem2) {
						return 1;
					} else {
						return 0;
					}
				});
			}
		}
	}

	setScale() {
		this.colorScale = getColorScale(this.data, this.currFilter);
	}

	buildGraph() {
		let data = this.data;

		this.split ? this.setSplitIndex() : null;

		this.cells = this.svg.selectAll("rect")
			.data(data)
			.enter().append("rect")
			.attr("width", dotW)
		    .attr("height", dotW)
		    .attr("x", (d, i) => { return this.calcX(d, i); })
		    .attr("y", (d, i) => { return this.calcY(i); })
		    .attr("fill", (d) => {
		    	return this.colorScale(d[this.currFilterVar]);
		    })
		    .attr("class", (d) => { return d[this.currFilterVar]; })
		    .on("mouseover", (d, index, paths) => { return this.mouseover(d, paths[index], event); })
		    .on("mouseout", (d, index, paths) => { return this.mouseout(paths[index]); });
	}

	setSplitIndex() {
		let splitVal = this.split.splitVal;
		this.splitIndex = this.colorScale.domain().indexOf(splitVal);
	}

	setDimensions() {
		if (this.orientation == "vertical") {
			this.w = this.dotsPerRow * (dotW + dotOffset);
			let numRows = Math.ceil(this.dataLength/this.dotsPerRow);

			this.h = numRows * (dotW + dotOffset);

		} else {
			this.w = $(this.svg._groups[0]).width();
			let numCols = Math.floor(this.w/(dotW + dotOffset));
			this.split ? numCols -= splitDistance : null;
			this.dotsPerCol = Math.ceil(this.dataLength/numCols);

			this.h = this.dotsPerCol * (dotW + dotOffset);		
		}

		this.svg
			.attr("height", this.h);
		
	}

	setLegend() {
		let valCounts = d3.nest()
			.key((d) => { return d[this.currFilterVar]; })
			.rollup(function(v) { return v.length; })
			.map(this.data);

		let legendSettings = {};
		legendSettings.format = this.currFilter.format;
		legendSettings.scaleType = this.currFilter.scaleType;
		legendSettings.colorScale = this.colorScale;
		legendSettings.valCounts = valCounts;
		legendSettings.valChangedFunction = this.changeVariableValsShown.bind(this);

		this.legend.render(legendSettings);

	}

	calcX(d, i) {
		if (this.orientation == "vertical") {
			return i%this.dotsPerRow * (dotW + dotOffset);
		} else {
			let xCoord = Math.floor(i/this.dotsPerCol) * (dotW + dotOffset);
			if (this.split) {
				console.log(d[this.currFilterVar]);
				let variableVal = d[this.currFilterVar];
				let variableValIndex = this.colorScale.domain().indexOf(variableVal);
				if (variableValIndex > this.splitIndex) {
					xCoord += splitDistance * (dotW + dotOffset);
				}
			}

			return xCoord;
		}
	}

	calcY(i) {
		if (this.orientation == "vertical") {
			return this.h - (Math.floor(i/this.dotsPerRow) * (dotW + dotOffset)) - (dotW + dotOffset);
		} else {
			return i%this.dotsPerCol * (dotW + dotOffset);
		}
	}

	resize() {
		if (this.orientation == "vertical") {
			return;
		} else {
			this.setDimensions();

			this.cells
				.attr("x", (d, i) => { return this.calcX(d, i); })
			    .attr("y", (d, i) => { return this.calcY(i); });
		}
	}

	// changeFilter(colorVar, scaleType) {
	// 	console.log("changing filter");
	// 	this.currFilterVar = this.currFilterVariable;
	// 	this.scaleType = scaleType;

	// 	this.sortData();
	// 	this.setScale();
	// 	this.cells.remove();
	// 	this.buildGraph();
	// }

	mouseover(datum, path, eventObject) {
		let mousePos = [];
		mousePos[0] = eventObject.pageX;
		mousePos[1] = eventObject.pageY;

		let elem = d3.select(path);
		// let prevX = elem.attr("x");
		// let prevY = elem.attr("y");

		elem
			// .attr("width", dotW * 2)
		 //    .attr("height", dotW * 2)
		 //    .attr("x", prevX - dotW/2)
		 //    .attr("y", prevY - dotW/2)
			.attr("stroke", "white")
			.attr("stroke-width", 3.5);
			
		this.tooltip.show(datum, mousePos);
	}

	mouseout(path) {
		let elem = d3.select(path);
		// let prevX = Number(elem.attr("x"));
		// let prevY = Number(elem.attr("y"));

		elem
			.attr("stroke", "none");
			// .attr("width", dotW)
		 //    .attr("height", dotW)
		 //    .attr("x", prevX + dotW/2)
		 //    .attr("y", prevY + dotW/2);

		this.tooltip.hide();
	}

	changeVariableValsShown(valsShown) {
		console.log(this.cells);
		this.cells
			.style("fill", (d) => {
		   		var value = d[this.currFilterVar];
		   		// if (value) {
		   			let binIndex = this.colorScale.range().indexOf(this.colorScale(value));
		   			if (valsShown.indexOf(binIndex) > -1) {
		   				return this.colorScale(value);
		   			}
		   		// }
		   		return colors.grey.light;
		    });
	}

}