import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";
import { Legend } from "../components/legend.js";
import { Tooltip } from "../components/tooltip.js";


export class LineChart {
	constructor(vizSettings, imageFolderId) {
		Object.assign(this, vizSettings);
		this.margin = {top: 20, right: 20, bottom: 30, left: 75};


		this.svg = d3.select(this.id).append("svg").attr("class", "line-chart");

		this.renderingArea = this.svg.append("g");
		if (this.dualYScale) {
			this.margin.right = 75;
		}

		this.setDimensions();

		this.xScale = d3.scaleLinear();
		this.yScale = d3.scaleLinear();
		if (this.dualYScale) {
			this.y2Scale = d3.scaleLinear();
		}

		this.setXYScaleRanges();

		if (this.yVars.length > 1) {
			this.setColorScale();
			this.initializeLegend();
		}
		this.initializeTooltip();
	}

	setDimensions() {
		let {margin} = this;
		this.w = $(this.id).width() - margin.left - margin.right;
		this.h = this.w < 400 ? 2*this.w/3 : 4*this.w/7;
		this.h = this.h - margin.top - margin.bottom;

		this.svg
			.attr("width", "100%")
		    .attr("height", this.h + margin.top + margin.bottom);

		this.renderingArea
			.attr("width", this.w)
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	}

	setXYScaleRanges() {
		this.xScale.range([0, this.w]);
		this.yScale.range([this.h, 0]);

		if (this.dualYScale) {
			this.y2Scale.range([this.h, 0]);
		}
	}

	setColorScale() {
		this.colorScale = d3.scaleOrdinal()
			.domain(this.yVars.map((d) => { return d.displayName; }))
			.range(this.yVars.map((d) => { return d.color; }))

		console.log(this.colorScale.domain(), this.colorScale.range());
	}

	initializeLegend() {
		let legendSettings = { "id":this.id, "showTitle":false, "markerSettings":{ "shape":this.dotSettings.shape, "size":this.dotSettings.width }, "orientation": "horizontal-center"};
		this.legend = new Legend(legendSettings);
	}

	initializeTooltip() {
		let tooltipSettings = { "id":this.id, "tooltipVars":this.tooltipVars}
		this.tooltip = new Tooltip(tooltipSettings);
	}

	render(data) {
		this.data = data[this.primaryDataSheet];
		  
		this.setXYScaleDomains();

		this.renderAxes();
        this.renderDataElements();

  		this.yVars.length > 1 ? this.setLegend() : null;
	}

	setXYScaleDomains() {
		if (this.xVar.customDomain) {
			this.xScale.domain(this.xVar.customDomain);
		} else {
			this.xScale.domain(d3.extent(this.data, (d) => { return d[this.xVar.variable]; }));
		}

		console.log(this.xScale.domain());
		this.yScale.domain(this.getYScaleDomain(this.yVars[0]));
		
		if (this.dualYScale) {
			this.y2Scale.domain(this.getYScaleDomain(this.yVars[1]));
		}
	}

	getYScaleDomain(yVar) {
		if (yVar.customDomain) {
			return yVar.customDomain;
		} else {
			return d3.extent(this.data, (d) => { return d[yVar.variable]; });
		}
	}

	renderAxes() {
		this.xAxis = this.renderingArea.append("g")
			.attr("class", "axis axis-x");

		this.yAxis = this.renderingArea.append("g")
			.attr("class", "axis axis-y");

		this.yAxisLabel = this.yAxis.append("text")
			.attr("class", "axis__title")
			.attr("transform", "rotate(-90)")
			.attr("y", -60)
			.attr("dy", ".71em")
			.style("text-anchor", "middle")
			.text(this.yVars[0].displayName);

		if (this.dualYScale) {
			this.y2Axis = this.renderingArea.append("g")
				.attr("class", "axis axis-y")

			this.y2AxisLabel = this.y2Axis.append("text")
				.attr("class", "axis__title")
				.attr("transform", "rotate(90)")
				.attr("y", -60)
				.attr("dy", ".71em")
				.style("text-anchor", "middle")
				.text(this.yVars[1].displayName);
		}

		this.setAxesDimensions();
	}

	setAxesDimensions() {
		this.xAxis
			.attr("transform", "translate(0," + this.h + ")")
			.call(d3.axisBottom(this.xScale).tickPadding(10));

		this.yAxis
			.call(d3.axisLeft(this.yScale).tickPadding(10));

		this.yAxisLabel
			.attr("x", -this.h/2);

		if (this.dualYScale) {
			this.y2Axis
				.attr("transform", "translate(" + this.w + ")")
				.call(d3.axisRight(this.y2Scale).tickPadding(10));

			this.y2AxisLabel
				.attr("x", this.h/2)
		}
	}

