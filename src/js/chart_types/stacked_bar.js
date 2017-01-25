import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";
import { Legend } from "../components/legend.js";
import { Tooltip } from "../components/tooltip.js";
import { Trendline } from "../components/trendline.js";

import { formatValue } from "../helper_functions/format_value.js";



export class StackedBar {
	constructor(vizSettings, imageFolderId) {
		let {id, primaryDataSheet, xVar, filterVars, legendSettings, xAxisLabelInterval, labelValues, showYAxis, tooltipVars, eventSettings} = vizSettings;
		this.id = id;
		this.primaryDataSheet = primaryDataSheet;
		this.filterVars = filterVars;
		this.tooltipVars = tooltipVars;
		this.eventSettings = eventSettings;
		this.xVar = xVar;
		this.legendSettings = legendSettings;
		this.xAxisLabelInterval = xAxisLabelInterval;
		this.labelValues = labelValues;
		this.showYAxis = showYAxis;
		this.margin = {top: 20, right: 20};
		this.margin.left = this.showYAxis ? 70 : 20;
		this.margin.bottom = this.filterVars.length == 1 ? 50 : 30;

		this.svg = d3.select(id).append("svg").attr("class", "bar-chart");

		this.renderingArea = this.svg.append("g");

		this.xScale = d3.scaleBand()
			.padding(0.2);

		this.yScale = d3.scaleLinear();

		this.setDimensions();

		// if (filterVars.length > 1) {
		// 	this.legendSettings.id = id;
		// 	this.legendSettings.markerSettings = { shape:"rect", size:10 };
		// 	this.legendSettings.customLabels = colorLabels;

		// 	this.legend = new Legend(this.legendSettings);
		// }

		// if (tooltipVars) {
		// 	let tooltipSettings = { "id":id, "tooltipVars":tooltipVars }
		// 	this.tooltip = new Tooltip(tooltipSettings);
		// }
	}

	setDimensions() {
		this.w = $(this.id).width() - this.margin.left - this.margin.right;
		this.h = 2*this.w/3;
		this.h = this.h - this.margin.top - this.margin.bottom;

		this.svg
			.attr("width", "100%")
		    .attr("height", this.h + this.margin.top + this.margin.bottom);

		// this.renderingArea
		//     .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
		//     .attr("width", this.w - margin.left - margin.right)
  //           .attr("height", height);

		this.setScaleRanges();

	}

	setScaleRanges() {
		this.xScale.rangeRound([0, this.w]);
		this.yScale.range([this.h, 0]);
	}

	render(data) {
		this.data = data[this.primaryDataSheet];

		console.log(this.data);
	    
		this.setScaleDomains();

		this.renderBars();
		// this.renderAxes();

		// if (this.filterVars.length > 1) {
		// 	this.legendSettings.scaleType = "categorical";
		// 	this.legendSettings.colorScale = this.colorScale;
		// 	this.legendSettings.valChangedFunction = this.changeVariableValsShown.bind(this);

		// 	this.legend.render(this.legendSettings);
		// }

		// if (this.trendline) {
		// 	this.renderTrendline();
		// }
	}

	setScaleDomains() {
		let keyList = new Set();

		let maxVal = 0;

		this.nestedVals = d3.nest()
			.key((d) => { keyList.add(d.year); return d.year; })
			.sortKeys(d3.ascending)
			.rollup((v) => {
				let retVal = [];
				let total = 0;
				let i = 0;
				for (let filter of this.filterVars) {
					let localSum = d3.sum(v, (d) => { return Number(d[filter.variable]); });
					retVal.push(localSum);
					total += localSum;

					i++;
				}
				maxVal = Math.max(maxVal, total);
				return retVal;
			})
			.entries(this.data);

		console.log(this.nestedVals);
		console.log(maxVal);

		this.yScale.domain([0, maxVal]);
		this.xScale.domain(Array.from(keyList).sort());

	}

	renderBars() {
		this.barGroups = this.svg.selectAll("g")
			.data(this.nestedVals)
		  .enter().append("g");

		let currCumulativeY = 0;
		this.bars = this.barGroups.selectAll("rect")
			.data((d) => { console.log(d); return d.value; })
		  .enter().append("rect")
		  	.attr("x", 0)
			.attr("fill", (d, i) => { return this.filterVars[i].color; });

		this.setBarHeights();
	}

