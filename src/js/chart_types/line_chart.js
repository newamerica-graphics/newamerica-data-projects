import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";
import { Legend } from "../components/legend.js";
import { Tooltip } from "../components/tooltip.js";

let parseDate = d3.timeParse("%B %d, %Y");

let margin = {top: 20, right: 20, bottom: 30, left: 75};

let dataPointWidth = 7;

export class LineChart {
	constructor(vizSettings, imageFolderId) {
		let {id, tooltipVars, tooltipImageVar, xVars, yVars, colorVars, yScaleType, primaryDataSheet, interpolation, tooltipScrollable} = vizSettings;
		this.id = id;
		this.interpolation = interpolation;
		this.primaryDataSheet = primaryDataSheet;
		this.yScaleType = yScaleType;

		this.svg = d3.select(id).append("svg").attr("class", "line-chart");

		this.renderingArea = this.svg.append("g");

		this.setDimensions();

		this.xScale = d3.scaleTime();
		this.yScale = d3.scaleLinear();

		this.setScales();
		this.setLineScaleFunction();

		this.currXVar = xVars[0];
		this.currXVarName = xVars[0].variable;
		this.currYVar = yVars[0];
		this.currYVarName = yVars[0].variable;
		this.currColorVar = colorVars[0];
		this.currColorVarName = colorVars[0].variable;

		let legendSettings = {};
		legendSettings.id = id;
		legendSettings.showTitle = false;
		legendSettings.markerSettings = { shape:"rect", size:dataPointWidth };
		legendSettings.orientation = "horizontal-center";
		this.legend = new Legend(legendSettings);

		this.tooltip = new Tooltip(id, tooltipVars, tooltipImageVar, imageFolderId, tooltipScrollable);
		
	}

