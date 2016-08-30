import $ from 'jquery';

let d3 = require("d3");

import { Chart } from "../layouts/chart.js";
import { Legend } from "../components/legend.js";
import { DotMatrix } from "./dot_matrix.js";
import { Tooltip } from "../components/tooltip.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";

let labelOffset = 20;
let labelTextSize = 10;
let dotW = 10;
let dotOffset = 3;

export class GroupedDotMatrix extends Chart {
	constructor(vizSettings) {
		let {id, groupingVars, tooltipVars, filterVars, dotsPerRow} = vizSettings;

		super(id, false);

		this.id = id;
		this.w = $(this.id).width();
		this.tooltipVars = vizSettings.tooltipVars;
		this.filterVars = vizSettings.filterVars;
		this.dotsPerRow = vizSettings.dotsPerRow;

		let chartContainer = d3.select(id)
			.append("div");

		this.svg = chartContainer
			.append("svg")
			.attr("width", "100%")
			.attr("class", "grouped-dot-matrix");

		this.currGrouping = groupingVars[0];
		this.currGroupingVar = groupingVars[0].variable;
		this.currFilter = filterVars[0];
		this.currFilterVar = filterVars[0].variable;

		this.tooltip = new Tooltip(id, "full_name", tooltipVars);
	}

	render(data) {
		this.data = data;

		this.getGroupings();
		this.setScale();
		this.distanceBetween = this.calcDistanceBetween();
		
		this.dotMatrixContainers = [];
		let dotMatrices = [];
		this.dotMatrixHeights = [];

		let vizSettings = {};
		
		vizSettings.orientation = "vertical";
		vizSettings.tooltipVars = this.tooltipVars;
		vizSettings.filterVars = this.filterVars;
		vizSettings.dotsPerRow = this.dotsPerRow;
		vizSettings.isSubComponent = true;
		vizSettings.tooltip = this.tooltip;
		vizSettings.colorScale = this.colorScale;

		for (let i = 0; i < this.numGroupings; i++) {

			this.dotMatrixContainers[i] = this.svg.append("g")
				.attr("class", "grouped-dot-matrix" + i);


			vizSettings.id = this.id + " .grouped-dot-matrix" + i;
			dotMatrices[i] = new DotMatrix(vizSettings);
			dotMatrices[i].render(this.groupings[i].values)
			this.dotMatrixHeights[i] = dotMatrices[i].h;
		}

		this.setContainerTransforms();
		this.appendLabels();
	}

	getGroupings() {
		this.groupings = d3.nest()
			.key((d) => { console.log(Number(d[this.currGroupingVar])); return Number(d[this.currGroupingVar]); })
			.sortKeys(d3.ascending)
			.entries(this.data);

		this.numGroupings = this.groupings.length;
	}

	setScale() {
		let colorScaleSettings = {};
		let uniqueVals = d3.nest()
			.key((d) => { return d[this.currFilterVar]; })
			.map(this.data);

		console.log(uniqueVals.keys());

		colorScaleSettings.scaleType = "categorical";
		colorScaleSettings.numBins = uniqueVals.keys().length;

		this.colorScale = getColorScale(colorScaleSettings);
	}

	appendLabels() {
		// let groupingWidth = this.dotsPerRow * (dotW + dotOffset);
		this.labelContainers = [];
		let labelWrapper = this.svg.append("g")
			.attr("class", "grouped-dot-matrix__label-container")
			.attr("transform",  "translate(0," + (this.maxHeight + labelOffset)+ ")");

		for (let i = 0; i < this.numGroupings; i++) {
			let elem = labelWrapper.append("g")
				.attr("transform", "translate(" + this.calcTransformX(i) + ")");

			elem.append("text")
				.text(this.groupings[i].key)
				.attr("text-anchor", "left")
				.attr("font-weight", "bold");

			elem.append("text")
				.text(this.groupings[i].values.length)
				.attr("y", labelTextSize + labelOffset)
				.attr("text-anchor", "left");

			this.labelContainers[i] = elem;
		}
	}

	calcDistanceBetween() {
		return this.w/this.numGroupings;
	}

	setContainerTransforms() {
		this.maxHeight = Math.max(...this.dotMatrixHeights);

		this.svg.attr("height", (this.maxHeight + 2*labelOffset + labelTextSize));

		for (let i = 0; i < this.numGroupings; i++) {
			this.dotMatrixContainers[i]
				.attr("transform", "translate(" + this.calcTransformX(i) + ", " + this.calcTransformY(i) + ")");
		}
	}

	resize() {
		this.w = $(this.id).width();
		this.distanceBetween = this.calcDistanceBetween();

		for (let i = 0; i < this.numGroupings; i++) {
			this.dotMatrixContainers[i].attr("transform", "translate(" + this.calcTransformX(i) + ", " + this.calcTransformY(i) + ")");
			this.labelContainers[i].attr("transform", "translate(" + this.calcTransformX(i) + ")");
		}
	}

	calcTransformX(i) {
		return i*this.distanceBetween;
	}

	calcTransformY(i) {
		return (this.maxHeight - this.dotMatrixHeights[i]);
	}
}