import $ from 'jquery';

let d3 = require("d3");

import { Chart } from "../layouts/chart.js";
import { Legend } from "../components/legend.js";

import { legendColor } from 'd3-svg-legend';

import { getColorScale } from "../helper_functions/get_color_scale.js";

import { Tooltip } from "../components/tooltip.js"; 

let dotW = 10;
let dotOffset = 5;

export class DotMatrix extends Chart {
	constructor(vizSettings) {
		let {id, tooltipVars, filterVars} = vizSettings;
		super(id);

		this.id = id;
		this.w = $(id).width();

		let chartContainer = d3.select(id)
			.append("div");

		this.svg = chartContainer
			.append("svg")
			.attr("width", "100%");

		this.tooltip = new Tooltip(id, "full_name", tooltipVars);
		this.legend = new Legend(id);

		console.log(filterVars[0]);
		this.currFilter = filterVars[0];
		this.currFilterVar = filterVars[0].variable;

		// this.legendSvg = d3.select(id)
		// 	.append("svg")
		// 	.attr("width", "100%");

	}

	render(data) {
		console.log("rendering");
		this.data = this.processData(data);
		this.setDimensions();
		this.sortData();
		this.setScale();
		this.buildGraph();
		this.setLegend();

		super.render();
	}

	processData(data) {
		console.log(this.currFilterVar);
		if (this.currFilter.scaleType === "linear") {
			for (var d of data) {
				if(!$.isNumeric(d[this.currFilterVar])) {
					d[this.currFilterVar] = null;
				}
			}

		} else if (this.currFilter.scaleType == "categorical") {
			for (var d of data) {
				console.log(d["field_kids"]);
				// removes leading and trailing whitespace
				d[this.currFilterVar] ? d[this.currFilterVar] = d[this.currFilterVar].trim() : null;
			}
		}

		this.dataLength = data.length;

		return data;
	}

	sortData() {
		if (this.currFilter.scaleType === "linear") {
			this.data.sort((a, b) => { return a[this.currFilterVar] - b[this.currFilterVar];});
		} else if (this.currFilter.scaleType == "categorical") {
			this.data.sort((a, b) => { 
				let elem1 = a[this.currFilterVar];
				let elem2 = b[this.currFilterVar];

				if (!elem1) {
					return 1;
				}

				if (!elem2) {
					return -1;
				}

				if (elem1 < elem2) {
				    return -1;
				} else if (elem1 > elem2) {
					return 1;
				} else {
					return 0;
				}
			});
		}
	}

	setScale() {
		let colorScaleSettings = {};

		// let data = this.data
		if (this.currFilter.scaleType === "linear") {
			// let dataMin = d3.min(data, (d) => { return d[this.currFilterVar] ? d[this.currFilterVar] : 10000000; });
			// let dataMax = d3.max(data, (d) => { return d[this.currFilterVar] ? d[this.currFilterVar] : -1; });

			// colorScale = d3.scaleLinear()
			// 	.domain([dataMin, dataMax])
			// 	.range(["#2ebcb3", "#5ba4da"]);

		} else if (this.currFilter.scaleType == "categorical") {
			let uniqueVals = d3.nest()
				.key((d) => { return d[this.currFilterVar]; })
				.map(this.data);

			console.log(uniqueVals.keys());

			colorScaleSettings.scaleType = "categorical";
			colorScaleSettings.numBins = uniqueVals.keys().length;

			this.colorScale = getColorScale(colorScaleSettings);

		}
	}

	

	buildGraph() {
		let data = this.data;

		this.cells = this.svg.selectAll("rect")
			.data(data)
			.enter().append("rect")
			.attr("width", 10)
		    .attr("height", 10)
		    .attr("x", (d, i) => { return this.calcX(i); })
		    .attr("y", (d, i) => { return this.calcY(i); })
		    .attr("fill", (d) => {
		    	return this.colorScale(d[this.currFilterVar]);
		    })
		    .attr("class", (d) => { return d[this.currFilterVar]; })
		    .on("mouseover", (d, index, paths) => { return this.mouseover(d, paths[index]); })
		    .on("mouseout", (d, index, paths) => { return this.mouseout(paths[index]); });
	}

