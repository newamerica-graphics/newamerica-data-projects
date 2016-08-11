import $ from 'jquery';
import Tabletop from 'tabletop';

let d3 = require("d3");
let grid = require('d3-grid-layout')(d3);

let dotW = 10;
let dotOffset = 10;

export class dotMatrix {
	constructor(id, w, scaleType) {
		this.w = w;

		this.scaleType = scaleType;

		this.svg = d3.select(id)
			.append("svg")
			.attr("width", "100%");
	}

	initialRender() {
		d3.json("https://na-data-projects.s3.amazonaws.com/data/isp/homegrown.json", (d) => {
			console.log(d);
			this.setScale();
			this.buildGraph(d.Sheet1);
		});
	}

	setScale() {
		if (this.scaleType === "linear") {
			this.colorScale = d3.scaleLinear()
				.domain([0,100])
				.range(["white", "blue"]);
		}
	}

	buildGraph(data) {

		for (var d of data) {
			if(!$.isNumeric(d.field_age)) {
				d.field_age = -1;
			}
		}

		data = data.sort(function(a, b) { return a.field_age - b.field_age;});

		this.dataLength = data.length;

		this.setDimensions();

		this.cells = this.svg.selectAll("rect")
			.data(data)
			.enter().append("rect")
			.attr("width", 10)
		    .attr("height", 10)
		    .attr("x", (d, i) => { return this.calcX(i); })
		    .attr("y", (d, i) => { return this.calcY(i); })
		    .attr("fill", (d) => {
		    	return d.field_age > 0 ? this.colorScale(d.field_age) : "red";
		    })
		    .on("mouseover", function(d) {
		    	console.log(d.field_age);
		    });
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

}