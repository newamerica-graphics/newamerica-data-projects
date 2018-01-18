import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";
import { Legend } from "../components/legend.js";
import { Tooltip } from "../components/tooltip.js";

import { formatValue } from "../helper_functions/format_value.js";
const margin = {top: 20, right: 70, bottom:20, left:60};


export class BarLineCombo {
	constructor(vizSettings, imageFolderId) {
		Object.assign(this, vizSettings);

		this.svg = d3.select(this.id).append("svg").attr("class", "bar-chart");

		this.renderingArea = this.svg.append("g");

		this.xScale = d3.scaleBand()
          .padding(0.2);

		this.y1Scale = d3.scaleLinear();
		this.y2Scale = d3.scaleLinear();

		this.colorScale = d3.scaleOrdinal()
			.domain([this.barVar.displayName, this.lineVar.displayName])
			.range([this.barVar.color, this.lineVar.color]);
		
		this.setDimensions();

		let legendSettings = {};
		legendSettings.id = this.id;
		legendSettings.markerSettings = { shape:"rect", size:10 };
		legendSettings.orientation = "horizontal-center";
		legendSettings.disableValueToggling = true;

		this.legend = new Legend(legendSettings);
		
		let tooltipSettings = { "id":this.id, "tooltipVars": [this.xVar, this.barVar, this.lineVar] }
		this.tooltip = new Tooltip(tooltipSettings);
	}

	render(data) {
		this.data = data[this.primaryDataSheet];
		
		this.setXYScaleDomains();

		this.renderBars();
		this.renderLine();
		this.renderPoints();
		this.renderAxes();

		let legendSettings = {};
		legendSettings.scaleType = "categorical";
		legendSettings.colorScale = this.colorScale;

		this.legend.render(legendSettings);
	}

	setDimensions() {
		this.w = $(this.id).width() - margin.left - margin.right;
		this.h =  2*this.w/3;
		this.h = this.h - margin.top - margin.bottom;

		this.svg
			.attr("width", "100%")
		    .attr("height", this.h + margin.top + margin.bottom);

		this.renderingArea
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		this.setXYScaleRanges();
	}

	setXYScaleRanges() {
		this.xScale.range([0, this.w]);

		this.y1Scale.range([this.h, 0]);
		this.y2Scale.range([this.h, 0]);

		this.valueline = d3.line()
		    .x((d) => { return d[this.lineVar.variable] ? this.xScale(d[this.xVar.variable]) + this.xScale.bandwidth()/2 : null; })
		    .y((d) => { return d[this.lineVar.variable] ? +this.y2Scale(d[this.lineVar.variable]) : null; });
		
		this.valueline.defined((d) => { return d[this.lineVar.variable] != null; });
	}

	setXYScaleDomains() {
		this.xScale.domain(this.data.map((d) => { return +d[this.xVar.variable]; }));

		let y1Extents = this.barVar.customDomain || [0, d3.max(this.data, (d) => { return d[this.barVar.variable]; })];
		this.y1Scale.domain(y1Extents);

		let y2Extents = this.lineVar.customDomain || [0, d3.max(this.data, (d) => { return d[this.lineVar.variable]; })];
		this.y2Scale.domain(y2Extents);
	}

