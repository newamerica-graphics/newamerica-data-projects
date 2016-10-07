import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";
// import { Legend } from "../components/legend.js";
// import { Tooltip } from "../components/tooltip.js";

let parseDate = d3.timeParse("%B %d, %Y");

let margin = {top: 20, right: 20, bottom: 30, left: 75};

let dataPointWidth = 7;

export class BarChart {
	constructor(vizSettings, imageFolderId) {
		let {id, xVars, yVars, yScaleType, primaryDataSheet, yAxisLabelText} = vizSettings;
		this.id = id;
		this.primaryDataSheet = primaryDataSheet;
		this.yScaleType = yScaleType;
		this.yAxisLabelText = yAxisLabelText;

		this.svg = d3.select(id).append("svg").attr("class", "bar-chart");

		this.renderingArea = this.svg.append("g");

		this.xScale = d3.scaleBand()
			.padding(0.2);
		this.yScale = d3.scaleLinear();

		this.setDimensions();
		this.setXYScaleRanges();

		this.currXVar = xVars[0];
		this.currXVarName = xVars[0].variable;
	}

	render(primaryData, secondaryData) {
		this.data = d3.nest()
			.key((d) => {return d[this.currXVarName];})
	        .sortKeys(d3.ascending)
	        .rollup(function(leaves) { return leaves.length; })
	        .entries(primaryData);

	    console.log(this.data);
		  
		this.setXYScaleDomains();

		this.renderBars();
		this.renderAxes();

		// this.setColorScale();

		// this.renderAxes();
        // this.renderLines();
        // this.renderPoints();

        // this.setLegend();
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
	}

	setXYScaleRanges() {
		this.xScale.range([0, this.w]);
		this.yScale.range([this.h, 0]);
	}

	setXYScaleDomains() {
		this.xScale.domain(this.data.map((d) => { return d.key; }));
		this.yScale.domain([0, d3.max(this.data, (d) => { return d.value; })]);
	}

	renderBars() {
		this.bars = this.renderingArea.selectAll(".bar")
	      .data(this.data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", (d) => { return this.xScale(d.key); })
	      .attr("width", this.xScale.bandwidth())
	      .attr("y", (d) => { return this.yScale(d.value); })
	      .attr("height", (d) => { return this.h - this.yScale(d.value); });
	}

	renderAxes() {
		this.xAxis = this.renderingArea.append("g")
			.attr("class", "axis axis-x")
			.attr("transform", "translate(0," + this.h + ")")
			.call(d3.axisBottom(this.xScale).tickPadding(10));

		this.yAxis = this.renderingArea.append("g")
			.attr("class", "axis axis-y")
			.call(d3.axisLeft(this.yScale).tickPadding(10));

		this.yAxisLabel = this.yAxis.append("text")
			.attr("class", "axis__title")
			.attr("transform", "rotate(-90)")
			.attr("x", -this.h/2)
			.attr("y", -60)
			.attr("dy", ".71em")
			.style("text-anchor", "middle")
			.text(this.yAxisLabelText);
	}

	resize() {
		this.setDimensions();
		this.setXYScaleRanges();

		this.xAxis
			.attr("transform", "translate(0," + this.h + ")")
			.call(d3.axisBottom(this.xScale).tickPadding(10));

		this.yAxis.call(d3.axisLeft(this.yScale).tickPadding(10));
		this.yAxisLabel.attr("x", -this.h/2);

		this.bars
			.attr("x", (d) => { return this.xScale(d.key); })
			.attr("width", this.xScale.bandwidth())
			.attr("y", (d) => { return this.yScale(d.value); })
			.attr("height", (d) => { return this.h - this.yScale(d.value); });
	}
}