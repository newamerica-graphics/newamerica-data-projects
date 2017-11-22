import $ from 'jquery';

let d3 = require("d3");

let minNodeOffset = 20,
	nodeWidth = 210;

let nodeXPadding = 7;

let graphTopPadding = 60;

let transitionDuration = 850,
	transitionOffset = 100;

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

		// this.leftColumnTitle = this.svg.append("g");

		this.leftColumnTitle = this.svg
			.append("text")
			.attr("y", 0)
			.attr("x", 0)
			.style("text-anchor", "end")
			.attr("class", "bipartite__column-title")
			.text(leftVar.displayName);

		// this.rightColumnTitle = this.svg.append("g");

		this.rightColumnTitle = this.svg
			.append("text")
			.attr("y", 0)
			.attr("x", 0)
			.style("text-anchor", "beginning")
			.attr("class", "bipartite__column-title")
			.text(rightVar.displayName)

		this.leftNodeBox = this.svg.append("g");

		this.rightNodeBox = this.svg.append("g");
	}

	setDimensions() {
		this.w = $(this.id).width();
		this.svg
			.attr("width", "100%")
		    .attr("height", this.h + graphTopPadding);

		this.leftX = nodeWidth - transitionOffset,
		this.rightX = this.w - (nodeWidth - transitionOffset);
		this.transformLeftX = nodeWidth;
		this.transformRightX = this.w - (nodeWidth - transitionOffset) - transitionOffset;

		this.leftColumnTitle
			// .attr("width", nodeWidth)
			// .attr("height", "100")
			.attr("transform", "translate(" + (nodeWidth - transitionOffset) + "," + graphTopPadding/2 + ")");

		this.rightColumnTitle
			// .attr("width", nodeWidth)
			// .attr("height", "100")
			.attr("transform", "translate(" + (this.w - nodeWidth + transitionOffset) + "," + graphTopPadding/2 + ")");

		this.leftNodeBox
			.attr("width", nodeWidth)
			.attr("height", this.h)
			.attr("transform", "translate(" + nodeWidth + "," + graphTopPadding + ")");

		this.rightNodeBox
			.attr("width", nodeWidth)
			.attr("height", this.h)
			.attr("transform", "translate(" + (this.w - nodeWidth) + "," + graphTopPadding + ")");

		
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
		this.leftVals.sort(d3.ascending);
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
				.attr("class", "bipartite__node left")
				.attr("transform", "translate(-" + transitionOffset + ", " + i*this.leftNodeOffset + ")")
			  	.attr("index", i)
				.style("text-anchor", "end")
			  	.text(leftVal)
			  	.on("mouseover", (d) => { return this.mouseoverLeft(leftVal); })
			  	.on("mouseout", this.mouseout.bind(this));

			i++;
		}

		let j = 0;
		for (let rightVal of this.rightVals) {
			this.rightNodes[rightVal] = this.rightNodeBox
				.append("text")
				.attr("class", "bipartite__node right")
				.attr("transform", "translate(" + transitionOffset + ", " + j*this.rightNodeOffset + ")")
			  	.attr("index", j)
				.style("text-anchor", "beginning")
			  	.text(rightVal)
			  	.on("mouseover", (d) => { return this.mouseoverRight(rightVal); })
			  	.on("mouseout", this.mouseout.bind(this));

			j++;
		}
	}

	renderLinks() {
		this.links = this.svg.selectAll("path")
			.data(this.linkVals)
		  .enter().append("path")
			.attr("class", "bipartite__link")
			.attr("d", (d) => { return this.setInitialPath(d); });
	}

	setInitialPath(d) {
		let leftY = this.getYCoord(d[0], "left"),
			rightY = this.getYCoord(d[1], "right");

		return this.pathFunction(this.leftX, this.rightX, leftY, rightY);
	}

	setTransformPath(d, side, newY) {
		let leftX, rightX, leftY, rightY;
		if (side == "left") {
			leftX = this.transformLeftX;
			rightX = this.rightX;
			leftY = newY;
			rightY = this.getYCoord(d[1], "right");
		} else {
			leftX = this.leftX;
			rightX = this.transformRightX
			rightY = newY;
			leftY = this.getYCoord(d[0], "left");
		}
		
		return this.pathFunction(leftX, rightX, leftY, rightY);
	}

	pathFunction(leftX, rightX, leftY, rightY) {
		leftX += nodeXPadding;
		rightX -= nodeXPadding;
		leftY += graphTopPadding;
		rightY += graphTopPadding;

		return "M" + leftX + "," + leftY
		    + "C" + (leftX + rightX) / 2 + "," + leftY
		    + " " + (leftX + rightX) / 2 + "," + rightY
		    + " " + rightX + "," + rightY;
	}

	getYCoord(id, side) {
		let yIndex;
		if (side == "left") {
			yIndex = this.leftNodes[id].attr("index");
			return yIndex * this.leftNodeOffset;
		} else {
			yIndex = this.rightNodes[id].attr("index");
			return yIndex * this.rightNodeOffset;
		}

		
	}

	mouseoverLeft(id) {
		$(".bipartite__node")
			.removeClass("active")
			.addClass("inactive");

		this.leftNodes[id].classed("active", true).classed("inactive", false);
		let sourceYCoord = this.getYCoord(id, "left");
		let targets = [];

		this.links
			.attr("class", (d, index, paths) => { 
				if (d[0] === id) {
					targets.push({id:d[1], link: paths[index]});
					return "bipartite__link active";
				} else {
					return "bipartite__link inactive";
				}
			});

		let i = 0;
		let newYBase = this.setTransformYBase(sourceYCoord, targets.length);
		for (let target of targets) {
			let newY = newYBase + i*minNodeOffset;
			this.rightNodes[target.id]
				.classed("active", true)
				.classed("inactive", false)
				.transition()
				.duration(transitionDuration)
				.attr("transform", "translate(0, " + newY + ")");

			i++;

			d3.select(target.link)
				.transition()
				.duration(transitionDuration)
				.attr("d", (d) => { return this.setTransformPath(d, "right", newY)} );
		}
	}

	mouseoverRight(id) {
		$(".bipartite__node")
			.removeClass("active")
			.addClass("inactive");

		this.rightNodes[id].classed("active", true).classed("inactive", false);
		let targetYCoord = this.getYCoord(id, "right");
		let sources = [];

		this.links
			.attr("class", (d, index, paths) => { 
				if (d[1] === id) {
					sources.push({id:d[0], link: paths[index]});
					return "bipartite__link active";
				} else {
					return "bipartite__link inactive";
				}
			});

		let i = 0;

		let newYBase = this.setTransformYBase(targetYCoord, sources.length);

		for (let source of sources) {
			let newY = newYBase + i*minNodeOffset;
			this.leftNodes[source.id]
				.classed("active", true)
				.classed("inactive", false)
				.transition()
				.duration(transitionDuration)
				.attr("transform", "translate(0, " + newY + ")");

			i++;

			d3.select(source.link)
				.transition()
				.duration(transitionDuration)
				.attr("d", (d) => { return this.setTransformPath(d, "left", newY)} );
		}
	}

	setTransformYBase(coord, listLen) {
		coord += 10;
		// transform would bring nodes out the bottom of the svg
		if (coord - (listLen * minNodeOffset)/2 < 0) {
			console.log("less!");
			return 0;
		} else if (coord + (listLen * minNodeOffset)/2 > this.h) {
			console.log("greater!");
			return this.h - (listLen * minNodeOffset);
		} else {
			return coord - (listLen * minNodeOffset)/2;
		}
	}

	mouseout() {
		this.links
			.transition()
			.duration(transitionDuration)
			.attr("d", (d) => { return this.setInitialPath(d); });

		let activeNodesLeft = $(".bipartite__node.active.left");

		for (let activeNode of activeNodesLeft) {
			let index = d3.select(activeNode).attr("index");
			d3.select(activeNode)
				.transition()
				.duration(transitionDuration)
				.attr("transform", "translate(-" + transitionOffset + ", " + (index*this.leftNodeOffset) + ")");
		}

		let activeNodesRight = $(".bipartite__node.active.right");

		for (let activeNode of activeNodesRight) {
			let index = d3.select(activeNode).attr("index");
			d3.select(activeNode)
				.transition()
				.duration(transitionDuration)
				.attr("transform", "translate(" + transitionOffset + ", " + (index*this.rightNodeOffset) + ")");
		}

		$(".bipartite__node.active").removeClass("active");
		$(".bipartite__node.inactive").removeClass("inactive");

		$(".bipartite__link.active").removeClass("active");
		$(".bipartite__link.inactive").removeClass("inactive");
	}

	resize() {
		this.setDimensions();

		this.links.attr("d", (d) => { return this.setInitialPath(d); });
	}
}