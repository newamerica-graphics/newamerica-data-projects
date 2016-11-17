import $ from 'jquery';

let d3 = require("d3");

let margin = { top: 100, bottom: 100 };

let minNodeOffset = 20,
	nodeWidth = 200;

export class Bipartite {
	constructor(vizSettings, imageFolderId) {
		let {id, primaryDataSheet, keyVar, leftVar, rightVar} = vizSettings;

		this.id = id;
		this.primaryDataSheet = primaryDataSheet;
		this.keyVar = keyVar.variable;
		this.leftVar = leftVar.variable;
		this.rightVar = rightVar.variable;

		this.svg = d3.select(id).append("svg")
			.attr("class", "bipartite");

		this.leftNodeBox = this.svg.append("g");

		this.rightNodeBox = this.svg.append("g");
	}

	setDimensions() {
		this.w = $(this.id).width();
		this.svg
			.attr("width", this.w)
		    .attr("height", this.h);

		this.leftNodeBox
			.attr("width", nodeWidth)
			.attr("height", this.h)
			.attr("transform", "translate(" + nodeWidth + ",0)");

		this.rightNodeBox
			.attr("width", nodeWidth)
			.attr("height", this.h)
			.attr("transform", "translate(" + (this.w - nodeWidth) + ",0)");

		this.leftY = nodeWidth,
		this.rightY = this.w - nodeWidth;
	}

	render(data) {
		this.data = data[this.primaryDataSheet];
		// this.data = this.formatData(data[this.primaryDataSheet]);
		this.getVals();
		this.setNodeOffsets();
		this.setDimensions();
		this.renderNodes();
		this.renderLinks();
	}

	getVals() {
		let rightVals = new Set();
		this.leftVals = [];
		this.linkVals = [];

		for (let item of this.data) {
			if (item[this.leftVar]) {
				this.leftVals.push(item[this.keyVar]);
				item[this.leftVar].split(", ").forEach((d) => {
					rightVals.add(d);
					this.linkVals.push([item[this.keyVar], d]);
				});
			}
		}
		this.rightVals = Array.from(rightVals).sort(d3.ascending);
		console.log(this.linkVals);
	}

	setNodeOffsets() {
		let leftValLength = this.leftVals.length,
			rightValLength = this.rightVals.length;

		if (leftValLength > rightValLength) {
			this.leftNodeOffset = minNodeOffset;
			this.h = leftValLength * minNodeOffset;
			this.rightNodeOffset = this.h/rightValLength;
		} else {
			this.rightNodeOffset = minNodeOffset;
			this.h = rightValLength * minNodeOffset;
			this.leftNodeOffset = this.h/leftValLength;
		}
	}

	renderNodes() {
		this.leftNodes = {};
		this.rightNodes = {};

		let i = 0;
		for (let leftVal of this.leftVals) {
			this.leftNodes[leftVal] = this.leftNodeBox
				.append("text")
				.attr("class", "bipartite__node")
				.attr("transform", "translate(0, " + i*this.leftNodeOffset + ")")
			  	.attr("index", i)
				.style("text-anchor", "end")
			  	.text(leftVal)
			  	.on("mouseover", (d) => { return this.mouseoverLeft(leftVal); })
			  	.on("mouseout", this.mouseout);

			i++;
		}

		let j = 0;
		for (let rightVal of this.rightVals) {
			this.rightNodes[rightVal] = this.rightNodeBox
				.append("text")
				.attr("class", "bipartite__node")
				.attr("transform", "translate(0, " + j*this.rightNodeOffset + ")")
			  	.attr("index", j)
				.style("text-anchor", "beginning")
			  	.text(rightVal)
			  	.on("mouseover", (d) => { return this.mouseoverRight(rightVal); })
			  	.on("mouseout", this.mouseout);

			j++;
		}
	}

	renderLinks() {
		this.links = this.svg.selectAll("path")
			.data(this.linkVals)
		  .enter().append("path")
			.attr("class", "bipartite__link")
			.attr("d", (d) => { return this.setPath(d); });
	}

	setPath(d) {
		let leftX = this.getYCoord(d[0], "left"),
			rightX = this.getYCoord(d[1], "right");

		return "M" + this.leftY + "," + leftX
		    + "C" + (this.leftY + this.rightY) / 2 + "," + leftX
		    + " " + (this.leftY + this.rightY) / 2 + "," + rightX
		    + " " + this.rightY + "," + rightX;
	}

	getYCoord(id, side) {
		let yIndex;
		if (side == "left") {
			console.log(this.leftNodes[id]);
			yIndex = this.leftNodes[id].attr("index");
			return yIndex * this.leftNodeOffset;
		} else {
			console.log(this.rightNodes[id]);
			yIndex = this.rightNodes[id].attr("index");
			return yIndex * this.rightNodeOffset;
		}

		
	}

	mouseoverLeft(id) {
		$(".bipartite__node")
			.removeClass("active")
			.addClass("inactive");

		this.leftNodes[id].classed("active", true).classed("inactive", false);
		
		let targets = [];

		this.links
			.attr("class", (d) => { 
				if (d[0] === id) {
					targets.push(d[1]);
					return "bipartite__link active";
				} else {
					return "bipartite__link inactive";
				}
			});

		for (let targetId of targets) {
			this.rightNodes[targetId].classed("active", true).classed("inactive", false);
		}
	}

	mouseoverRight(id) {
		console.log(id);
		console.log(this.rightNodes[id]);
		$(".bipartite__node")
			.removeClass("active")
			.addClass("inactive");

		this.rightNodes[id].classed("active", true).classed("inactive", false);
		let sources = [];

		this.links
			.attr("class", (d) => { 
				if (d[1] === id) {
					sources.push(d[0]);
					return "bipartite__link active";
				} else {
					return "bipartite__link inactive";
				}
			});

		for (let sourceId of sources) {
			this.leftNodes[sourceId].classed("active", true).classed("inactive", false);
		}
	}

	mouseout() {
		$(".active").removeClass("active");
		$(".inactive").removeClass("inactive");
	}

	resize() {
		this.setDimensions();

		this.links.attr("d", (d) => { return this.setPath(d); });
	}
}