import $ from 'jquery';

let d3 = require("d3");

import { Chart } from "../layouts/chart.js";
import { Legend } from "../components/legend.js";
import { DotMatrix } from "./dot_matrix.js";
import { Tooltip } from "../components/tooltip.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";

let labelOffset = 20;
let labelTextSize = 10;
let dividingLineTextOffset = 20;
let margin = {
	left:20,
	right:20,
}

export class GroupedDotMatrix extends Chart {
	constructor(vizSettings, imageFolderId) {
		let {id, groupingVars, tooltipVars, tooltipImageVar, filterVars, dotsPerRow, distanceBetweenGroups, labelSettings, dividingLine, legendSettings, primaryDataSheet, eventSettings, filterChangeFunction, tooltipScrollable, dotSettings } = vizSettings;

		super(id, false);

		this.id = id;
		this.w = $(this.id).width();
		this.tooltipVars = tooltipVars;
		this.filterVars = filterVars;
		this.dotsPerRow = dotsPerRow;
		this.dividingLine = dividingLine;
		this.legendSettings = legendSettings;
		this.primaryDataSheet = primaryDataSheet;
		this.eventSettings = eventSettings;
		this.filterChangeFunction = filterChangeFunction;
		this.dotSettings = dotSettings;

		console.log(dotSettings);

		if (dividingLine) {
			this.dividingLineTextHeight = this.dividingLine.descriptionLines.length * dividingLineTextOffset + 30;
		}
		
		this.fullGroupingWidth = distanceBetweenGroups + dotsPerRow * (this.dotSettings.width + this.dotSettings.offset);
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

		if (this.eventSettings && this.eventSettings.mouseover.tooltip) {
			console.log("adding tooltip");
			let tooltipSettings = { "id":id, "tooltipVars":tooltipVars, tooltipImageVar:"tooltipImageVar", "imageFolderId":imageFolderId, "tooltipScrollable":tooltipScrollable }

			this.tooltip = new Tooltip(tooltipSettings);
		}

		this.legendSettings.id = id;
		this.legendSettings.markerSettings = { shape:"rect", size:this.dotSettings.width };
		this.legendSettings.orientation = "horizontal-center";
		console.log(this.legendSettings);
		this.legend = new Legend(this.legendSettings);
	}

	render(data) {
		this.data = data[this.primaryDataSheet];

		this.getGroupings();
		this.setScale();

		console.log(this.colorScale.domain());

		let w = this.fullGroupingWidth * this.numGroupings + margin.left + margin.right;

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
		vizSettings.primaryDataSheet = this.primaryDataSheet;
		vizSettings.eventSettings = this.eventSettings;
		vizSettings.dotSettings = this.dotSettings;
		if (this.eventSettings.click.handlerFuncType) {
			vizSettings.eventSettings.click.handlerFunc = this.changeValue.bind(this);
		}

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

		super.render();
	}

	getGroupings() {
		this.groupings = d3.nest()
			.key((d) => { return d[this.currGroupingVar] ? Number(d[this.currGroupingVar]) : -1; })
			.sortKeys(d3.ascending)
			.entries(this.data);

		console.log(this.groupings);

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
				.attr("transform", "translate(" + (this.calcTransformX(i) + this.dotSettings.width/2) + ")");

			elem.append("text")
				.text(this.groupings[i].key)
				.attr("class", "label__title")
				.attr("text-anchor", "middle");

			if (this.labelSettings.showNumVals) {
				elem.append("text")
					.text(this.groupings[i].values.length)
					.attr("y", labelTextSize + labelOffset)
					.attr("class", "label__value")
					.attr("text-anchor", "middle");
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
		
		if ( this.legendSettings.showVals ) {
			legendSettings.valCounts = d3.nest()
				.key((d) => { return d[this.currFilterVar]; })
				.rollup(function(v) { return v.length; })
				.map(this.data);
		}

		console.log(this.colorScale.domain());

		this.legendSettings.format = this.currFilter.format;
		this.legendSettings.scaleType = this.currFilter.scaleType;
		this.legendSettings.colorScale = this.colorScale;
		this.legendSettings.valChangedFunction = this.changeVariableValsShown.bind(this);

		this.legend.render(this.legendSettings);
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

	changeValue(value) {
		for (let dotMatrix of this.dotMatrices) {
			dotMatrix.changeValue(value);
		}

		this.filterChangeFunction ? this.filterChangeFunction(value, this) : null;
	}

	calcTransformX(i) {
		let transform = i*this.fullGroupingWidth;

		if (this.dividingLineIndex && i > this.dividingLineIndex) {
			transform = transform + this.distanceBetweenGroups;
		}

		return transform + margin.left;
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