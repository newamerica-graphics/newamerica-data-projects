import $ from 'jquery';
let d3 = require("d3");


import { colors } from "../helper_functions/colors.js";

import { formatValue } from "../helper_functions/format_value.js";

import { getColorScale } from "../helper_functions/get_color_scale.js";

import { Tooltip } from "../components/tooltip.js";



export class CategoryBreakdown {
	constructor(vizSettings, imageFolderId) {
		Object.assign(this, vizSettings);
	
		this.svg = d3.select(this.id)
			.append("svg")
			.attr("width", "100%");

		this.currFilter = this.filterVars[0];
		this.currFilterVar = this.filterVars[0].variable;

		// let tooltipSettings = { "id":id, "tooltipVars":tooltipVars, tooltipImageVar:"tooltipImageVar", "imageFolderId":imageFolderId, "tooltipScrollable":tooltipScrollable };
		// this.tooltip = new Tooltip(tooltipSettings);
	}

	render(data) {
		
		this.data = this.getDataNest(data[this.primaryDataSheet]);
		console.log(this.data);
		this.setDimensions();
		this.setScale(data[this.primaryDataSheet]);

		this.buildGraph();
		// this.sortData();
		

		// this.buildGraph();
		
		// if (!this.isSubComponent) {
		// 	this.setLegend();
		// }
		
	}

	getDataNest(data) {
		data = data.filter((d) => { return d[this.currFilterVar] != null });

		return d3.nest()
			.key((d) => { return d[this.currFilterVar]})
			.entries(data);
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

	setScale(data) {
		this.colorScale = getColorScale(data, this.currFilter);
		console.log(this.colorScale.domain())
		console.log(this.colorScale.range())
	}

	buildGraph() {

		this.categoryContainers = this.svg.selectAll("g")
			.data(this.data)
			.enter().append("g")
			.attr("class", "category-breakdown__category-container")
			.attr("transform", (d, i) => { return "translate(0," + i*200 + ")" })
			

		this.textContainers = this.categoryContainers.append("g")
			.attr("class", "category-breakdown__text")
			
			
		this.textContainers.append("text")
			.attr("class", "category-breakdown__text__heading")
			.text((d) => { return d.key; });
		
		this.textContainers.append("text")
			.attr("class", "category-breakdown__text__subheading")
			.attr("transform", "translate(0,30)")
			.text((d) => { return d.values.length + " states"; });


		this.dataContainers = this.categoryContainers.append("g")
			.attr("class", "category-breakdown__data")
			.attr("transform", "translate(" + this.dotSettings.width/2 + ")")

		this.dataCircles = this.dataContainers.selectAll("circle")
			.data((d) => { console.log(d); return d.values; })
			.enter().append("circle")
			.attr("class", "category-breakdown__data__circle")
			.attr("cx", (d, i) => { return this.calcX(i); })
			.attr("cy", (d, i) => { return this.calcY(i); })
			.attr("r", this.dotSettings.width/2)
			.attr("fill", "white")
			.attr("stroke", (d) => { return this.colorScale(d[this.currFilterVar]); });

		this.dataCircleText = this.dataContainers.selectAll("text")
			.data((d) => { console.log(d); return d.values; })
			.enter().append("text")
			.attr("class", "category-breakdown__data__label")
			.attr("x", (d, i) => { return this.calcX(i); })
			.attr("y", (d, i) => { return this.calcY(i); })
			.attr("stroke", (d) => { return this.colorScale(d[this.currFilterVar]); })
			.style("text-anchor", "middle")
			.style("alignment-baseline", "middle")
			.text((d) => { return d[this.labelVar.variable]; });

		// this.cells = this.svg.selectAll("rect")
		// 	.data(data)
		// 	.enter().append("rect")
		// 	.attr("width", this.dotSettings.width)
		//     .attr("height", this.dotSettings.width)
		//     .attr("x", (d, i) => { return this.calcX(d, i); })
		//     .attr("y", (d, i) => { return this.calcY(i); })
		//     .attr("fill", (d) => {
		//     	return this.colorScale(d[this.currFilterVar]);
		//     })
		//     .style("cursor", this.eventSettings.click ? "pointer" : "auto")
		//     .attr("class", (d) => { return d[this.currFilterVar]; })
		//     .on("mouseover", (d, index, paths) => { return this.mouseover(d, paths[index], d3.event); })
		//     .on("mouseout", (d, index, paths) => { return this.mouseout(paths[index]); })
		//     .on("click", (d) => { return this.eventSettings.click && this.eventSettings.click.handlerFunc ? this.eventSettings.click.handlerFunc(d.id) : null; });
	}

	setSplitIndex() {
		let splitVal = this.split.splitVal;
		this.splitIndex = this.colorScale.domain().indexOf(splitVal);
	}

	setDimensions() {
		this.w = $(this.id).width();
		this.numPerRow = Math.floor(this.w/(this.dotSettings.width + this.dotSettings.offset));
		console.log(this.numPerRow);
		// this.dotsPerCol = Math.ceil(this.dataLength/numCols);

		// this.h = this.dotsPerCol * (this.dotSettings.width + this.dotSettings.offset);		
		this.h = 2*this.w/3;
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

	calcX(i) {
		return (i%this.numPerRow)*(this.dotSettings.width + this.dotSettings.offset);
	}

	calcY(i) {
		return Math.floor(i/this.numPerRow)*(this.dotSettings.width + this.dotSettings.offset); 
	}

	resize() {
		this.setDimensions();

		this.dataCircles
			.attr("cx", (d, i) => { return this.calcX(i); })
			.attr("cy", (d, i) => { return this.calcY(i); });
		
		this.dataCircleText
			.attr("x", (d, i) => { return this.calcX(i); })
			.attr("y", (d, i) => { return this.calcY(i); });
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