	renderDataElements() {
		this.dataLines = [];
		this.dataPoints = [];

        this.yVars.forEach((yVar, i) => {
        	let whichYScale = this.dualYScale && i > 0 ? this.y2Scale : this.yScale;
		    this.renderLine(yVar, whichYScale);
		    this.renderPoints(yVar, whichYScale);
	  	})
	}

	renderLine(yVar, yScale) {
		this.dataLines[yVar.variable] = this.renderingArea.append("path")
			.datum(this.data)
			.attr("class", "line-chart__line")
			.attr("stroke", yVar.color);

		this.setLinePath(yVar, yScale);
	}

	setLinePath(yVar, yScale) {
		let lineFunc = d3.line()
		    .x((d) => { return this.xScale(d[this.xVar.variable]); })
		    .y((d) => { return yScale(d[yVar.variable]); });

		this.dataLines[yVar.variable].attr("d", lineFunc)
	}

	renderPoints(yVar, yScale) {
		const {dotSettings} = this;
		this.dataPoints[yVar.variable] = this.renderingArea.selectAll(dotSettings.shape + "." + yVar.variable)
			.data(this.data)
			.enter().append("svg:" + dotSettings.shape)
			.attr("class", "line-chart__point " + yVar.variable)
			.attr("stroke-width", "2px")
			.attr("stroke", (d) => { return yVar.color})
			.attr("fill", "white")
			.on("mouseover", (d, i) => { return this.mouseover(d, i, d3.event); })
		    .on("mouseout", () => { return this.mouseout(); });

		if (dotSettings.shape == "rect") {
			this.dataPoints[yVar.variable]
				.attr("width", this.dotSettings.width)
				.attr("height", this.dotSettings.width)
		} else {
			this.dataPoints[yVar.variable]
				.attr("r", this.dotSettings.width/2);
		}

		this.setPointPositions(yVar, yScale);
	}

	setPointPositions(yVar, yScale) {
		if (this.dotSettings.shape == "rect") {
			this.dataPoints[yVar.variable]
				.attr("x", (d) => { return this.xScale(d[this.xVar.variable]) - this.dotSettings.width/2})
				.attr("y", (d) => { return yScale(d[yVar.variable]) - this.dotSettings.width/2; })
		} else {
			this.dataPoints[yVar.variable]
				.attr("cx", (d) => { return this.xScale(d[this.xVar.variable])})
				.attr("cy", (d) => { return yScale(d[yVar.variable]); })
		}
	}

	setLegend() {
		let legendSettings = { "format": this.yVars[0].format, "scaleType": "categorical", "colorScale": this.colorScale, "valChangedFunction": this.changeVariableValsShown.bind(this) };

		this.legend.render(legendSettings);
	}

	resize() {
		this.setDimensions();
		this.setXYScaleRanges();
		this.setAxesDimensions();

		this.yVars.forEach((yVar, i) => {
        	let whichYScale = this.dualYScale && i > 0 ? this.y2Scale : this.yScale;
		    this.setLinePath(yVar, whichYScale);
		    this.setPointPositions(yVar, whichYScale);
	  	})

	}

	changeVariableValsShown(valsShown) {
		this.yVars.forEach((yVar, i) => {
   			if (valsShown.indexOf(i) > -1) {
   				this.dataLines[yVar.variable].attr("stroke", yVar.color);
   				this.dataPoints[yVar.variable].attr("stroke", yVar.color);
   			} else {
   				this.dataLines[yVar.variable].attr("stroke", colors.grey.light);
   				this.dataPoints[yVar.variable].attr("stroke", colors.grey.light);
   			}
		})
	}

	mouseover(datum, index, eventObject) {
		let mousePos = [];
		mousePos[0] = eventObject.pageX;
		mousePos[1] = eventObject.pageY;

		this.yVars.forEach((yVar, i) => {	
   			this.dataPoints[yVar.variable].attr("fill", (d) => { return d[this.xVar.variable] == datum[this.xVar.variable] ? yVar.color : "white"; });
		})
			
		this.tooltip.show(datum, mousePos);
	}

	mouseout() {
		this.yVars.forEach((yVar, i) => {	
   			this.dataPoints[yVar.variable].attr("fill", "white");
		})

		this.tooltip.hide();
	}

}