	setDimensions() {
		this.w = $(this.id).width();
		let numCols = Math.floor(this.w/(dotW + dotOffset));
		this.dotsPerCol = Math.ceil(this.dataLength/numCols);

		this.h = this.dotsPerCol * (dotW + dotOffset);

		this.svg
			.attr("height", this.h);
	}

	setLegend() {
		let legendSettings = {};
		legendSettings.title = this.currFilter.displayName;
		legendSettings.format = this.currFilter.format;
		legendSettings.scaleType = this.currFilter.scaleType;
		legendSettings.colorScale = this.colorScale;
		// legendSettings.valChangedFunction = this.changeVariableValsShown.bind(this);

		this.legend.render(legendSettings);
		// let test = d3.nest()
		// 	.key((d) => { return d[this.currFilterVar]; })
		// 	.rollup(function(v) { return v.length; })
		// 	.map(data);

		// console.log(test.keys());

		// console.log(colorScale.domain());

		// let keys = legendList.selectAll('li')
		// 	.data(colorScale.domain())
		// 	.enter()
		// 	.append("li");

		// keys.append("g")
		// 	.text((d) => { return d; })


		// for (var value of colorScale.domain()) {
		// 	console.log(value);
		// }

		// this.legendSvg.append("g")
		//   .attr("class", "legendOrdinal")
		//   .attr("transform", "translate(20,20)");

		// var legendOrdinal = legendColor()
		//   .shape("rect")
		//   .orient("horizontal")
		//   .shapePadding(100)
		//   .scale(colorScale);

		// this.legendSvg.select(".legendOrdinal")
		//   .call(legendOrdinal);

		//  d3.selectAll("g.cell")
		//  	.append("text")
		//  	.text((d) => { return test.get(d); });

		// var width = 360;
  //       var height = 360;
  //       var radius = Math.min(width, height) / 2;
  //       var donutWidth = 75;
  //       var legendRectSize = 18;
  //       var legendSpacing = 4;

		// var legend = this.legendSvg.selectAll('.legend')
  //           .data(colorScale.domain())
  //           .enter()
  //           .append('g')
  //           .attr('class', 'legend')
  //           .attr('transform', function(d, i) {
  //             var height = legendRectSize + legendSpacing;
  //             var offset =  height * colorScale.domain().length / 2;
  //             var horz = 2 * legendRectSize;
  //             var vert = i * height - offset;
  //             return 'translate(' + horz + ',' + vert + ')';
  //           });

  //         legend.append('rect')
  //           .attr('width', legendRectSize)
  //           .attr('height', legendRectSize)                                   
  //           .style('fill', "red")
  //           .style('stroke', "red");
            
  //         legend.append('text')
  //           .attr('x', legendRectSize + legendSpacing)
  //           .attr('y', legendRectSize - legendSpacing)
  //           .text(function(d) { return d; });
	}

	calcX(i) {
		return Math.floor(i/this.dotsPerCol) * (dotW + dotOffset);
	}

	calcY(i) {
		return i%this.dotsPerCol * (dotW + dotOffset);
	}

	resize() {
		this.setDimensions();

		this.cells
			.attr("x", (d, i) => { return this.calcX(i); })
		    .attr("y", (d, i) => { return this.calcY(i); });
	}

	// changeFilter(colorVar, scaleType) {
	// 	console.log("changing filter");
	// 	this.currFilterVar = this.currFilterVariable;
	// 	this.scaleType = scaleType;

	// 	this.sortData();
	// 	this.setScale();
	// 	this.cells.remove();
	// 	this.buildGraph();
	// }

	mouseover(datum, path) {
		d3.select(path).attr("fill", "orange");
		let mousePos = d3.mouse(path);
		console.log(datum);
		this.tooltip.show(datum, mousePos);
	}

	mouseout(path) {
		d3.select(path).attr("fill", (d) => {
		    return this.colorScale(d[this.currFilterVar]);
		});

		this.tooltip.hide();
	}

}