	renderBars() {
		this.bars = this.renderingArea.selectAll(".bar")
	      .data(this.data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", (d) => { return +this.xScale(d[this.xVar.variable]); })
	      .attr("width", this.xScale.bandwidth())
	      .attr("y", (d) => { return +this.y1Scale(d[this.barVar.variable]); })
	      .attr("height", (d) => { return this.h - this.y1Scale(d[this.barVar.variable]); })
	      .attr("fill", this.barVar.color)
	      .on("mouseover", (d) => {  return this.mouseover(d, d3.event); })
		  .on("mouseout", () => {  return this.mouseout(); });
	}

	renderLine() {
		this.line = this.renderingArea.append("path")
	      .data([this.data])
	      .attr("class", "line")
	      .attr("d", this.valueline)
	      .attr("fill", "none")
	      .attr("stroke", this.lineVar.color)
	      .style("pointer-events", "none");
	}

	renderPoints() {
		this.points = this.renderingArea.selectAll(".point")
	      .data(this.data)
	    .enter().append("circle")
	      .attr("class", "point")
	      .attr("cx", (d) => { return this.xScale(d[this.xVar.variable]) + this.xScale.bandwidth()/2; })
	      .attr("cy", (d) => { return +this.y2Scale(d[this.lineVar.variable]); })
	      .attr("r", 5)
	      .attr("fill", this.lineVar.color)
	      .on("mouseover", (d) => {  return this.mouseover(d); })
		  .on("mouseout", () => {  return this.mouseout(); });
	      
	}

	renderAxes() {
		this.xAxis = this.svg.append("g");
	    this.y1Axis = this.svg.append("g");
	    this.y2Axis = this.svg.append("g");

	    this.y1AxisLabel = this.y1Axis.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", -margin.left + 20)
			.attr("class", "axis__title")
			.style("text-anchor", "middle")
			.style("font-weight", "bold")
			.style("fill", colors.black)
			.style("font-size", "14px")
			.text(this.barVar.displayName);

		this.y2AxisLabel = this.y2Axis.append("text")
			.attr("transform", "rotate(90)")
			.attr("y", -margin.right + 20)
			.attr("class", "axis__title")
			.style("text-anchor", "middle")
			.style("font-weight", "bold")
			.style("fill", colors.black)
			.style("font-size", "14px")
			.text(this.lineVar.displayName);
	    
	    this.setAxesPositions();
	}

	setAxesPositions() {
		this.xAxis
	      .attr("transform", "translate(" + margin.left + "," + (this.h + margin.top) + ")")
	      .call(d3.axisBottom(this.xScale).tickFormat((d) => { return formatValue(d, this.xVar.format); }));

	    this.y1Axis
	    	.attr("transform", "translate(" + (margin.left) + "," + margin.top + ")")
	        .call(d3.axisLeft(this.y1Scale).tickFormat((d) => { return formatValue(d, this.barVar.format); }));

	    this.y2Axis
	    	.attr("transform", "translate(" + (this.w + margin.left) + "," + margin.top + ")")
	        .call(d3.axisRight(this.y2Scale).tickFormat((d) => { return formatValue(d, this.lineVar.format); }));

	    this.y1AxisLabel
	    	.attr("x", -this.h/2);

		this.y2AxisLabel
	    	.attr("x", this.h/2);
	}

	resize() {
		this.setDimensions();
		this.bars
			.attr("x", (d) => { return +this.xScale(d[this.xVar.variable]); })
			.attr("width", this.xScale.bandwidth())
			.attr("y", (d) => { return +this.y1Scale(d[this.barVar.variable]); })
			.attr("height", (d) => { return this.h - this.y1Scale(d[this.barVar.variable]); });
			
		this.line
			.attr("d", this.valueline);

		this.points
			.attr("cx", (d) => { return this.xScale(d[this.xVar.variable]) + this.xScale.bandwidth()/2; })
	    	.attr("cy", (d) => { return +this.y2Scale(d[this.lineVar.variable]); });

	    this.setAxesPositions();
	}

	mouseover(datum, eventObject) {
		let hoveredXVal = datum[this.xVar.variable];
		
		this.points
			.style("stroke", "white")
			.style("stroke-width", (d) => { return d[this.xVar.variable] == hoveredXVal ? 2 : 0; });

		this.bars.style("fill", (d) => { return d[this.xVar.variable] == hoveredXVal ? this.barVar.color : colors.grey.light; });

		let mousePos = [];
		mousePos[0] = eventObject.pageX;
		mousePos[1] = eventObject.pageY;

		this.tooltip.show(datum, mousePos);
	}

	mouseout(path) {
		this.points
			.style("stroke", "none");
		
		this.bars.style("fill", (d) => { return this.barVar.color; });

	    this.tooltip.hide();
	}
}