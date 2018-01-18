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
		Object.assign(this, vizSettings)
		this.margin = {top: 20, right: 20};
		this.margin.left = this.customLeftMargin ? this.customLeftMargin : (this.showValueAxis ? 85 : 20);
		this.margin.bottom = this.filterVars.length == 1 ? 50 : 30;

		this.svg = d3.select(this.id).append("svg").attr("class", "bar-chart");

		this.renderingArea = this.svg.append("g");

		this.groupingScale = d3.scaleBand()
			.padding(this.orientation === "horizontal" ? 0.3 : 0.2);

		this.categoryScale = d3.scaleBand();

		this.valueScales = {};
		this.categoryVals = [];
		let colorVals = [];
		let colorLabels = [];
		
		for (let filterVar of this.filterVars) {
			this.categoryVals.push(filterVar.variable);
			colorVals.push(filterVar.color);
			colorLabels.push(filterVar.displayName);
			this.valueScales[filterVar.variable] = d3.scaleLinear();
		}

		this.colorScale = d3.scaleOrdinal()
			.domain(this.categoryVals)
			.range(colorVals);

		
		if (this.filterVars.length > 1) {
			this.legendSettings.id = this.id;
			this.legendSettings.markerSettings = { shape:"rect", size:10 };
			this.legendSettings.customLabels = colorLabels;

			this.legend = new Legend(this.legendSettings);
		}

		if (this.dataNest) {
			let tooltipSettings = { 
				"id":this.id, 
				"tooltipVars": [
					{ variable: "key", displayName: "Year", format: "year" },
					{ variable: "value", displayName: "Percent Radicalized Online", format: "percent" },
					{ variable: "count", displayName: "Number of Cases", format: "number" },
				]
			}
			this.tooltip = new Tooltip(tooltipSettings);
		} else if (this.tooltipVars) {
			let tooltipSettings = { "id":this.id, "tooltipVars": this.tooltipVars }
			this.tooltip = new Tooltip(tooltipSettings);
		}

		if (this.hasTrendline) {
			this.trendline = new Trendline(this.renderingArea, this.filterVars);
		}
	}

	render(data) {
		this.data = data[this.primaryDataSheet];
		if (this.dataNest) {
			this.setDataNest();
		}
	    
	    this.setScaleDomains();
	    this.setDimensions();
	    this.setScaleRanges();

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

		if (this.orientation === "horizontal") {
			let maxBarHeight = 20;
			let barHeight = this.w/15 < maxBarHeight ? this.w/15 : maxBarHeight 
			this.h = this.groupingScale.domain().length * this.filterVars.length * barHeight
		} else {
			this.h = 2*this.w/3;
		}
		this.h = this.h - this.margin.top - this.margin.bottom;

		this.svg
			.attr("width", "100%")
		    .attr("height", this.h + this.margin.top + this.margin.bottom);

		this.renderingArea
		    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

		this.setScaleRanges();
	}

	setScaleRanges() {
		this.groupingScale.range(this.orientation === "horizontal" ? [0, this.h] : [0, this.w]);

		this.categoryScale.range([0, this.groupingScale.bandwidth()]);

		for (let filterVar of this.filterVars) {
			this.valueScales[filterVar.variable].range(this.orientation === "horizontal" ? [0, this.w] : [this.h, 0]);
		}
	}

	setScaleDomains() {
		let groupingVals = d3.nest()
			.key((d) => { return this.dataNest ? d.key : d[this.groupingVar.variable]})
			.map(this.data);

		this.groupingScale.domain(groupingVals.keys());

		if (this.filtersUseSameScale) {
			let globalMax = 0;
			for (let filterVar of this.filterVars) {
				let localMax = d3.max(this.data, (d) => { return Number(d[filterVar.variable]); })
				globalMax = Math.max(globalMax, localMax)
			}
			for (let filterVar of this.filterVars) {
				this.valueScales[filterVar.variable].domain([0, globalMax]);
			}
		} else {
			for (let filterVar of this.filterVars) {
				this.valueScales[filterVar.variable].domain([0, d3.max(this.data, (d) => { return this.dataNest ? Number(d.value.percent) : Number(d[filterVar.variable]); })]);
			}
		}

		this.categoryScale.domain(this.categoryVals).range([0, this.groupingScale.bandwidth()]);;
	}

	renderBars() {
		this.data.forEach((d, i) => {
			if (this.dataNest) {
				d.vals = this.filterVars.map((filterVar) => { return {variable: filterVar.variable, format: filterVar.format, label: this.groupingScale.domain()[i], value: +d.value.percent, count: +d.value.length}; });
			} else {
		    	d.vals = this.filterVars.map((filterVar) => { return {variable: filterVar.variable, format: filterVar.format, label: this.groupingScale.domain()[i], value: +d[filterVar.variable]}; });
		    }
		});

		this.groups = this.renderingArea.selectAll(".group")
	      	.data(this.data)
	      .enter().append("g")
	      	.attr("class", "group");

	 	this.bars = this.groups.selectAll("rect")
	      	.data((d) => { return d.vals; })
	      .enter().append("rect")
			.style("fill", (d) => { return this.colorScale(d.variable); })
			.style("stroke", "white")
			.style("stroke-width", "1px")
			.on("mouseover", (d, index, paths) => {  return this.eventSettings && this.eventSettings.mouseover ? this.mouseover(d, paths[index], d3.event) : null; })
			.on("mouseout", (d, index, paths) => {  return this.eventSettings && this.eventSettings.mouseover ? this.mouseout(paths[index]) : null; });

		if (this.labelValues) {
		    this.labels = this.groups.selectAll("text")
		      	.data((d) => { return d.vals; })
		      .enter().append("text")
		      	.attr("x", (d) => { return this.categoryScale(d.variable) + this.categoryScale.bandwidth()/2; })
		      	.attr("y", (d) => { return this.valueScales[d.variable](d.value) - 5; })
		      	.text((d) => { return formatValue(d.value, d.format) })
		      	.attr("text-anchor", "middle")
		      	.attr("class", "label__value");
		}

		this.setBarPositions()
	}

	renderAxes() {
		this.groupingAxis = this.renderingArea.append("g")
			.attr("class", "axis axis-x")
			
		if (this.filterVars.length == 1 && this.orientation != "horizontal") {
			this.groupingAxisLabel = this.groupingAxis.append("text")
				.attr("y", 50)
				.attr("class", "axis__title")
				.style("text-anchor", "middle")
				.text(this.groupingVar.displayName);
		}

		if (this.showValueAxis) {
			this.valueAxis = this.renderingArea.append("g")
				.attr("class", "y axis")
		    
		    if (this.orientation != "horizontal") {
			    this.valueAxisLabel = this.valueAxis.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", -50)
					.attr("class", "axis__title")
					.style("text-anchor", "middle")
					.text(this.filterVars[0].displayName);
			}
		}

		this.setAxesPositions();
	}

	renderTrendline() {
		this.trendline.render(this.data, this.groupingScale, this.valueScales[this.filterVars[0].variable]);
	}

	calculateTicks() {
		let currInterval;
		if ($(this.id).width() < 575) {
			currInterval = this.groupingAxisLabelInterval.small;
		} else if ($(this.id).width() > 1100) {
			currInterval = this.groupingAxisLabelInterval.large;
		} else {
			currInterval = this.groupingAxisLabelInterval.medium;
		}
		return this.groupingScale.domain().filter( (d, i) => { return !(i%currInterval);});
	}

	setDataNest() {
		let nestedData = d3.nest()
			.key((d) => { return d[this.groupingVar.variable]})
			.rollup((v) => {
				let length = v.length;
				let filteredLength = v.filter((d) => { return d[this.filterVars[0].variable] == this.dataNest.value }).length;
				return { percent: filteredLength/length, length: length }
			})
			.sortKeys(d3.ascending)
			.entries(this.data);

		this.data = nestedData;
	}

	setBarPositions() {
		this.groups
			.attr("transform", (d) => {
	      		if (this.orientation === "horizontal") {
	      			return this.dataNest ? "translate(0, " + this.groupingScale(d.key) + ")" : "translate(0, " + this.groupingScale(d[this.groupingVar.variable]) + ")" ; 
	      		} else {
	      			return this.dataNest ? "translate(" + this.groupingScale(d.key) + ",0)" : "translate(" + this.groupingScale(d[this.groupingVar.variable]) + ",0)" ; 
	      		}
	      	});

	    this.bars
	    	.attr("width", (d) => { return this.orientation === "horizontal" ? this.valueScales[d.variable](d.value) : this.categoryScale.bandwidth() })
			.attr("height", (d) => { return this.orientation === "horizontal" ? this.categoryScale.bandwidth() : this.h - this.valueScales[d.variable](d.value); })
			.attr("x", (d) => { return this.orientation === "horizontal" ? 0 : this.categoryScale(d.variable); })
			.attr("y", (d) => { return this.orientation === "horizontal" ? this.categoryScale(d.variable) : this.valueScales[d.variable](d.value); })
	}

	setAxesPositions() {
		let ticks = this.calculateTicks();

		this.groupingAxis
			.attr("transform", this.orientation === "horizontal" ? "translate(0, 0)" : "translate(0," + this.h + ")")
			.call(this.orientation === "horizontal" ? d3.axisLeft(this.groupingScale).tickValues(ticks) : d3.axisBottom(this.groupingScale).tickValues(ticks));

		if (this.groupingAxisLabel) {
			this.groupingAxisLabel
				.attr("x", this.w/2)
		}

		if (this.valueAxis) {
			this.valueAxis
				.attr("transform", this.orientation === "horizontal" ? "translate(0, " + this.h + ")" : "none")
				.call(
					this.orientation === "horizontal" ?
						d3.axisBottom(this.valueScales[this.filterVars[0].variable])
							.tickFormat((d) => { return formatValue(d, this.filterVars[0].format); })
					:
						d3.axisLeft(this.valueScales[this.filterVars[0].variable])
							.tickFormat((d) => { return formatValue(d, this.filterVars[0].format); })
				)
		}

		if (this.valueAxisLabel) {
			this.valueAxisLabel
				.attr("x", -this.h/2)
		}
	}

	resize() {
		this.setDimensions();

		this.setBarPositions();

		if (this.labelValues) {
			this.labels
			 	.attr("x", (d) => { return this.categoryScale(d.variable) + this.categoryScale.bandwidth()/2; })
		      	.attr("y", (d) => { return this.valueScales[d.variable](d.value) - 5; })
		}

	    let ticks = this.calculateTicks();

		this.setAxesPositions();

		if (this.trendline) {
			this.trendline.resize(this.groupingScale, this.valueScales[this.filterVars[0].variable]);
		}
	}

	mouseover(datum, path, eventObject) {
		if (this.eventSettings.mouseover.fill) {
			d3.select(path)
				.style("fill", this.eventSettings.mouseover.fill);
		} else {
			d3.select(path)
				.style("fill-opacity", .7);
		}
		
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
		if (this.eventSettings.mouseover.fill) {
			d3.select(path)
				.style("fill", (d) => { return this.colorScale(d.variable); });
		} else {
			d3.select(path)
				.style("fill-opacity", 1);
		}
		

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