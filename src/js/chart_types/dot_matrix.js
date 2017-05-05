import $ from 'jquery';

let d3 = require("d3");

import { Legend } from "../components/legend.js";

import { colors } from "../helper_functions/colors.js";

import { formatValue } from "../helper_functions/format_value.js";

import { getColorScale } from "../helper_functions/get_color_scale.js";

import { Tooltip } from "../components/tooltip.js";

let splitDistance = 3; //number of dots between split components

export class DotMatrix {
	constructor(vizSettings, imageFolderId) {
		let {id, orientation, tooltipVars, tooltipImageVar, filterVars, isSubComponent, tooltip, colorScale, split, primaryDataSheet, eventSettings, dotSettings, tooltipScrollable, legendSettings, simpleDataVals} = vizSettings;
		
		// super(id, isSubComponent);

		this.id = id;
		this.orientation = orientation;
		this.isSubComponent = isSubComponent;
		this.split = split;
		this.primaryDataSheet = primaryDataSheet;
		this.eventSettings = eventSettings;
		this.dotSettings = dotSettings;
		this.legendSettings = legendSettings;
		this.simpleDataVals = simpleDataVals;

		this.split ? this.appendSplitLabels() : null;

		if (isSubComponent) {
			this.svg = d3.select(id)
				.append("svg")
				.attr("width", "100%");

			this.tooltip = tooltip;
			this.colorScale = colorScale;

		} else {
			// let chartContainer = d3.select(id)
			// 	.append("div")
			// 	.attr("class", "chart-wrapper");

			this.svg = d3.select(id)
				.append("svg")
				.attr("width", "100%");

			if (this.tooltipVars) {
				let tooltipSettings = { "id":id, "tooltipVars":tooltipVars, tooltipImageVar:"tooltipImageVar", "imageFolderId":imageFolderId, "tooltipScrollable":tooltipScrollable };

				this.tooltip = new Tooltip(tooltipSettings);
			}

			
			this.legendSettings.id = id;
			this.legendSettings.showTitle = false;
			this.legendSettings.markerSettings = { shape:"rect", size:this.dotSettings.width };
			this.legendSettings.orientation = "horizontal-center";
			this.legend = new Legend(this.legendSettings);
		}

		this.currFilter = filterVars[0];
		this.currFilterVar = filterVars[0].variable;
	}

	render(data) {
		if (!this.isSubComponent ) {
			if (this.simpleDataVals) {
				this.data = this.createDataVals(data[this.primaryDataSheet]);
			} else {
				this.data = this.processData(data[this.primaryDataSheet]);
			}
		} else {
			this.data = data;
		}

		this.dataLength = this.data.length;
		this.setDimensions();
		if (!this.simpleDataVals) { this.sortData(); }
		if (!this.isSubComponent) {
			this.setScale();
		}
		this.split ? this.setSplitLabels() : null;

		this.buildGraph();
		
		if (!this.isSubComponent) {
			this.setLegend();
		}
		
	}

	processData(data) {
		data = data.filter((d) => { return d[this.currFilterVar] != null });
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

		return data;
	}

	createDataVals(simpleDataVals) {
		let retData = [];

		simpleDataVals.forEach((d) => {
			for (let i = 0; i < d.percent; i++) {
				let dataObject = {};
				dataObject[this.currFilterVar] = d[this.currFilterVar];
				retData.push(dataObject);
			}
		})

		return retData;
	}

