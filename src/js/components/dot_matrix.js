import $ from 'jquery';
import Tabletop from 'tabletop';

let d3 = require("d3");
let grid = require('d3-grid-layout')(d3);

let dotW = 10;
let dotOffset = 10;

export class dotMatrix {
	constructor(id, w) {
		this.w = w;

		this.svg = d3.select(id)
			.append("svg")
			.attr("width", w)
			.attr("height", 500);
	}

	initialRender() {
		let self = this;

		d3.json("https://na-data-projects.s3.amazonaws.com/data/isp/homegrown.json", function(d) {
			console.log(d);
			self.buildGraph(d.Sheet1);
		});
	}

	buildGraph(data) {
		this.dataLength = data.length;
		console.log(data);

		let numCols = Math.floor(this.w/(dotW + dotOffset));
		let dotsPerCol = Math.ceil(this.dataLength/numCols);

		console.log("width " + this.w);
		console.log("dataLength " + this.dataLength);
		console.log("numCols " + numCols);
		console.log("dotsPerCol " + dotsPerCol);

		this.cells = this.svg.selectAll("rect")
			.data(data)
			.enter().append("rect")
			.attr("width", 10)
		    .attr("height", 10)
		    .attr("x", function(d, i) {
		       	return Math.floor(i/dotsPerCol) * (dotW + dotOffset);
		    }) 
		    .attr("y", function(d, i) {
		    	// console.log(i);
		        return i%dotsPerCol * (dotW + dotOffset);
		    });

	}

	updateDimensions(w) {
		this.w = w;
		this.h = 1000;

		this.svg
			.attr("width", this.w)
			.attr("height", this.h);

		let numCols = Math.floor(this.w/(dotW + dotOffset));
		let dotsPerCol = Math.ceil(this.dataLength/numCols);

		this.cells
			.attr("x", function(d, i) {
		       	return Math.floor(i/dotsPerCol) * (dotW + dotOffset);
		    }) 
		    .attr("y", function(d, i) {
		    	// console.log(i);
		        return i%dotsPerCol * (dotW + dotOffset);
		    });
	}

}