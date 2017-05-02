import $ from 'jquery';
let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";
import { formatValue } from "../helper_functions/format_value.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";
import { Tooltip } from "../components/tooltip.js";

const numBins = 25,
	binList = Array.apply(null, {length: numBins}).map(Number.call, Number),
	margin = {bottom: 50};

export class ComparativeDotHistogram {
	constructor(vizSettings, imageFolderId) {
		Object.assign(this, vizSettings);
	
		this.svg = d3.select(this.id)
			.append("svg")
			.attr("class", "comparative-dot-histogram")

		this.xAxis = this.svg.append("g")
			.attr("class", "axis axis-x");

		this.binScale = d3.scaleQuantize();
		this.xAxisScale = d3.scaleLinear();

		this.xScale = d3.scaleBand()
			.domain(binList);

		this.yScale = d3.scaleLinear();

		let tooltipSettings = { "id":this.id, "tooltipVars":[this.titleVar, ...this.groupingVars] };
		this.tooltip = new Tooltip(tooltipSettings);
	}

	render(data) {
		this.rawData = data[this.primaryDataSheet]
		this.data = this.processData(this.rawData);

		this.setBinScale();
		this.setDataNest();
		this.setDimensions();

		this.buildGraph();
		this.setXAxis();
	}

	processData(data) {
		const labelVarName = this.labelVar.variable,
			titleVarName = this.titleVar.variable;
		let retArray = [];
		this.groupingVars.forEach((groupingVar, i) => {
			const groupingVarName = groupingVar.variable;
			data.forEach((d) => {
				retArray.push({
					label: d[labelVarName],
					title: d[titleVarName],
					group: i,
					value: +d[groupingVarName]
				})
			})
		})

		console.log(retArray);

		return retArray;
	}

	setBinScale() {
		let extents = d3.extent(this.data, (d) => { return d.value; });

		this.binScale.domain(extents)
			.range(binList);
	}

	setDataNest() {
		this.dataNest = d3.nest()
			.key((d) => { return this.binScale(d.value); })
			.sortKeys((a, b) => { return d3.ascending(+a, +b); })
			.sortValues((a, b) => { return d3.ascending(+a.value, +b.value);})
			.entries(this.data);

			console.log(this.dataNest);
	}

	setDimensions() {
		this.w = $(this.id).width();
		let widthBinRatio = this.w/numBins;
		this.circleOffset = widthBinRatio/10;
		this.circleDiam = widthBinRatio - 2*this.circleOffset;
		
		this.xScale.range([widthBinRatio/2, this.w - widthBinRatio/2]);

		this.maxColHeight = d3.max(this.dataNest, (d) => { return d.values.length; })

		this.h = this.maxColHeight * widthBinRatio;

		this.yScale.domain([0, this.maxColHeight])
			.range([this.h - widthBinRatio/2, widthBinRatio/2]);

		this.svg
			.attr("width", this.w)
			.attr("height", this.h + margin.bottom);
	}

	buildGraph() {
		this.circleCols = this.svg.selectAll("g.column")
			.data(this.dataNest)
			.enter().append("g")
			.attr("class", "column")
			.attr("transform", (d) => { console.log(d.key); return "translate(" + this.xScale(+d.key) + ")"; })

		this.circles = this.circleCols.selectAll("circle")
			.data((d) => { return d.values;})
			.enter().append("circle")
			.attr("transform", (d, i) => { return "translate(0, " + this.yScale(i) + ")"; })
			.attr("stroke", (d) => { return this.groupingVars[d.group].color; })
			.attr("fill", "white")
			.attr("stroke-width", 2)
			.attr("cx", this.circleDiam/2)
			.attr("cy", -this.circleDiam/2)
			.attr("r", this.circleDiam/2)
			.on("mouseover", (d) => { return this.mouseover(d, d3.event); })
			.on("mouseout", () => { return this.mouseout(); })

		this.circleText = this.circleCols.selectAll("text")
			.data((d) => { return d.values;})
			.enter().append("text")
			.attr("transform", (d, i) => { return "translate(0, " + this.yScale(i) + ")"; })
			.attr("fill", (d) => { return this.groupingVars[d.group].color; })
			.attr("x", this.circleDiam/2)
			.attr("y", -this.circleDiam/2)
			.style("text-anchor", "middle")
    		.style("alignment-baseline", "middle")
    		.style("font-size", this.circleDiam/2)
    		.style("font-weight", "bold")
    		.style("pointer-events", "none")
			.text((d) => { return d.label; });
	}

	setXAxis() {
		this.xAxisScale
			.domain(this.binScale.domain())
			.range(this.xScale.range());

		this.xAxis
			.attr("transform", "translate(-" + 0 + "," + (this.h - 10) + ")")
			.call(
				d3.axisBottom(this.xAxisScale)
					.tickPadding(10)
					.tickSizeOuter(0)
					.tickSizeInner(0)
					.tickFormat((d) => { return formatValue(d, "price"); })
			);
	}

	resize() {
		this.setDimensions();

		this.circleCols
			.attr("transform", (d) => { return "translate(" + this.xScale(+d.key) + ")"; })

		this.circles
			.attr("transform", (d, i) => { return "translate(0, " + this.yScale(i) + ")"; })
			.attr("r", this.circleDiam/2);

		this.circleText
			.attr("transform", (d, i) => { return "translate(0, " + this.yScale(i) + ")"; })
			.style("font-size", this.circleDiam/2)

		let sampleExtent = this.binScale.invertExtent(0);
		let binSpread = (sampleExtent[1] - sampleExtent[0])/2;

		this.setXAxis();
	}

	mouseover(hovered, eventObject) {
		let mousePos = [];
		mousePos[0] = eventObject.pageX;
		mousePos[1] = eventObject.pageY;

		let hoveredVals = {};
		this.circles
			.attr("fill", (d) => {
				if (d.label == hovered.label) {
					hoveredVals[d.group] = d;
					return this.groupingVars[d.group].color;
				} else {
					return "white";
				}
		    });

		this.circleText
			.attr("fill", (d) => {
				if (d.label == hovered.label) {
					return "white";
				} else {
					return this.groupingVars[d.group].color;
				}
		    });

		const labelVarName = this.labelVar.variable;
		this.rawData.forEach((d) => {
			if (d[labelVarName] == hovered.label) {
				this.tooltip.show(d, mousePos);
				return;
			}
		})
	}

	mouseout() {
		this.circles
			.attr("fill", "white");

		this.circleText
			.attr("fill", (d) => { return this.groupingVars[d.group].color; });

		this.tooltip.hide();
	}

}