	sortData() {
		if (this.currFilter.scaleType === "linear" || this.currFilter.scaleType === "logarithmic" || this.currFilter.scaleType === "quantize") {
			this.data.sort((a, b) => { return Number(b[this.currFilterVar]) - Number(a[this.currFilterVar]);});
		} else if (this.currFilter.scaleType === "categorical") {
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

		this.cells = this.svg.selectAll("rect")
			.data(data)
			.enter().append("rect")
			.attr("width", this.dotSettings.width)
		    .attr("height", this.dotSettings.width)
		    .attr("x", (d, i) => { console.log(d); return this.calcX(d, i); })
		    .attr("y", (d, i) => { return this.calcY(i); })
		    .attr("fill", (d) => {
		    	return this.colorScale(d[this.currFilterVar]);
		    })
		    .style("cursor", this.eventSettings.click ? "pointer" : "auto")
		    .attr("class", (d) => { return d[this.currFilterVar]; })
		    .on("mouseover", (d, index, paths) => { return this.mouseover(d, paths[index], d3.event); })
		    .on("mouseout", (d, index, paths) => { return this.mouseout(paths[index]); })
		    .on("click", (d) => { return this.eventSettings.click && this.eventSettings.click.handlerFunc ? this.eventSettings.click.handlerFunc(d.id) : null; });
	}

	setSplitIndex() {
		let splitVal = this.split.splitVal;
		this.splitIndex = this.colorScale.domain().indexOf(splitVal);
	}

	setDimensions() {
		if (this.orientation == "vertical") {
			this.w = this.dotSettings.dotsPerRow * (this.dotSettings.width + this.dotSettings.offset);
			let numRows = Math.ceil(this.data.length/this.dotSettings.dotsPerRow);

			this.h = numRows * (this.dotSettings.width + this.dotSettings.offset);

		} else {
			this.w = $(this.id).width();
			let numCols = Math.floor(this.w/(this.dotSettings.width + this.dotSettings.offset));
			this.split ? numCols -= splitDistance : null;
			this.dotsPerCol = Math.ceil(this.dataLength/numCols);

			this.h = this.dotsPerCol * (this.dotSettings.width + this.dotSettings.offset);		
		}

		this.svg
			.attr("height", this.h);
		
	}

	setLegend() {
		let { valCountType, showValCounts } = this.legendSettings;
		let dataLength = this.data.length;
		
		if ( showValCounts ) {
			this.legendSettings.valCounts = d3.nest()
				.key((d) => { return d[this.currFilterVar]; })
				.rollup(function(v) {
					if (valCountType == "percent") {
						return formatValue(v.length/dataLength, "percent"); 
					} else if (valCountType == "both") {
						return v.length + " (" + formatValue(v.length/dataLength, "percent") + ")";
					} else {
						return v.length;
					}
					
				})
				.map(this.data);
		}

		this.legendSettings.format = this.currFilter.format;
		this.legendSettings.scaleType = this.currFilter.scaleType;
		this.legendSettings.colorScale = this.colorScale;
		this.legendSettings.valChangedFunction = this.changeVariableValsShown.bind(this);

		this.legend.render(this.legendSettings);

	}

	calcX(d, i) {
		if (this.orientation == "vertical") {
			return i%this.dotSettings.dotsPerRow * (this.dotSettings.width + this.dotSettings.offset);
		} else {
			let xCoord = Math.floor(i/this.dotsPerCol) * (this.dotSettings.width + this.dotSettings.offset);
			if (this.split) {
				let variableVal = d[this.currFilterVar];
				let variableValIndex = this.colorScale.domain().indexOf(variableVal);
				if (variableValIndex > this.splitIndex) {
					xCoord += splitDistance * (this.dotSettings.width + this.dotSettings.offset);
				}
			}

			return xCoord;
		}
	}

	calcY(i) {
		if (this.orientation == "vertical") {
			return this.h - (Math.floor(i/this.dotSettings.dotsPerRow) * (this.dotSettings.width + this.dotSettings.offset)) - (this.dotSettings.width + this.dotSettings.offset);
		} else {
			return i%this.dotsPerCol * (this.dotSettings.width + this.dotSettings.offset);
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

		let mouseoverSettings = this.eventSettings.mouseover;

		let elem = d3.select(path);
		// let prevX = elem.attr("x");
		// let prevY = elem.attr("y");

		let currFill = elem.attr("fill");
		elem
			// .attr("width", this.dotSettings.width * 2)
		 //    .attr("height", this.dotSettings.width * 2)
		 //    .attr("x", prevX - this.dotSettings.width/2)
		 //    .attr("y", prevY - this.dotSettings.width/2)
		 	.attr("fill", (d) => {
		    	return mouseoverSettings.fill ? mouseoverSettings.fill : currFill;
		    })
			.attr("stroke", mouseoverSettings.stroke ? mouseoverSettings.stroke : "none")
			.attr("stroke-width", mouseoverSettings.strokeWidth ? mouseoverSettings.strokeWidth : "0px");
			
		this.tooltip ? this.tooltip.show(datum, mousePos) : null;
	}

	mouseout(path) {
		let elem = d3.select(path);
		// let prevX = Number(elem.attr("x"));
		// let prevY = Number(elem.attr("y"));

		let currFill = elem.attr("fill");

		elem
			.attr("fill", (d) => {
		    	return currFill;
		    })
			.attr("stroke", "none");
			// .attr("width", this.dotSettings.width)
		 //    .attr("height", this.dotSettings.width)
		 //    .attr("x", prevX + this.dotSettings.width/2)
		 //    .attr("y", prevY + this.dotSettings.width/2);

		this.tooltip ? this.tooltip.hide() : null;
	}

	changeVariableValsShown(valsShown) {
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

	changeValue(value) {
		this.cells
			.attr("fill", (d) => { return d.id == value ? colors.turquoise.light : this.colorScale(d[this.currFilterVar]);});

	}

	appendSplitLabels() {
		let splitLabels = d3.select(this.id)
			.append("div")
			.attr("class", "dot-matrix__split-label__container");

		let splitLabelLeft = splitLabels
			.append("div")
			.attr("class", "dot-matrix__split-label__left");

		let splitLabelRight = splitLabels
			.append("div")
			.attr("class", "dot-matrix__split-label__right");

		splitLabelLeft.append("h5")
			.attr("class", "dot-matrix__split-label__title")
			.text(this.split.leftLabel);

		splitLabelRight.append("h5")
			.attr("class", "dot-matrix__split-label__title")
			.text(this.split.rightLabel);

		this.splitLabelLeftVal = splitLabelLeft.append("h5")
			.attr("class", "dot-matrix__split-label__value");

		this.splitLabelRightVal = splitLabelRight.append("h5")
			.attr("class", "dot-matrix__split-label__value");

	}

	setSplitLabels() {
		this.setSplitIndex();
		let counts = d3.nest()
			.key((d) => { return d[this.split.splitFilterVar.variable]; })
			.rollup(function(v) { return v.length; })
			.entries(this.data);

		let leftValCounts = 0;
		let rightValCounts = 0;

		for (let i in counts) {
			if (i <= this.splitIndex) {
				leftValCounts += counts[i].value;
			} else {
				rightValCounts += counts[i].value;
			}
		}

		if (this.split.splitAggregate == "count") {
			this.splitLabelLeftVal.text(leftValCounts);
			this.splitLabelRightVal.text(rightValCounts);
		} else {
			let valCountsTotal = leftValCounts + rightValCounts;
			this.splitLabelLeftVal.text(Math.round(leftValCounts/valCountsTotal * 100) + "%");
			this.splitLabelRightVal.text(Math.round(rightValCounts/valCountsTotal * 100) + "%");
		}

		
	}

}