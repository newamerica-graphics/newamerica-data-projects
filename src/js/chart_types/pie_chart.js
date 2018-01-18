import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";
import { Legend } from "../components/legend.js";

import { formatValue } from "../helper_functions/format_value.js";

let legendWidth = 250;
let margin = {top: 0, right: legendWidth + 40, bottom: 0, left: 0};

export class PieChart {
	constructor(vizSettings, imageFolderId) {
		Object.assign(this, vizSettings);

		this.svg = d3.select(this.id).append("svg").attr("class", "pie-chart");
		this.renderingArea = this.svg.append("g");

		this.xScale = d3.scaleLinear()
		    .range([2 * Math.PI, 0]);

		this.yScale = d3.scaleSqrt();

		this.partition = d3.partition();

		this.arc = d3.arc();
		
		this.setDimensions();

		let legendSettings = {};
		legendSettings.id = this.id;
		legendSettings.showTitle = true;
		legendSettings.markerSettings = { shape:"circle", size:10 };
		legendSettings.orientation = "vertical-right-center";

		this.legend = new Legend(legendSettings);
		
	}

	render(data) {
		this.rawData = data[this.primaryDataSheet];

		let fakeRoot = {}

		if (!this.categoryVar) {
			fakeRoot[this.labelVar.variable] = "root";
			this.rawData.push(fakeRoot)
		}

		this.data = d3.stratify()
		    .id((d) => { return d[this.labelVar.variable]; })
		    .parentId((d) => {
		    	if (this.categoryVar) {
		    		return d[this.categoryVar.variable]
		    	} else {
		    		return d[this.labelVar.variable] === "root" ? null : "root";
		    	}
		    })
		    (this.rawData);

		this.data.sum((d) => { return d[this.dataVar.variable]});

		this.setColorScale();
		this.setLegend();

		this.paths = this.renderingArea.selectAll("path")
			.data(this.partition(this.data).descendants())
			.enter().append("path")
			.attr("d", this.arc)
			.attr("fill", (d) => { return d.parent ? this.colorScale(d.id) : "white"; })
			.attr("stroke", "white")
			.on("mouseover", (d) => { return this.mouseover(d); })
			.on("mouseout", () => { return this.mouseout(); })

	}

	setDimensions() {
		this.w = $(this.id).width() - margin.left - margin.right;
		this.h = this.w;
		let radius = this.w / 2;

		this.yScale.range([0, radius]);

		this.arc
			.startAngle((d) => { return Math.max(0, Math.min(2 * Math.PI, this.xScale(d.x0))); })
		    .endAngle((d) => { return Math.max(0, Math.min(2 * Math.PI, this.xScale(d.x1))); })
			.innerRadius((d) => { return Math.max(0, this.yScale(d.y0)); })
		    .outerRadius((d) => { return Math.max(0, this.yScale(d.y1)); });

		this.svg
			.attr("width", "100%")
		    .attr("height", this.h);

		this.renderingArea
		    .attr("transform", "translate(" + this.w / 2 + "," + this.h / 2 + ")");
	}

	setColorScale() {
		this.colorScale = getColorScale(this.rawData, this.labelVar);
	}

	setLegend() {
		let legendSettings = {};

		let indentedIndices = [];
		let valCounts = new Map();
		let i = 0;
		this.data.each((d) => {
			if (d.parent) {
				let value = formatValue(d.value, this.dataVar.format)
				valCounts.set(d.id, value);
				if (d.depth > 1) {
					indentedIndices.push(i);
				}
				i++;
			}
		})

		legendSettings.title = this.labelVar.displayName;
		legendSettings.format = this.labelVar.format;
		legendSettings.scaleType = this.labelVar.scaleType;
		legendSettings.colorScale = this.colorScale;
		legendSettings.valChangedFunction = this.changeVariableValsShown.bind(this);
		legendSettings.valCounts = valCounts;
		legendSettings.indentedIndices = indentedIndices;

		this.legend.render(legendSettings);
	}

	changeVariableValsShown(valsShown) {
		this.paths
			.attr("fill", (d) => {
				if (!d.parent) { return "white"; }
	   			let binIndex = this.colorScale.domain().indexOf(d.id);
	   			if (valsShown.indexOf(binIndex) > -1) {
	   				return this.colorScale(d.id);
	   			}
		   		return colors.grey.light;
		    });
	}

	resize() {
		this.setDimensions();

		this.paths.attr("d", this.arc);
	}

	mouseover(elem) {
		if (!elem.parent) { return; }
		this.hoverTextContainer = this.renderingArea.append("g")

		this.paths
			.attr("fill-opacity", (d) => { return d.id == elem.id ? .7 : 1; });

		this.hoverTextContainer.append("text")
			.attr("fill", this.colorScale(elem.id))
			.attr("x", 0)
			.attr("y", 0)
			.text(elem.id)
			.style("text-anchor", "middle")
			.style("font-weight", "bold")
			.style("font-size", "20px")
			.style("alignment-baseline", "middle");

		this.hoverTextContainer.append("text")
			.attr("fill", colors.grey.dark)
			.attr("x", 0)
			.attr("y", 25)
			.text(formatValue(elem.value, "percent"))
			.style("text-anchor", "middle")
			.style("alignment-baseline", "middle");
	}

	mouseout() {
		if (this.hoverTextContainer) { this.hoverTextContainer.remove(); }
		this.paths.attr("fill-opacity", 1);
	}

}