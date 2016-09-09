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
let dividingLineTextOffset = 20;

export class GroupedDotMatrix extends Chart {
	constructor(vizSettings, imageFolderId) {
		let {id, groupingVars, tooltipVars, tooltipImageVar, filterVars, dotsPerRow, distanceBetweenGroups, labelSettings, dividingLine, legendShowVals} = vizSettings;

		super(id, false);

		this.id = id;
		this.w = $(this.id).width();
		this.tooltipVars = tooltipVars;
		this.filterVars = filterVars;
		this.dotsPerRow = dotsPerRow;
		this.dividingLine = dividingLine;
		this.legendShowVals = legendShowVals;

		if (dividingLine) {
			this.dividingLineTextHeight = this.dividingLine.descriptionLines.length * dividingLineTextOffset + 30;
		}
		
		this.fullGroupingWidth = distanceBetweenGroups + dotsPerRow * (dotW + dotOffset);
		this.labelSettings = labelSettings;
		this.distanceBetweenGroups = distanceBetweenGroups;

		let chartContainer = d3.select(id)
			.append("div")
			.attr("class", "chart-wrapper");

		this.svg = chartContainer
			.append("svg")
			.attr("class", "grouped-dot-matrix");

		this.currGrouping = groupingVars[0];
		this.currGroupingVar = groupingVars[0].variable;
		this.currFilter = filterVars[0];
		this.currFilterVar = filterVars[0].variable;

		this.tooltip = new Tooltip(id, tooltipVars, tooltipImageVar, imageFolderId);

		let legendSettings = {};
		legendSettings.id = id;
		legendSettings.showTitle = false;
		legendSettings.markerSettings = { shape:"rect", size:dotW };
		legendSettings.orientation = "horizontal-center";
		this.legend = new Legend(legendSettings);
	}

	render(data) {
		this.data = data;

		this.getGroupings();
		this.setScale();

		let w = this.fullGroupingWidth * this.numGroupings;

		w += this.dividingLine ? this.distanceBetweenGroups : 0;
		this.svg.attr("width", w);
		
		this.dotMatrixContainers = [];
		this.dotMatrices = [];
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
			this.dotMatrices[i] = new DotMatrix(vizSettings);
			this.dotMatrices[i].render(this.groupings[i].values)
			this.dotMatrixHeights[i] = this.dotMatrices[i].h;
		}

		this.setContainerTransforms();
		this.appendLabels();
		this.setLegend();
		if (this.dividingLine) {
			this.addDividingLine();
		}
	}

	getGroupings() {
		this.groupings = d3.nest()
			.key((d) => { return d[this.currGroupingVar] ? Number(d[this.currGroupingVar]) : -1; })
			.sortKeys(d3.ascending)
			.entries(this.data);

		// removes values associated with -1 key (null values)
		this.groupings[0].key == "-1" ? this.groupings.shift() : null;

		if (this.dividingLine) {
			let i = 0;
			for (let grouping of this.groupings) {
				if (grouping.key == this.dividingLine.value) {
					this.dividingLineIndex = i;
					break;
				}
				i++;
			}
		}

		this.numGroupings = this.groupings.length;
	}

	setScale() {
		this.colorScale = getColorScale(this.data, this.currFilter);
	}

	appendLabels() {
		let transformY = this.maxHeight + labelOffset;

		if (this.dividingLine) {
			transformY += this.dividingLineTextHeight;
		}
		this.labelContainers = [];
		let labelWrapper = this.svg.append("g")
			.attr("class", "grouped-dot-matrix__label-container")
			.attr("transform",  "translate(0," + transformY + ")");

		for (let i = 0; i < this.numGroupings; i = i + this.labelSettings.interval) {
			let elem = labelWrapper.append("g")
				.attr("transform", "translate(" + this.calcTransformX(i) + ")");

			elem.append("text")
				.text(this.groupings[i].key)
				.attr("class", "label__title")
				.attr("text-anchor", "left");

			if (this.labelSettings.showNumVals) {
				elem.append("text")
					.text(this.groupings[i].values.length)
					.attr("y", labelTextSize + labelOffset)
					.attr("class", "label__value")
					.attr("text-anchor", "left");
			}

			this.labelContainers[i] = elem;
		}
	}

	setContainerTransforms() {
		this.maxHeight = Math.max(...this.dotMatrixHeights);

		this.h = (this.maxHeight + 2*labelOffset + labelTextSize);
		if (this.dividingLine) {
			this.h += this.dividingLineTextHeight;
		}

		this.svg.attr("height", this.h);

		for (let i = 0; i < this.numGroupings; i++) {
			this.dotMatrixContainers[i]
				.attr("transform", "translate(" + this.calcTransformX(i) + ", " + this.calcTransformY(i) + ")");
		}
	}

	setLegend() {
		let legendSettings = {};
		
		if ( this.legendShowVals ) {
			legendSettings.valCounts = d3.nest()
				.key((d) => { return d[this.currFilterVar]; })
				.rollup(function(v) { return v.length; })
				.map(this.data);
		}

		legendSettings.format = this.currFilter.format;
		legendSettings.scaleType = this.currFilter.scaleType;
		legendSettings.colorScale = this.colorScale;
		legendSettings.valChangedFunction = this.changeVariableValsShown.bind(this);

		this.legend.render(legendSettings);
	}

	addDividingLine() {
		let transformX = this.calcTransformX(this.dividingLineIndex) + this.fullGroupingWidth;

		this.svg.append("line")
			.attr("transform", "translate(" + transformX + ")")
			.attr("class", "dividing-line")
			.attr("x1", 0)
			.attr("x2", 0)
			.attr("y1", 0)
			.attr("y2", this.h);

		let textContainer = this.svg.append("g")
			.attr("transform", "translate(" + (transformX + this.distanceBetweenGroups) + ")");

		textContainer.append("text")
			.attr("transform", "translate(0," + dividingLineTextOffset + ")")
			.attr("class", "dividing-line__title")
			.text(this.dividingLine.title);

		let descriptionContainer = textContainer.append("text")
			.attr("transform", "translate(0," + 2*dividingLineTextOffset + ")");

		let i = 0;
		for (let descriptionLine of this.dividingLine.descriptionLines)	{
			descriptionContainer.append("tspan")
				.attr("x", 0)
				.attr("y", i * dividingLineTextOffset)
				.attr("class", "dividing-line__description")
				.text(descriptionLine);
			i++;
		}
	}

	resize() {
		// this.w = $(this.id).width();

		// for (let i = 0; i < this.numGroupings; i++) {
			// this.dotMatrixContainers[i].attr("transform", "translate(" + this.calcTransformX(i) + ", " + this.calcTransformY(i) + ")");
			// this.labelContainers[i].attr("transform", "translate(" + this.calcTransformX(i) + ")");
		// }
	}

	calcTransformX(i) {
		let transform = i*this.fullGroupingWidth;

		if (this.dividingLineIndex && i > this.dividingLineIndex) {
			transform = transform + this.distanceBetweenGroups;
		}

		return transform;
	}

	calcTransformY(i) {
		let transform = this.maxHeight - this.dotMatrixHeights[i];

		if (this.dividingLine) {
			transform += this.dividingLineTextHeight;
		}

		return transform;
	}

	changeVariableValsShown(valsShown) {
		for (let i = 0; i < this.numGroupings; i++) {
			this.dotMatrices[i].changeVariableValsShown(valsShown);
		}
		
	}
}