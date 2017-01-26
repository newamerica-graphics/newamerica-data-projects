import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";
import { Legend } from "../components/legend.js";
import { Tooltip } from "../components/tooltip.js";
import { Trendline } from "../components/trendline.js";

import { formatValue } from "../helper_functions/format_value.js";

export class PercentageStackedBar {
	constructor(vizSettings, imageFolderId) {
		let {id, primaryDataSheet, groupingVar, filterVar} = vizSettings;
		this.id = id;
		this.primaryDataSheet = primaryDataSheet;
		this.groupingVar = groupingVar;
		this.filterVar = filterVar;
		
		this.margin = {top: 20, right: 20};
		this.margin.left = this.showYAxis ? 70 : 20;
		this.margin.bottom = 50;

		this.svg = d3.select(id).append("svg").attr("class", "bar-chart");

		this.renderingArea = this.svg.append("g");

		this.groupingScale = d3.scaleBand()
			.padding(1);

		this.lengthScale = d3.scaleLinear();

		this.setDimensions();
	}

	setDimensions() {
		this.w = $(this.id).width() - this.margin.left - this.margin.right;
		this.h = 2*this.w/3;
		this.h = this.h - this.margin.top - this.margin.bottom;

		this.svg
			.attr("width", "100%")
		    .attr("height", this.h + this.margin.top + this.margin.bottom);

		this.renderingArea
		    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
		    .attr("width", this.w - this.margin.left - this.margin.right)
            .attr("height", this.h);

		this.setScaleRanges();

	}

	setScaleRanges() {
		this.groupingScale.rangeRound([0, this.w]);
		this.lengthScale.range([this.h, 0]);
	}

	render(data) {
		this.data = data[this.primaryDataSheet];

		console.log(this.data);
	    
		this.setScaleDomains();

		// this.renderBars();
		// this.renderAxes();
	}

	setScaleDomains() {
		this.nestedVals = d3.nest()
			.key((d) => { return d[this.groupingVar.variable]; })
			.key((d) => { return d[this.filterVar.variable]; })
			.rollup((v) => { console.log(v); return v; })
			.entries(this.data);


		console.log(this.nestedVals);
		// this.lengthScale.domain([0, maxVal]);
		// this.groupingScale.domain(Array.from(keyList).sort());

		// this.colorScale
		// 	.domain(this.groupingScale.domain());

	}

	renderBars() {
		this.barGroups = this.renderingArea.selectAll("g")
			.data(this.nestedVals)
		  .enter().append("g")
		  	.on("mouseover", (d, index, paths) => {  return this.mouseover(d, paths[index], d3.event); })
		  	.on("mouseout", (d, index, paths) => {  return this.mouseout(paths[index]); });

		let currCumulativeY = 0;
		this.bars = this.barGroups.selectAll("rect")
			.data((d) => { console.log(d); return d.value; })
		  .enter().append("rect")
		  	.attr("x", 0)
			.style("fill", (d, i) => { return this.filterVars[i].color; })
			.style("fill-opacity", .75);

		this.setBarHeights();
	}

	renderAxes() {
		this.yAxis = this.svg.append("g")
            .attr("class", "axis axis--y");

        this.yAxisLabel = this.yAxis.append("text")
            .attr("class", "data-block__viz__y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", -30)
            .attr("fill", "#000")
            .text("Value");

        this.xAxis = this.svg.append("g")
            .attr("class", "axis axis--x");

        this.setAxes();
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
			.attr("transform", (d) => { console.log(d); return "translate(" + this.groupingScale(d.key) + ")"})
		
		let currCumulativeY = 0;
		this.bars
			.attr("y", (d, i) => { 
				let barHeight = this.h - this.lengthScale(d);
				currCumulativeY = i == 0 ? this.h - barHeight : currCumulativeY - barHeight;
				return currCumulativeY; 
			})
			.attr("height", (d) => { return this.h - this.lengthScale(d); })
			.attr("width", this.groupingScale.bandwidth());
	}

	setAxes() {
		this.yAxis
			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
            .call(d3.axisLeft(this.lengthScale));

        this.yAxisLabel
            .attr("x", -this.h/2)

        this.xAxis
            .attr("transform", "translate(" + this.margin.left + "," + (this.h + this.margin.top) + ")")
            .call(d3.axisBottom(this.groupingScale));
	}

	resize() {
		this.setDimensions();
		this.setBarHeights();
		this.setAxes();
	}

	mouseover(datum, path, eventObject) {
		d3.select(path).selectAll("rect")
			.style("fill-opacity", 1);
		
		let mousePos = [];
		mousePos[0] = eventObject.pageX;
		mousePos[1] = eventObject.pageY;

		let tooltipData = {};
		tooltipData[this.tooltipTitleVar.variable] = datum.key;
		let i = 0;
		for (let filter of this.filterVars) {
			tooltipData[filter.variable] = datum.value[i];
			i++;
		}

		this.tooltip.show(tooltipData, mousePos);
	}

	mouseout(path) {
		d3.select(path).selectAll("rect")
			.style("fill-opacity", .75);

	    this.tooltip.hide();
	}

	changeVariableValsShown(valsShown) {
		this.bars
			.style("fill", (d, i) => {
	   			if (valsShown.indexOf(i) > -1) {
	   				return this.filterVars[i].color;
	   			}
		   		return colors.grey.light;
		    });
	}
}