	render(primaryData, secondaryData) {
		this.data = this.processData(primaryData);

		this.yScaleType == "cumulative" ? this.setCumulativeValues() : null;
		  
		this.setXYScaleDomains();

		this.setColorScale();

		this.renderAxes();
        this.renderLines();
        this.renderPoints();

        this.setLegend();
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

	setScales() {
		this.xScale.range([0, this.w]);

		this.yScale.range([this.h, 0]);
	}

	setColorScale() {
		this.colorScale = getColorScale(this.data, this.currColorVar);
	}

	setLineScaleFunction() {
		this.line = d3.line()
		    .x((d, i) => { 
		    	if (d.falseMin) {	
		     		return 0;
		     	} else if (d.falseMax) {
		     		return this.xScale(this.newXMax)
		     	} else {
		     		return this.xScale(d[this.currXVarName]); 
		     	}
		 	})
		    .y((d, i) => { 
		    	if (d.falseMin) {	
		     		return this.yScale(0);
		     	} else if (d.falseMax) {
		     		return this.yScale(d.lastYVal);
		     	} else {
		    		let scaledVal = this.yScaleType == "cumulative" ? d.cumulativeVal : d[this.currYVarName];
		    		return this.yScale(scaledVal); 
		    	}
		    });

		this.interpolation == "step" ? this.line.curve(d3.curveStepAfter) : null;
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
			.text(this.currYVar.displayName);
	}

	renderLines() {
		this.dataLines = {};

        this.dataNest.forEach((d) => {
       		let dataLine = this.renderingArea.append("path")
				.datum(d.values)
				.attr("class", "line-chart__line")
				.attr("d", this.line)
				.attr("stroke", this.colorScale(d.key));

		    this.dataLines[d.key] = dataLine;
	  	})
	}

	renderPoints() {
		this.dataPoints = this.renderingArea.selectAll("rect")
			.data(this.data)
			.enter().append("svg:rect")
			.attr("class", "line-chart__point")
			.attr("x", (d) => { return this.xScale(d[this.currXVarName]) - dataPointWidth/2})
			.attr("y", (d) => {
				let scaledVal = this.yScaleType == "cumulative" ? d.cumulativeVal : d[this.currYVarName]; 
				return this.yScale(scaledVal) - dataPointWidth/2;
			})
			.attr("width", dataPointWidth)
			.attr("height", dataPointWidth)
			.attr("stroke-width", "none")
			.attr("fill", (d) => { return this.colorScale(d[this.currColorVarName])})
			.on("mouseover", (d, index, paths) => { return this.mouseover(d, paths[index], d3.event); })
		    .on("mouseout", (d, index, paths) => { return this.mouseout(paths[index]); });
	}

	processData(data) {
		let retArray = [];
		for (let d of data) {
			if (d[this.currXVarName] && d[this.currYVarName] && d[this.currColorVarName]) {
				if (d[this.currYVarName] != 0) {
					d[this.currXVarName] = parseDate(d[this.currXVarName]);
					retArray.push(d);
				}
			}
		}

		return retArray;
	}

	setXYScaleDomains() {
		let xExtents = d3.extent(this.data, (d) => { return d[this.currXVarName]; });
		let xMinYear = xExtents[0].getFullYear();

		this.newXMin = new Date("January 1, " + (xMinYear - 1) + " 00:00:00");
		this.newXMax = Date.now();
		this.xScale.domain([this.newXMin, this.newXMax]);

		let yExtents = d3.extent(this.data, (d) => { 
			return this.yScaleType == "cumulative" ? d.cumulativeVal : d[this.currYVarName]; 
		});

		this.yScale.domain([0, yExtents[1]]);

		for (let nestObject of this.dataNest) {
			let newMinDatapoint = { falseMin: true };
			let newMaxDatapoint = { falseMax: true };
			let lastVal = nestObject.values[nestObject.values.length - 1];

			newMaxDatapoint.lastYVal = this.yScaleType == "cumulative" ? lastVal.cumulativeVal : lastVal[this.currYVarName];
			nestObject.values.unshift(newMinDatapoint);
			nestObject.values.push(newMaxDatapoint);
		}
	}

	setCumulativeValues() {
		this.dataNest = d3.nest()
	        .key((d) => {return d[this.currColorVarName];})
	        .sortValues((a, b) => {return a[this.currXVarName] - b[this.currXVarName];})
	        .entries(this.data);

	    for (let nestObject of this.dataNest) {
	    	let valSum = 0;

	    	for (let datapoint of nestObject.values) {
	    		valSum += Number(datapoint[this.currYVarName]);
	    		datapoint.cumulativeVal = valSum;
	    	}
	    }
	}

	setLegend() {
		let valCounts = d3.nest()
			.key((d) => { return d[this.currColorVarName]; })
			.rollup((v) => { 
				return d3.sum(v, (d) => { return Number(d[this.currYVarName]); });
			})
			.map(this.data);

		let legendSettings = {};
		legendSettings.format = this.currColorVar.format;
		legendSettings.scaleType = this.currColorVar.scaleType;
		legendSettings.colorScale = this.colorScale;
		legendSettings.valCounts = valCounts;
		legendSettings.valChangedFunction = this.changeVariableValsShown.bind(this);

		this.legend.render(legendSettings);
	}

	resize() {
		this.setDimensions();
		this.setScales();
		this.setLineScaleFunction();

		this.xAxis
			.attr("transform", "translate(0," + this.h + ")")
			.call(d3.axisBottom(this.xScale).tickPadding(10));

		this.yAxis.call(d3.axisLeft(this.yScale).tickPadding(10));
		this.yAxisLabel.attr("x", -this.h/2);

		for (let key of Object.keys(this.dataLines)) {
			this.dataLines[key].attr("d", this.line);
		}

		this.dataPoints
			.attr("x", (d) => { return this.xScale(d[this.currXVarName]) - dataPointWidth/2})
			.attr("y", (d) => {
				let scaledVal = this.yScaleType == "cumulative" ? d.cumulativeVal : d[this.currYVarName]; 
				return this.yScale(scaledVal) - dataPointWidth/2;
			})
	}

	changeVariableValsShown(valsShown) {
		for (let key of Object.keys(this.dataLines)) {
			let binIndex = this.colorScale.domain().indexOf(key);

   			if (valsShown.indexOf(binIndex) > -1) {
   				this.dataLines[key].attr("stroke", this.colorScale(key));
   			} else {
   				this.dataLines[key].attr("stroke", colors.grey.light);
   			}
		}

		this.dataPoints
			.style("fill", (d) => {
		   		var value = d[this.currColorVarName];
		   			let binIndex = this.colorScale.domain().indexOf(value);
		   			if (valsShown.indexOf(binIndex) > -1) {
		   				return this.colorScale(value);
		   			}
		   		return colors.grey.light;
		    });
	}

	mouseover(datum, path, eventObject) {
		let mousePos = [];
		mousePos[0] = eventObject.pageX;
		mousePos[1] = eventObject.pageY;

		let elem = d3.select(path);

		elem
			.attr("stroke", "white")
			.attr("stroke-width", 3.5);
			
		this.tooltip.show(datum, mousePos);
	}

	mouseout(path) {
		let elem = d3.select(path);

		elem
			.attr("stroke", "none");

		this.tooltip.hide();
	}

}