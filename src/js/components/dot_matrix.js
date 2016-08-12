import $ from 'jquery';
import Tabletop from 'tabletop';

let d3 = require("d3");
let grid = require('d3-grid-layout')(d3);

let dotW = 10;
let dotOffset = 5;

let colorScale, colorVar, dataUrl;

export class dotMatrix {
	constructor(inputDataUrl, id, colorVariable, scaleType) {
		dataUrl = inputDataUrl;
		this.w = $(id).width();

		this.svg = d3.select(id)
			.append("svg")
			.attr("width", "100%");

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
			let processedData = this.processData(d);
			this.setScale(processedData);
			this.buildGraph(processedData);
		});
	}

	setScale(data) {
		if (this.scaleType === "linear") {
			let dataMin = d3.min(data, (d) => { return d[colorVar] ? d[colorVar] : 10000000; });
			let dataMax = d3.max(data, (d) => { return d[colorVar] ? d[colorVar] : -1; });

			colorScale = d3.scaleLinear()
				.domain([dataMin, dataMax])
				.range(["#2ebcb3", "#5ba4da"]);

		} else if (this.scaleType == "categorical") {
			colorScale = d3.scaleOrdinal()
				.range(["#2ebcb3", "#5ba4da", "#a076ac", "#e75c64", "#1a8a84"]);
		}
	}

	processData(d) {
		let data = d.Sheet1;
		for (var d of data) {
			if(!$.isNumeric(d[colorVar])) {
				d[colorVar] = null;
			}
		}

		data = data.sort((a, b) => { return a[colorVar] - b[colorVar];});

		this.dataLength = data.length;

		return data;
	}

	buildGraph(data) {
		this.setDimensions();

		this.cells = this.svg.selectAll("rect")
			.data(data)
			.enter().append("rect")
			.attr("width", 10)
		    .attr("height", 10)
		    .attr("x", (d, i) => { return this.calcX(i); })
		    .attr("y", (d, i) => { return this.calcY(i); })
		    .attr("fill", (d) => {
		    	console.log(d["field_gender"]);
		    	return d[colorVar] ? colorScale(d[colorVar]) : "red";
		    })
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

	mouseover(d) {
		d3.select(this).attr("fill", "orange");
	}

	mouseout() {
		d3.select(this).attr("fill", function(d) {
			console.log(d);
		    return d[colorVar] ? colorScale(d[colorVar]) : "red";
		});
	}

}