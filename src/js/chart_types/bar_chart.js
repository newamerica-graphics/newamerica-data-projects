import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";
import { Legend } from "../components/legend.js";

import { formatValue } from "../helper_functions/format_value.js";

let parseDate = d3.timeParse("%B %d, %Y");

let margin = {top: 20, right: 20, bottom: 30, left: 20};

let dataPointWidth = 7;

export class BarChart {
	constructor(vizSettings, imageFolderId) {
		let {id, primaryDataSheet, groupingVar, filterVars, legendSettings} = vizSettings;
		this.id = id;
		this.primaryDataSheet = primaryDataSheet;
		this.filterVars = filterVars;
		this.groupingVar = groupingVar;
		this.legendSettings = legendSettings;

		this.svg = d3.select(id).append("svg").attr("class", "bar-chart");

		this.renderingArea = this.svg.append("g");

		this.groupingScale = d3.scaleBand()
			.padding(0.2);

		this.xScale = d3.scaleBand();

		this.yScales = {};
		this.xVals = [];
		let colorVals = [];
		let colorLabels = [];
		
		for (let filterVar of filterVars) {
			this.xVals.push(filterVar.variable);
			colorVals.push(filterVar.color);
			colorLabels.push(filterVar.displayName);
			this.yScales[filterVar.variable] = d3.scaleLinear();
		}

		this.colorScale = d3.scaleOrdinal()
			.domain(this.xVals)
			.range(colorVals);

		this.setDimensions();
		this.setXYScaleDomains;

		this.legendSettings.id = id;
		this.legendSettings.markerSettings = { shape:"rect", size:10 };
		this.legendSettings.customLabels = colorLabels;

		this.legend = new Legend(this.legendSettings);
	}

	render(data) {
		this.data = data[this.primaryDataSheet];
	    
		this.setXYScaleDomains();

		console.log(this.groupingScale.domain());
		console.log(this.xScale.domain());

		this.renderBars();
		this.renderAxes();

		this.legendSettings.scaleType = "categorical";
		this.legendSettings.colorScale = this.colorScale;
		this.legendSettings.valChangedFunction = this.changeVariableValsShown.bind(this);

		this.legend.render(this.legendSettings);
	}

	setDimensions() {
		this.w = $(this.id).width() - margin.left - margin.right;
		this.h = this.w < 400 ? 2*this.w/3 : this.w/2;
		this.h = this.h - margin.top - margin.bottom;

		this.svg
			.attr("width", "100%")
		    .attr("height", this.h + margin.top + margin.bottom);

		this.renderingArea
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		this.setXYScaleRanges();
	}

	setXYScaleRanges() {
		this.groupingScale.range([0, this.w]);

		console.log(this.groupingScale.bandwidth());
		this.xScale.range([0, this.groupingScale.bandwidth()]);

		for (let filterVar of this.filterVars) {
			this.yScales[filterVar.variable].range([this.h, 0]);
		}
	}

	setXYScaleDomains() {
		let groupingVals = d3.nest()
			.key((d) => { return d[this.groupingVar.variable]})
			.map(this.data);

		this.groupingScale.domain(groupingVals.keys());

		for (let filterVar of this.filterVars) {
			this.yScales[filterVar.variable].domain([0, d3.max(this.data, (d) => { console.log(d); return Number(d[filterVar.variable]); })]);
			console.log(this.yScales[filterVar.variable].domain());
		}

		this.xScale.domain(this.xVals).range([0, this.groupingScale.bandwidth()]);;
	}

	renderBars() {
		console.log(this.groupingScale.bandwidth());
		this.data.forEach((d) => {
		    d.vals = this.filterVars.map(function(filterVar) { return {variable: filterVar.variable, format: filterVar.format, value: +d[filterVar.variable]}; });
		});

		this.groups = this.renderingArea.selectAll(".group")
	      	.data(this.data)
	      .enter().append("g")
	      	.attr("class", "group")
	      	.attr("transform", (d) => { return "translate(" + this.groupingScale(d[this.groupingVar.variable]) + ",0)"; });

	 	this.bars = this.groups.selectAll("rect")
	      	.data((d) => { return d.vals; })
	      .enter().append("rect")
			.attr("width", this.xScale.bandwidth())
			.attr("x", (d) => { return this.xScale(d.variable); })
			.attr("y", (d) => { return this.yScales[d.variable](d.value); })
			.attr("height", (d) => { return this.h - this.yScales[d.variable](d.value); })
			.style("fill", (d) => { return this.colorScale(d.variable); });

	    this.labels = this.groups.selectAll("text")
	      	.data((d) => { return d.vals; })
	      .enter().append("text")
	      	.attr("x", (d) => { return this.xScale(d.variable) + this.xScale.bandwidth()/2; })
	      	.attr("y", (d) => { return this.yScales[d.variable](d.value) - 5; })
	      	.text((d) => { return formatValue(d.value, d.format) })
	      	.attr("text-anchor", "middle");
	}

	renderAxes() {
		this.groupingAxis = this.renderingArea.append("g")
			.attr("class", "axis axis-x")
			.attr("transform", "translate(0," + this.h + ")")
			.call(d3.axisBottom(this.groupingScale));
	}

	resize() {
		this.setDimensions();

		this.groups
			.attr("transform", (d) => { return "translate(" + this.groupingScale(d[this.groupingVar.variable]) + ",0)"; });

		this.bars
			.attr("width", this.xScale.bandwidth())
			.attr("x", (d) => { return this.xScale(d.variable); })
			.attr("y", (d) => { return this.yScales[d.variable](d.value); })
			.attr("height", (d) => { return this.h - this.yScales[d.variable](d.value); });

		this.labels
		 	.attr("x", (d) => { return this.xScale(d.variable) + this.xScale.bandwidth()/2; })
	      	.attr("y", (d) => { return this.yScales[d.variable](d.value) - 5; })

		this.groupingAxis
			.attr("transform", "translate(0," + this.h + ")")
			.call(d3.axisBottom(this.groupingScale));
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