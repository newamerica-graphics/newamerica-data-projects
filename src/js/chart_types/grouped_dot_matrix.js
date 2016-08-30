import $ from 'jquery';

let d3 = require("d3");

import { Chart } from "../layouts/chart.js";
import { Legend } from "../components/legend.js";
import { DotMatrix } from "./dot_matrix.js";
import { Tooltip } from "../components/tooltip.js"; 


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

		this.tooltip = new Tooltip(id, "full_name", tooltipVars);
	}

	render(data) {
		this.data = data;

		this.getGroupings();
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

		for (let i = 0; i < this.numGroupings; i++) {

			this.dotMatrixContainers[i] = this.svg.append("g")
				.attr("class", "grouped-dot-matrix" + i);

			vizSettings.id = this.id + " .grouped-dot-matrix" + i;
			dotMatrices[i] = new DotMatrix(vizSettings);
			dotMatrices[i].render(this.groupings.values()[i])
			this.dotMatrixHeights[i] = dotMatrices[i].h;
		}

		this.setContainerTransforms();	
	}

	getGroupings() {
		this.groupings = d3.nest()
			.key((d) => { return d[this.currGroupingVar]; })
			.map(this.data);

		this.numGroupings = this.groupings.keys().length;
	}

	calcDistanceBetween() {
		return this.w/this.numGroupings;
	}

	setContainerTransforms() {
		this.maxHeight = Math.max(...this.dotMatrixHeights);

		this.svg.attr("height", (this.maxHeight + 15));

		for (let i = 0; i < this.numGroupings; i++) {
			this.dotMatrixContainers[i]
				.attr("transform", this.calcTransform(i));
		}
	}

	resize() {
		this.w = $(this.id).width();
		this.distanceBetween = this.calcDistanceBetween();

		for (let i = 0; i < this.numGroupings; i++) {
			this.dotMatrixContainers[i].attr("transform", this.calcTransform(i));
		}
	}

	calcTransform(i) {
		return "translate(" + i*this.distanceBetween + "," + (this.maxHeight - this.dotMatrixHeights[i]) + ")";
	}
}