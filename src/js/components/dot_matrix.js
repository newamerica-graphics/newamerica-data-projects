import $ from 'jquery';
import Tabletop from 'tabletop';

let d3 = require("d3");
let grid = require('d3-grid-layout')(d3);

let dotW = 10;
let dotOffset = 10;

export class dotMatrix {
	constructor(id, colorVar, scaleType) {
		this.w = $(id).width();

		this.svg = d3.select(id)
			.append("svg")
			.attr("width", "100%");

		this.colorVar = colorVar;
		this.scaleType = scaleType;
	}

	initialRender() {
		d3.json("https://na-data-projects.s3.amazonaws.com/data/isp/homegrown.json", (d) => {
			console.log(d);
			let firstElem = d.Sheet1[0];
			if ( !firstElem.hasOwnProperty(this.colorVar) ) {
				console.log("Dot Matrix dataset has no field named " + this.colorVar);
				return;
			}
			let processedData = this.processData(d);
			this.setScale(processedData);
			this.buildGraph(processedData);
		});
	}

	setScale(data) {
		if (this.scaleType === "linear") {
			let dataMin = d3.min(data, (d) => { return d[this.colorVar] ? d[this.colorVar] : 10000000; });
			let dataMax = d3.max(data, (d) => { return d[this.colorVar] ? d[this.colorVar] : -1; });

			this.colorScale = d3.scaleLinear()
				.domain([dataMin, dataMax])
				.range(["white", "blue"]);
		}
	}

	processData(d) {
		let data = d.Sheet1;
		for (var d of data) {
			if(!$.isNumeric(d[this.colorVar])) {
				d[this.colorVar] = null;
			}
		}

		data = data.sort((a, b) => { return a[this.colorVar] - b[this.colorVar];});

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
		    	return d[this.colorVar] ? this.colorScale(d[this.colorVar]) : "red";
		    })
		    .on("mouseover", function(d) {
		    	console.log(d.field_age);
		    });
	}

	resize(w) {
		this.w = w;
		this.setDimensions();

		this.cells
			.attr("x", (d, i) => { return this.calcX(i); })
		    .attr("y", (d, i) => { return this.calcY(i); });
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

}