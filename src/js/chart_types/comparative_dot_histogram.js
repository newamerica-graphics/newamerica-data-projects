import $ from 'jquery';
let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";
import { formatValue } from "../helper_functions/format_value.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";
import { Tooltip } from "../components/tooltip.js";

const numBins = 20,
	binList = Array.apply(null, {length: numBins}).map(Number.call, Number);

export class ComparativeDotHistogram {
	constructor(vizSettings, imageFolderId) {
		Object.assign(this, vizSettings);
	
		this.svg = d3.select(this.id)
			.append("svg");

		this.colorScales = [];

		this.xScale = d3.scaleBand()
			.domain(binList);

		this.yScale = d3.scaleLinear();

		// let tooltipSettings = { "id":id, "tooltipVars":tooltipVars, tooltipImageVar:"tooltipImageVar", "imageFolderId":imageFolderId, "tooltipScrollable":tooltipScrollable };
		// this.tooltip = new Tooltip(tooltipSettings);
	}

	render(data) {
		this.data = this.processData(data[this.primaryDataSheet]);
		this.setColorScales(data[this.primaryDataSheet]);

		this.binScale = d3.scaleQuantize();
		this.setBinScale();
		this.setDataNest();
		this.setDimensions();

		this.buildGraph();
	}

	processData(data) {
		const labelVarName = this.labelVar.variable;
		let retArray = [];
		this.groupingVars.forEach((groupingVar, i) => {
			const groupingVarName = groupingVar.variable;
			data.forEach((d) => {
				retArray.push({
					label: d[labelVarName],
					group: i,
					value: +d[groupingVarName]
				})
			})
		})

		console.log(retArray);

		return retArray;
	}

	setColorScales(data) {
		for (let groupingVar of this.groupingVars) {
			this.colorScales.push(getColorScale(data, groupingVar));
		}
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
			.sortValues(d3.ascending)
			.entries(this.data);

			console.log(this.dataNest);
	}

	setDimensions() {
		this.w = $(this.id).width();

		this.circleDiam = this.w/numBins;

		this.xScale.range([this.circleDiam/2, this.w + this.circleDiam/2]);

		this.maxColHeight = d3.max(this.dataNest, (d) => { return d.values.length; })

		this.h = this.maxColHeight * this.circleDiam;

		this.yScale.domain([0, this.maxColHeight])
			.range([this.h + this.circleDiam/2, this.circleDiam/2]);

		this.svg
			.attr("width", this.w)
			.attr("height", this.h);
	}

	buildGraph() {
		this.circleCols = this.svg.selectAll("g")
			.data(this.dataNest)
			.enter().append("g")
			.attr("transform", (d) => { console.log(d.key); return "translate(" + this.xScale(+d.key) + ")"; })

		this.circles = this.circleCols.selectAll("circle")
			.data((d) => { console.log(d); return d.values;})
			.enter().append("circle")
			.attr("transform", (d, i) => { return "translate(0, " + this.yScale(i) + ")"; })
			.attr("fill", (d) => { return this.colorScales[d.group](d.value); })
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", this.circleDiam/2)
	}
	

	resize() {
		this.setDimensions();

		this.circleCols
			.attr("transform", (d) => { console.log(d.key); return "translate(" + this.xScale(+d.key) + ")"; })

		this.circles
			.attr("transform", (d, i) => { return "translate(0, " + this.yScale(i) + ")"; })
			.attr("r", this.circleDiam/2);
	}

	mouseover(hovered) {
		this.dataCircles
			.attr("fill", (d) => {
				if (d.state_id == hovered.state_id) {
					return this.colorScale(d[this.currFilterVar]);
				} else {
					return "white";
				}
		    });

		this.dataCircleText
			.attr("fill", (d) => {
				if (d.state_id == hovered.state_id) {
					return "white";
				} else {
					return this.colorScale(d[this.currFilterVar]);
				}
		    });
	}

	mouseout() {
		this.dataCircles
			.attr("fill", "white");

		this.dataCircleText
			.attr("fill", (d) => { return this.colorScale(d[this.currFilterVar]); });
	}

}