	renderAxes() {
		let ticks = this.calculateTicks();

		this.groupingAxis = this.renderingArea.append("g")
			.attr("class", "axis axis-x")
			.attr("transform", "translate(0," + this.h + ")")
			.call(d3.axisBottom(this.groupingScale).tickValues(ticks));

		if (this.filterVars.length == 1) {
			this.groupingAxisLabel = this.groupingAxis.append("text")
				.attr("x", this.w/2)
				.attr("y", 50)
				.attr("class", "axis__title")
				.style("text-anchor", "middle")
				.text(this.groupingVar.displayName);
		}

		if (this.showYAxis) {
			this.yAxis = this.renderingArea.append("g")
				.attr("class", "y axis")
				.call(d3.axisLeft(this.yScales[this.filterVars[0].variable]));
		    
		    this.yAxisLabel = this.yAxis.append("text")
				.attr("transform", "rotate(-90)")
				.attr("x", -this.h/2)
				.attr("y", -40)
				.attr("class", "axis__title")
				.style("text-anchor", "middle")
				.text(this.filterVars[0].displayName);
		}
	}

	renderTrendline() {
		this.trendline.render(this.data, this.groupingScale, this.yScales[this.filterVars[0].variable]);
	}

	calculateTicks() {
		let currInterval;
		if ($(this.id).width() < 575) {
			currInterval = this.xAxisLabelInterval.small;
		} else if ($(this.id).width() > 1100) {
			currInterval = this.xAxisLabelInterval.large;
		} else {
			currInterval = this.xAxisLabelInterval.medium;
		}
		return this.groupingScale.domain().filter( (d, i) => { return !(i%currInterval);});
	}

	setBarHeights() {
		this.barGroups
			.attr("transform", (d) => { console.log(d); return "translate(" + this.xScale(d.key) + ")"})
		
		let currCumulativeY = 0;
		this.bars
			.attr("y", (d, i) => { 
				let barHeight = this.h - this.yScale(d);
				currCumulativeY = i == 0 ? this.h - barHeight : currCumulativeY - barHeight;
				return currCumulativeY; 
			})
			.attr("height", (d) => { return this.h - this.yScale(d); })
			.attr("width", this.xScale.bandwidth());
	}

	resize() {
		this.setDimensions();
		this.setBarHeights();
		// this.groups
		// 	.attr("transform", (d) => { return "translate(" + this.groupingScale(d[this.groupingVar.variable]) + ",0)"; });

		// this.bars
		// 	.attr("width", this.xScale.bandwidth())
		// 	.attr("x", (d) => { return this.xScale(d.variable); })
		// 	.attr("y", (d) => { return this.yScales[d.variable](d.value); })
		// 	.attr("height", (d) => { return this.h - this.yScales[d.variable](d.value); });

		// if (this.labelValues) {
		// 	this.labels
		// 	 	.attr("x", (d) => { return this.xScale(d.variable) + this.xScale.bandwidth()/2; })
		//       	.attr("y", (d) => { return this.yScales[d.variable](d.value) - 5; })
		// }

	 //    let ticks = this.calculateTicks();

		// this.groupingAxis
		// 	.attr("transform", "translate(0," + this.h + ")")
		// 	.call(d3.axisBottom(this.groupingScale).tickValues(ticks));

		// if (this.groupingAxisLabel) {
		// 	this.groupingAxisLabel.attr("x", this.w/2);
		// }

		// if (this.showYAxis) {
		// 	this.yAxis
		// 		.call(d3.axisLeft(this.yScales[this.filterVars[0].variable]));

		// 	this.yAxisLabel
		// 		.attr("x", -this.h/2);
		// }

		// if (this.trendline) {
		// 	this.trendline.resize(this.groupingScale, this.yScales[this.filterVars[0].variable]);
		// }
	}

	mouseover(datum, path, eventObject) {
		d3.select(path)
			.style("fill", this.eventSettings.mouseover.fill);
		
		let mousePos = [];
		mousePos[0] = eventObject.pageX;
		mousePos[1] = eventObject.pageY;

		let tooltipData = {};
		tooltipData[this.tooltipVars[0].variable] = datum.label;
		tooltipData[datum.variable] = datum.value;
		this.tooltip.show(tooltipData, mousePos);
	}

	mouseout(path) {
		d3.select(path)
			.style("fill", (d) => { return this.colorScale(d.variable); });

	    this.tooltip.hide();
	}

	changeVariableValsShown(valsShown) {
		this.bars
			.style("fill", (d) => {
	   			let binIndex = this.colorScale.domain().indexOf(d.variable);
	   			if (valsShown.indexOf(binIndex) > -1) {
	   				return this.colorScale(d.variable);
	   			}
		   		return colors.grey.light;
		    });
	}
}