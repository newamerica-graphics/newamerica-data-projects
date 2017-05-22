import $ from 'jquery';
let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";
import { formatValue } from "../helper_functions/format_value.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";
import { Tooltip } from "../components/tooltip.js";
import { Legend } from "../components/legend.js";

const margin = {bottom: 20};

export class ComparativeDotHistogram {
	constructor(vizSettings, imageFolderId) {
		Object.assign(this, vizSettings);
	
		this.svg = d3.select(this.id)
			.append("svg")
			.attr("width", "100%")
			.attr("class", "comparative-dot-histogram")

		this.xAxis = this.svg.append("g")
			.attr("class", "axis axis-x");

		this.binScale = d3.scaleQuantize();
		this.xAxisScale = d3.scaleLinear();

		this.xScale = d3.scaleBand();

		this.yScale = d3.scaleLinear();

		let tooltipSettings = { "id":this.id, "tooltipVars":[this.titleVar, ...this.groupingVars], "highlightActive":false };
		this.tooltip = new Tooltip(tooltipSettings);

		if (this.groupingVars.length > 1) {
			this.legendSettings.id = this.id;
			this.legendSettings.markerSettings = { shape:"circle", size:10 };
			this.legendSettings.disableValueToggling = true;

			this.legend = new Legend(this.legendSettings);
		}
	}

	render(data) {
		this.rawData = data[this.primaryDataSheet]
		this.data = this.processData(this.rawData);

		this.setBinScale();
		this.setDataNest();
		this.setDimensions();

		this.buildGraph();
		this.annotationSplits ? this.buildAnnotationSplits() : null;
		this.setXAxis();

		this.legend ? this.setLegend() : null;
	}

	processData(data) {
		const labelVarName = this.labelVar ? this.labelVar.variable : null,
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

		return retArray;
	}

	setBinScale() {
		let extents = d3.extent(this.data, (d) => { return d.value; });

		this.numBins = this.customNumBins || extents[1] - extents[0] + 1;
		let binList = Array.apply(null, {length: this.numBins}).map(Number.call, Number);
		
		this.xScale.domain(binList);
		
		this.binScale.domain(extents)
			.range(binList);
	}

	setDataNest() {
		console.log(this.binScale.domain(), this.binScale.range());
		this.dataNest = d3.nest()
			.key((d) => { return this.binScale(d.value); })
			.sortKeys((a, b) => { return d3.ascending(+a, +b); })
			.sortValues((a, b) => { return d3.ascending(+a.value, +b.value);})
			.entries(this.data);

		console.log(this.dataNest);
	}

	setDimensions() {
		console.log("setting dimensions");
		this.w = $(this.id).width();
		console.log(this.w);
		let widthBinRatio = this.w/this.numBins;
		this.circleXOffset = widthBinRatio/8;
		this.circleYOffset = widthBinRatio/30;
		this.circleDiam = widthBinRatio - 2*this.circleXOffset;
		
		this.xScale.range([widthBinRatio/2, this.w - widthBinRatio/2]);

		this.maxColHeight = d3.max(this.dataNest, (d) => { return d.values.length; })

		this.h = this.maxColHeight * (widthBinRatio + this.circleYOffset);

		this.yScale.domain([0, this.maxColHeight])
			.range([this.h - widthBinRatio/2, widthBinRatio/2]);

		this.svg
			.attr("height", this.h + margin.bottom);
	}

	buildGraph() {
		this.circleCols = this.svg.selectAll("g.column")
			.data(this.dataNest)
			.enter().append("g")
			.attr("class", "column")
			.attr("transform", (d) => { return "translate(" + this.xScale(+d.key) + ")"; })

		this.circles = this.circleCols.selectAll("circle")
			.data((d) => { return d.values;})
			.enter().append("circle")
			.attr("transform", (d, i) => { return "translate(0, " + this.yScale(i) + ")"; })
			.attr("stroke", (d) => { return this.groupingVars[d.group].color; })
			.attr("fill", "white")
			.attr("stroke-width", 1)
			.attr("cx", this.circleDiam/2)
			.attr("cy", -this.circleDiam/2)
			.attr("r", this.circleDiam/2)
			.on("mouseover", (d) => { return this.mouseover(d, d3.event); })
			.on("mouseout", () => { return this.mouseout(); })
			.on("click", (d) => { 
				if (this.clickToProfile) {
		    		window.location.href = this.clickToProfile.url + d.title.replace(" ", "_");
		    	}
		    });

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
			.text((d) => { return d.label ? d.label : null; });
	}

	buildAnnotationSplits() {
		this.annotations = this.svg.selectAll("g.annotation")
			.data(this.annotationSplits)
			.enter().append("g")
			.attr("class", "annotation")
			.attr("transform", (d) => { return "translate(" + (this.xScale(this.binScale(+d.value)) - this.circleXOffset) + ")"; })

		this.annotations.append("line")
			.attr("x1", 0)
			.attr("y1", this.h - margin.bottom)
			.attr("x2", 0)
			.attr("y2", 0)
			.attr("stroke", colors.grey.medium);

		this.annotations.append("text")
			.attr("x", 0)
			.attr("y", 0)
			.text((d) => { return d.text; })
	}

	setXAxis() {
		this.xAxisScale
			.domain(this.binScale.domain())
			.range(this.xScale.range());

		this.xAxis
			.attr("transform", "translate(-" + 0 + "," + (this.h - 10) + ")")
			.call(
				d3.axisBottom(this.xAxisScale)
					.ticks(5)
					.tickPadding(10)
					.tickSizeOuter(0)
					.tickSizeInner(0)
					.tickFormat((d) => { return formatValue(d, this.groupingVars[0].format); })
			);
	}

	setLegend() {
		let colorScale = d3.scaleOrdinal()
			.domain(this.groupingVars.map((d) => {return d.displayName;}))
			.range(this.groupingVars.map((d) => {return d.color;}));

		this.legendSettings.format = this.groupingVars[0].format;
		this.legendSettings.scaleType = "categorical";
		this.legendSettings.colorScale = colorScale;

		this.legend.render(this.legendSettings);
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
				if (d.title == hovered.title) {
					hoveredVals[d.group] = d;
					return this.groupingVars[d.group].color;
				} else {
					return "white";
				}
		    });

		this.circleText
			.attr("fill", (d) => {
				if (d.title == hovered.title) {
					return "white";
				} else {
					return this.groupingVars[d.group].color;
				}
		    });

		this.rawData.forEach((d) => {
			if (d[this.titleVar.variable] == hovered.title) {
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