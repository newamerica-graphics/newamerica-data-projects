import $ from 'jquery';

let d3 = require("d3");
import { legendColor } from 'd3-svg-legend';

import { Tooltip } from "./tooltip.js"; 

let dotW = 10;
let dotOffset = 5;

let colorScale, colorVar, dataUrl, tooltip;

export class dotMatrix {
	constructor(inputDataUrl, id, colorVariable, scaleType, tooltipTitleVar, tooltipVariables) {
		dataUrl = inputDataUrl;
		this.w = $(id).width();

		this.svg = d3.select(id)
			.append("svg")
			.attr("width", "100%");

		tooltip = new Tooltip(id, tooltipTitleVar, tooltipVariables);

		
		

		// this.legendSvg = d3.select(id)
		// 	.append("svg")
		// 	.attr("width", "100%");

		colorVar = colorVariable;
		this.scaleType = scaleType;
	}

	initialRender() {
		d3.json(dataUrl, (d) => {
			console.log(d);
			let firstElem = d.Sheet1[0];
			if ( !firstElem.hasOwnProperty(colorVar) ) {
				console.log("Dot Matrix dataset has no field named " + colorVar);
				return;
			}
			this.data = this.processData(d);
			this.sortData();
			this.setScale();
			this.buildGraph();
			// this.addLegend();
		});
	}

	processData(d) {
		let data = d.Sheet1;

		if (this.scaleType === "linear") {
			for (var d of data) {
				if(!$.isNumeric(d[colorVar])) {
					d[colorVar] = null;
				}
			}

		} else if (this.scaleType == "categorical") {
			for (var d of data) {
				// removes leading and trailing whitespace
				d[colorVar] = d[colorVar].trim();
			}
		}

		this.dataLength = data.length;

		return data;
	}

	sortData() {
		if (this.scaleType === "linear") {
			this.data.sort((a, b) => { return a[colorVar] - b[colorVar];});
		} else if (this.scaleType == "categorical") {
			this.data.sort((a, b) => { 
				let elem1 = a[colorVar];
				let elem2 = b[colorVar];

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
		let data = this.data
		if (this.scaleType === "linear") {
			let dataMin = d3.min(data, (d) => { return d[colorVar] ? d[colorVar] : 10000000; });
			let dataMax = d3.max(data, (d) => { return d[colorVar] ? d[colorVar] : -1; });

			colorScale = d3.scaleLinear()
				.domain([dataMin, dataMax])
				.range(["#2ebcb3", "#5ba4da"]);

		} else if (this.scaleType == "categorical") {
			colorScale = d3.scaleOrdinal()
				.range(["#2ebcb3", "#5ba4da", "#a076ac", "#e75c64", "#1a8a84", "#4378a0", "#74557e", "#a64046", "#005753", "#234a67", "#48304f", "#692025"]);
		}
	}

	addLegend(data) {
		let test = d3.nest()
			.key((d) => { return d[colorVar]; })
			.rollup(function(v) { return v.length; })
			.map(data);

		console.log(test.keys());

		// console.log(colorScale.domain());

		// let keys = legendList.selectAll('li')
		// 	.data(colorScale.domain())
		// 	.enter()
		// 	.append("li");

		// keys.append("g")
		// 	.text((d) => { return d; })


		for (var value of colorScale.domain()) {
			console.log(value);
		}

		this.legendSvg.append("g")
		  .attr("class", "legendOrdinal")
		  .attr("transform", "translate(20,20)");

		var legendOrdinal = legendColor()
		  .shape("rect")
		  .orient("horizontal")
		  .shapePadding(100)
		  .scale(colorScale);

		this.legendSvg.select(".legendOrdinal")
		  .call(legendOrdinal);

		 d3.selectAll("g.cell")
		 	.append("text")
		 	.text((d) => { return test.get(d); });

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

	buildGraph() {
		let data = this.data;
		this.setDimensions();

		this.cells = this.svg.selectAll("rect")
			.data(data)
			.enter().append("rect")
			.attr("width", 10)
		    .attr("height", 10)
		    .attr("x", (d, i) => { return this.calcX(i); })
		    .attr("y", (d, i) => { return this.calcY(i); })
		    .attr("fill", (d) => {
		    	return d[colorVar] ? colorScale(d[colorVar]) : "red";
		    })
		    .attr("class", (d) => { return d[colorVar]; })
		    .on("mouseover", this.mouseover)
		    .on("mouseout", this.mouseout);
	}

	setDimensions() {
		this.numCols = Math.floor(this.w/(dotW + dotOffset));
		this.dotsPerCol = Math.ceil(this.dataLength/this.numCols);

		this.h = this.dotsPerCol * (dotW + dotOffset);

		this.svg
			.attr("height", this.h);
	}

	calcX(i) {
		return Math.floor(i/this.dotsPerCol) * (dotW + dotOffset);
	}

	calcY(i) {
		return i%this.dotsPerCol * (dotW + dotOffset);
	}

	resize(w) {
		this.w = w;
		this.setDimensions();

		this.cells
			.attr("x", (d, i) => { return this.calcX(i); })
		    .attr("y", (d, i) => { return this.calcY(i); });
	}

	changeFilter(colorVariable, scaleType) {
		console.log("changing filter");
		colorVar = colorVariable;
		this.scaleType = scaleType;

		this.sortData();
		this.setScale();
		this.cells.remove();
		this.buildGraph();
	}

	mouseover(d) {
		d3.select(this).attr("fill", "orange");
		let mousePos = d3.mouse(this);

		tooltip.show(d, mousePos);
	}

	mouseout() {
		d3.select(this).attr("fill", function(d) {
			console.log(d[colorVar]);
		    return d[colorVar] ? colorScale(d[colorVar]) : "red";
		});

		tooltip.hide();
	}

}