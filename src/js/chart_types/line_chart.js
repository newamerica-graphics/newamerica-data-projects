import $ from 'jquery';

let d3 = require("d3");

import { getColorScale } from "../helper_functions/get_color_scale.js";
import { Legend } from "../components/legend.js";

let parseDate = d3.timeParse("%B %d, %Y");

let margin = {top: 20, right: 20, bottom: 30, left: 50};

let dataPointWidth = 8;

export class LineChart {
	constructor(vizSettings) {
		let {id, tooltipVars, xVars, yVars, colorVars, yScaleType, primaryDataSheet, interpolation} = vizSettings;
		console.log(id);
		this.id = id;
		this.interpolation = interpolation;
		this.primaryDataSheet = primaryDataSheet;
		this.yScaleType = yScaleType;

		this.svg = d3.select(id).append("svg");

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
		
	}

	render(data) {
		this.data = this.processData(data);

		this.yScaleType == "cumulative" ? this.setCumulativeValues() : null;
		  
		this.xScale.domain(d3.extent(this.data, (d) => { return d[this.currXVarName]; }));
		this.yScale.domain(d3.extent(this.data, (d) => { 
			return this.yScaleType == "cumulative" ? d.cumulativeVal : d[this.currYVarName]; 
		}));

		this.setColorScale();

		this.renderAxes();
        this.renderLines();
        this.renderPoints();

        this.setLegend();
	}

	setDimensions() {
		this.w = $(this.id).width() - margin.left - margin.right;
		this.h = this.w/2 - margin.top - margin.bottom;

		this.svg
			.attr("width", this.w + margin.left + margin.right)
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
		console.log(this.xScale.domain());
		this.line = d3.line()
		    .x((d) => { return this.xScale(d[this.currXVarName]); })
		    .y((d) => { 
		    	let scaledVal = this.yScaleType == "cumulative" ? d.cumulativeVal : d[this.currYVarName];
		    	return this.yScale(scaledVal); 
		    });

		this.interpolation == "step" ? this.line.curve(d3.curveStepAfter) : null;
	}

	renderAxes() {
		this.xAxis = this.renderingArea.append("g")
			.attr("class", "axis axis--x")
			.attr("transform", "translate(0," + this.h + ")")
			.call(d3.axisBottom(this.xScale));

		this.yAxis = this.renderingArea.append("g")
			.attr("class", "axis axis--y")
			.call(d3.axisLeft(this.yScale));

		this.yAxis.append("text")
			.attr("class", "axis-title")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Price ($)");
	}

	renderLines() {
		this.dataLines = {};

        this.dataNest.forEach((d) => {
       		let dataLine = this.renderingArea.append("path")
				.datum(d.values)
				.attr("class", "line")
				.attr("d", this.line)
				.attr("stroke", this.colorScale(d.key));

		    this.dataLines[d.key] = dataLine;
	  	})
	}

	renderPoints() {
		this.dataPoints = this.renderingArea.selectAll("rect")
			.data(this.data)
			.enter().append("svg:rect")
			.attr("x", (d) => { return this.xScale(d[this.currXVarName]) - dataPointWidth/2})
			.attr("y", (d) => {
				let scaledVal = this.yScaleType == "cumulative" ? d.cumulativeVal : d[this.currYVarName]; 
				return this.yScale(scaledVal) - dataPointWidth/2;
			})
			.attr("width", dataPointWidth)
			.attr("height", dataPointWidth)
			.attr("stroke-width", "none")
			.attr("fill", (d) => { return this.colorScale(d[this.currColorVarName])});
	}

	processData(data) {
		let retArray = [];
		for (let d of data) {
			if (d[this.currXVarName] && d[this.currYVarName] && d[this.currColorVarName]) {
				d[this.currXVarName] = parseDate(d[this.currXVarName]);
				retArray.push(d);
			}
		}

		return retArray;
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
	    		console.log(datapoint[this.currXVarName], datapoint.cumulativeVal);
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
			.call(d3.axisBottom(this.xScale));

		this.yAxis.call(d3.axisLeft(this.yScale));

		for (let key of Object.keys(this.dataLines)) {
			this.dataLines[key].attr("d", this.line);
		}
	}

	changeVariableValsShown(valsShown) {
		for (let key of Object.keys(this.dataLines)) {
			let binIndex = this.colorScale.domain().indexOf(key);

   			if (valsShown.indexOf(binIndex) > -1) {
   				this.dataLines[key].attr("stroke", this.colorScale(key));
   			} else {
   				this.dataLines[key].attr("stroke", "grey");
   			}
		}

		this.dataPoints
			.style("fill", (d) => {
		   		var value = d[this.currColorVarName];
		   			let binIndex = this.colorScale.domain().indexOf(value);
		   			if (valsShown.indexOf(binIndex) > -1) {
		   				return this.colorScale(value);
		   			}
		   		return "grey";
		    });
	}

}