import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";
import { Legend } from "../components/legend.js";
import { Tooltip } from "../components/tooltip.js";



let margin = {top: 20, right: 20, bottom: 30, left: 75};

export class StepChart {
	constructor(vizSettings, imageFolderId) {
		Object.assign(this, vizSettings);
		this.dateParser = d3.timeParse(this.timeFormat);

		this.svg = d3.select(this.id).append("svg").attr("class", "line-chart");

		this.renderingArea = this.svg.append("g");

		this.setDimensions();

		this.xScale = d3.scaleTime();
		this.yScale = d3.scaleLinear();

		this.setScales();
		this.setLineScaleFunction();

		this.currXVar = this.xVars[0];
		this.currXVarName = this.xVars[0].variable;
		this.currYVar = this.yVars[0];
		this.currYVarName = this.yVars[0].variable;
		this.currColorVar = this.colorVars ? this.colorVars[0] : null;
		this.currColorVarName = this.colorVars ? this.colorVars[0].variable : null;

		let legendSettings = {};
		legendSettings.id = this.id;
		legendSettings.showTitle = false;
		legendSettings.markerSettings = { shape:this.dotSettings.shape, size:this.dotSettings.width };
		legendSettings.orientation = "horizontal-center";
		this.legend = new Legend(legendSettings);

		let tooltipSettings = { "id":this.id, "tooltipVars":this.tooltipVars, "tooltipImageVar":this.tooltipImageVar, "imageFolderId":this.imageFolderId, "tooltipScrollable":this.tooltipScrollable }
		this.tooltip = new Tooltip(tooltipSettings);
		
	}

	render(data) {
		this.data = this.timeFormat ? this.processData(data[this.primaryDataSheet]) : data[this.primaryDataSheet];

		this.yScaleType == "cumulative" ? this.setCumulativeValues() : this.setSimpleValues();
		  
		this.setXYScaleDomains();

		this.colorVars ? this.setColorScale() : null;

		this.renderAxes();
        this.renderLines();
        this.renderPoints();

        this.colorVars ? this.setLegend() : null;
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
		    this.dataLines[d.key] = this.renderLine(d);
	  	})
	}

	renderLine(data) {
		let line = this.renderingArea.append("path")
			.datum(data.values)
			.attr("class", "line-chart__line")
			.attr("d", this.line)
			.attr("stroke", this.colorScale ? this.colorScale(data.key) : colors.turquoise.light);

		return line;
	}

	renderPoints() {
		const {dotSettings} = this;
		this.dataPoints = this.renderingArea.selectAll(dotSettings.shape)
			.data(this.data)
			.enter().append("svg:" + dotSettings.shape)
			.attr("class", "line-chart__point")
			.attr("stroke-width", "2px")
			.attr("stroke", (d) => { return this.colorScale ? this.colorScale(d[this.currColorVarName]) : colors.turquoise.light})
			.attr("fill", "white")
			.on("mouseover", (d, i) => { return this.mouseover(d, i, d3.event); })
		    .on("mouseout", () => { return this.mouseout(); });

		if (dotSettings.shape == "rect") {
			this.dataPoints
				.attr("x", (d) => { return this.xScale(d[this.currXVarName]) - this.dotSettings.width/2})
				.attr("y", (d) => {
					let scaledVal = this.yScaleType == "cumulative" ? d.cumulativeVal : d[this.currYVarName]; 
					return this.yScale(scaledVal) - this.dotSettings.width/2;
				})
				.attr("width", this.dotSettings.width)
				.attr("height", this.dotSettings.width)
		} else {
			this.dataPoints
				.attr("cx", (d) => { return this.xScale(d[this.currXVarName])})
				.attr("cy", (d) => {
					let scaledVal = this.yScaleType == "cumulative" ? d.cumulativeVal : d[this.currYVarName]; 
					return this.yScale(scaledVal);
				})
				.attr("r", this.dotSettings.width/2);
		}
	}

	processData(data) {
		let retArray = [];
		for (let d of data) {
			if (d[this.currXVarName] && d[this.currYVarName]) {
				if (d[this.currYVarName] != 0) {
					console.log(d[this.currXVarName]);
					d[this.currXVarName] = this.dateParser(d[this.currXVarName]);
					retArray.push(d);
				}
			}
		}

		return retArray;
	}

	setXYScaleDomains() {
		let xExtents = d3.extent(this.data, (d) => { console.log(d, this.currXVarName); return d[this.currXVarName]; });
		console.log(xExtents)

		if (this.currXVar.clampScale) {
			this.xScale.domain(xExtents);
		} else {
			let xMinYear = xExtents[0].getFullYear();

			this.newXMin = new Date("January 1, " + (xMinYear - 1) + " 00:00:00");
			this.newXMax = Date.now();
			this.xScale.domain([this.newXMin, this.newXMax]);
		}


		if (this.currYVar.customDomain) {
			this.yScale.domain(this.currYVar.customDomain);
		} else {
			let yExtents = d3.extent(this.data, (d) => { 
				return this.yScaleType == "cumulative" ? d.cumulativeVal : d[this.currYVarName]; 
			});

			this.yScale.domain([0, yExtents[1]]);
		}

		if (this.yScaleType == "cumulative") {
			for (let nestObject of this.dataNest) {
				let newMinDatapoint = { falseMin: true };
				let newMaxDatapoint = { falseMax: true };
				let lastVal = nestObject.values[nestObject.values.length - 1];

				newMaxDatapoint.lastYVal = this.yScaleType == "cumulative" ? lastVal.cumulativeVal : lastVal[this.currYVarName];
				nestObject.values.unshift(newMinDatapoint);
				nestObject.values.push(newMaxDatapoint);
			}
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

	setSimpleValues() {
		this.dataNest = d3.nest()
	        .key((d) => {return this.currXVarName;})
	        .sortValues((a, b) => {return a[this.currXVarName] - b[this.currXVarName];})
	        .entries(this.data);
	}

	setLegend() {
		let valCounts = d3.nest()
			.key((d) => { return d[this.currColorVarName]; })
			.rollup((v) => { 
				return d3.sum(v, (d) => { return Number(d[this.currYVarName]); });
			})
			.map(this.data);

		let legendSettings = {};
		legendSettings.format = this.currColorVar ? this.currColorVar.format : this.currYVar.format;
		legendSettings.scaleType = this.currColorVar ? this.currColorVar.scaleType : this.currYVar.scaleType;
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
			.attr("x", (d) => { return this.xScale(d[this.currXVarName]) - this.dotSettings.width/2})
			.attr("y", (d) => {
				let scaledVal = this.yScaleType == "cumulative" ? d.cumulativeVal : d[this.currYVarName]; 
				return this.yScale(scaledVal) - this.dotSettings.width/2;
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
		    .attr("stroke", (d) => {
		   		var value = d[this.currColorVarName];
		   			let binIndex = this.colorScale.domain().indexOf(value);
		   			if (valsShown.indexOf(binIndex) > -1) {
		   				return this.colorScale(value);
		   			}
		   		return colors.grey.light;
		    });
	}

	mouseover(datum, index, eventObject) {
		let mousePos = [];
		mousePos[0] = eventObject.pageX;
		mousePos[1] = eventObject.pageY;

		this.dataPoints.attr("fill", (d) => { 
			if (datum == d) {
				return this.colorScale ? this.colorScale(d[this.currColorVarName]) : colors.turquoise.light;
			} else {
				return "white";
			}
		})
			
		this.tooltip.show(datum, mousePos);
	}

	mouseout() {
		this.dataPoints.attr("fill", "white")

		this.tooltip.hide();
	}

}