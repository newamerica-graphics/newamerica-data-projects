import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";
import { Legend } from "../components/legend.js";
import { Tooltip } from "../components/tooltip.js";
import { Trendline } from "../components/trendline.js";

import { formatValue } from "../helper_functions/format_value.js";

let parseDate = d3.timeParse("%B %d, %Y");

let dataPointWidth = 7;

export class BarChart {
	constructor(vizSettings, imageFolderId) {
		let {id, primaryDataSheet, groupingVar, filterVars, legendSettings, xAxisLabelInterval, labelValues, showYAxis, tooltipVars, eventSettings, hasTrendline, dataNest} = vizSettings;
		this.id = id;
		this.primaryDataSheet = primaryDataSheet;
		this.filterVars = filterVars;
		this.tooltipVars = tooltipVars;
		this.eventSettings = eventSettings;
		this.groupingVar = groupingVar;
		this.legendSettings = legendSettings;
		this.xAxisLabelInterval = xAxisLabelInterval;
		this.labelValues = labelValues;
		this.showYAxis = showYAxis;
		this.margin = {top: 20, right: 20};
		this.margin.left = this.showYAxis ? 85 : 20;
		this.margin.bottom = this.filterVars.length == 1 ? 50 : 30;
		this.dataNest = dataNest;

		this.svg = d3.select(id).append("svg").attr("class", "bar-chart");

		this.renderingArea = this.svg.append("g");

		this.groupingScale = d3.scaleBand()
			.padding(0.2);

		this.xScale = d3.scaleBand();

		this.yScales = {};
		this.xVals = [];
		let colorVals = [];
		let colorLabels = [];
		
		for (let filterVar of this.filterVars) {
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

		if (this.filterVars.length > 1) {
			this.legendSettings.id = id;
			this.legendSettings.markerSettings = { shape:"rect", size:10 };
			this.legendSettings.customLabels = colorLabels;

			this.legend = new Legend(this.legendSettings);
		}

		if (this.dataNest) {
			let tooltipSettings = { 
				"id":id, 
				"tooltipVars": [
					{ variable: "key", displayName: "Year", format: "year" },
					{ variable: "count", displayName: "Total", format: "number" },
					{ variable: "value", displayName: "Percent Radicalized Online", format: "percent" },
				]
			}
			this.tooltip = new Tooltip(tooltipSettings);
		} else if (this.tooltipVars) {
			let tooltipSettings = { "id":id, "tooltipVars": this.tooltipVars }
			this.tooltip = new Tooltip(tooltipSettings);
		}

		if (hasTrendline) {
			this.trendline = new Trendline(this.renderingArea, filterVars);
		}
	}

	render(data) {
		this.data = data[this.primaryDataSheet];
		if (this.dataNest) {
			this.setDataNest();
		}
	    
		this.setXYScaleDomains();

		this.renderBars();
		this.renderAxes();

		if (this.filterVars.length > 1) {
			this.legendSettings.scaleType = "categorical";
			this.legendSettings.colorScale = this.colorScale;
			this.legendSettings.valChangedFunction = this.changeVariableValsShown.bind(this);

			this.legend.render(this.legendSettings);
		}

		if (this.trendline) {
			this.renderTrendline();
		}
	}

	setDimensions() {
		this.w = $(this.id).width() - this.margin.left - this.margin.right;
		this.h =  2*this.w/3;
		this.h = this.h - this.margin.top - this.margin.bottom;

		this.svg
			.attr("width", "100%")
		    .attr("height", this.h + this.margin.top + this.margin.bottom);

		this.renderingArea
		    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

		this.setXYScaleRanges();
	}

	setXYScaleRanges() {
		this.groupingScale.range([0, this.w]);

		this.xScale.range([0, this.groupingScale.bandwidth()]);

		for (let filterVar of this.filterVars) {
			this.yScales[filterVar.variable].range([this.h, 0]);
		}
	}

	setXYScaleDomains() {
		let groupingVals = d3.nest()
			.key((d) => { return this.dataNest ? d.key : d[this.groupingVar.variable]})
			.map(this.data);

		this.groupingScale.domain(groupingVals.keys());

		for (let filterVar of this.filterVars) {
			this.yScales[filterVar.variable].domain([0, d3.max(this.data, (d) => { return this.dataNest ? Number(d.value.percent) : Number(d[filterVar.variable]); })]);
		}

		this.xScale.domain(this.xVals).range([0, this.groupingScale.bandwidth()]);;
	}

	renderBars() {
		this.data.forEach((d, i) => {
			if (this.dataNest) {
				d.vals = this.filterVars.map((filterVar) => { return {variable: filterVar.variable, format: filterVar.format, label: this.groupingScale.domain()[i], value: +d.value.percent, count: +d.value.length}; });
			} else {
		    	d.vals = this.filterVars.map((filterVar) => { return {variable: filterVar.variable, format: filterVar.format, label: this.groupingScale.domain()[i], value: +d[filterVar.variable]}; });
		    }
		});

		console.log(this.data);

		this.groups = this.renderingArea.selectAll(".group")
	      	.data(this.data)
	      .enter().append("g")
	      	.attr("class", "group")
	      	.attr("transform", (d) => { return this.dataNest ? "translate(" + this.groupingScale(d.key) + ",0)" : "translate(" + this.groupingScale(d[this.groupingVar.variable]) + ",0)" ; });

	 	this.bars = this.groups.selectAll("rect")
	      	.data((d) => { return d.vals; })
	      .enter().append("rect")
			.attr("width", this.xScale.bandwidth())
			.attr("x", (d) => { return this.xScale(d.variable); })
			.attr("y", (d) => { return this.yScales[d.variable](d.value); })
			.attr("height", (d) => { return this.h - this.yScales[d.variable](d.value); })
			.style("fill", (d) => { return this.colorScale(d.variable); })
			.on("mouseover", (d, index, paths) => {  return this.eventSettings && this.eventSettings.mouseover ? this.mouseover(d, paths[index], d3.event) : null; })
			.on("mouseout", (d, index, paths) => {  return this.eventSettings && this.eventSettings.mouseover ? this.mouseout(paths[index]) : null; });

		if (this.labelValues) {
		    this.labels = this.groups.selectAll("text")
		      	.data((d) => { return d.vals; })
		      .enter().append("text")
		      	.attr("x", (d) => { return this.xScale(d.variable) + this.xScale.bandwidth()/2; })
		      	.attr("y", (d) => { return this.yScales[d.variable](d.value) - 5; })
		      	.text((d) => { return formatValue(d.value, d.format) })
		      	.attr("text-anchor", "middle")
		      	.attr("class", "label__value");
		}
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
				.call(d3.axisLeft(this.yScales[this.filterVars[0].variable])
						.tickFormat((d) => { return formatValue(d, this.filterVars[0].format); })
				)
		    
		    this.yAxisLabel = this.yAxis.append("text")
				.attr("transform", "rotate(-90)")
				.attr("x", -this.h/2)
				.attr("y", -50)
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

	setDataNest() {
		// const { groupingVar, filterVar, value } = this.dataNest;
		// console.log(value)
		let nestedData = d3.nest()
			.key((d) => { return d[this.groupingVar.variable]})
			.rollup((v) => {
				let length = v.length;
				let filteredLength = v.filter((d) => { return d[this.filterVars[0].variable] == this.dataNest.value }).length;
				console.log(filteredLength, length)
				return { percent: filteredLength/length, length: length }
			})
			.sortKeys(d3.ascending)
			.entries(this.data);

		this.data = nestedData;
	}

	resize() {
		this.setDimensions();

		this.groups
			.attr("transform", (d) => { return this.dataNest ? "translate(" + this.groupingScale(d.key) + ",0)" : "translate(" + this.groupingScale(d[this.groupingVar.variable]) + ",0)" ; });

		this.bars
			.attr("width", this.xScale.bandwidth())
			.attr("x", (d) => { return this.xScale(d.variable); })
			.attr("y", (d) => { return this.yScales[d.variable](d.value); })
			.attr("height", (d) => { return this.h - this.yScales[d.variable](d.value); });

		if (this.labelValues) {
			this.labels
			 	.attr("x", (d) => { return this.xScale(d.variable) + this.xScale.bandwidth()/2; })
		      	.attr("y", (d) => { return this.yScales[d.variable](d.value) - 5; })
		}

	    let ticks = this.calculateTicks();

		this.groupingAxis
			.attr("transform", "translate(0," + this.h + ")")
			.call(d3.axisBottom(this.groupingScale).tickValues(ticks));

		if (this.groupingAxisLabel) {
			this.groupingAxisLabel.attr("x", this.w/2);
		}

		if (this.showYAxis) {
			this.yAxis
				.call(d3.axisLeft(this.yScales[this.filterVars[0].variable])
						.tickFormat((d) => { return formatValue(d, this.filterVars[0].format); })
				)

			this.yAxisLabel
				.attr("x", -this.h/2);
		}

		if (this.trendline) {
			this.trendline.resize(this.groupingScale, this.yScales[this.filterVars[0].variable]);
		}
	}

	mouseover(datum, path, eventObject) {
		console.log(datum);
		d3.select(path)
			.style("fill", this.eventSettings.mouseover.fill);
		
		let mousePos = [];
		mousePos[0] = eventObject.pageX;
		mousePos[1] = eventObject.pageY;

		let tooltipData = {};
		if (this.dataNest) {
			tooltipData.key = datum.label;
			tooltipData.value = datum.value;
			tooltipData.count = datum.count;
		} else {
			tooltipData[this.tooltipVars[0].variable] = datum.label;
			tooltipData[datum.variable] = datum.value;
		}
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