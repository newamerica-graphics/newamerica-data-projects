import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";

import { getColorScale } from "../helper_functions/get_color_scale.js";
import { formatValue } from "../helper_functions/format_value.js";

export class SummaryBox {
	constructor(vizSettings) {
		let {id, vizVars, titleVar, titleVarValue, columns, primaryDataSheet} = vizSettings;

		this.titleVar = titleVar;
		this.titleVarValue = titleVarValue;
		this.vizVars = vizVars;
		this.primaryDataSheet = primaryDataSheet;

		this.summaryBox = d3.select(id)
			.append("div")
			.attr("class", "summary-box");

		let titleContainer = this.summaryBox
			.append("div")
			.attr("class", "summary-box__title-container");

		this.title = titleContainer
			.append("h1")
			.text(titleVarValue)
			.classed("summary-box__title", true);

		this.valueFields = {};

		let categoryNest = d3.nest()
				.key((d) => { return d.category; })
				.entries(vizVars);
		let showCategories = categoryNest.length > 1;
		let whichContainer;

		for (let category of categoryNest) {
			whichContainer = this.summaryBox;
			if (category.key != "undefined" && showCategories) {
				this.summaryBox.append("h5")
					.classed("summary-box__category-name", true)
					.text(category.key);

				whichContainer = this.summaryBox.append("ul")
					.classed("summary-box__category-list", true);
			}

			for (let variable of category.values) {
				let listElem = whichContainer.append("li")
					.classed("summary-box__list-item", true);

				let valContainer = listElem.append("div")
					.classed("summary-box__list-item__val-container", true);

				let valueField = {};
				valueField.label = valContainer.append("h3")
					.classed("summary-box__list-item__label", true)
					.text(variable.displayName + ":");

				valueField.value = valContainer.append("h3")
					.classed("summary-box__list-item__value", true);

				valueField.colorScaleBox = listElem.append("div")
					.classed("summary-box__list-item__color-scale", true);
					
				this.valueFields[variable.variable] = valueField;
			}
		}
	}

	render(data) {
		this.data = data;
		console.log("rendering");
		let datapoint = data.filter( (d) => { return d[this.titleVar.variable] == this.titleVarValue })[0];
		console.log(datapoint);

		for (let variable of this.vizVars) {
			let varName = variable.variable;
			let varFormat = variable.format;
			console.log(datapoint[varName]);
			let value = datapoint[varName] ? datapoint[varName] : null;

			if (value) {
				this.appendValue(variable, value);
				this.appendColorScale(variable, value);
			} else  {
				this.valueFields[varName].label
					.style("display", "none");

				this.valueFields[varName].value
					.style("display", "none");

			}
		}
		
	}

	appendValue(variable, value) {
		this.valueFields[variable.variable].label
			.style("display", "inline-block");

		this.valueFields[variable.variable].value
			.style("display", "inline-block")
			.text(formatValue(value, variable.format));
	}

	appendColorScale(variable, value) {
		console.log(variable);
		let colorScaleContainer = this.valueFields[variable.variable].colorScaleBox;
		let colorScale = getColorScale(this.data, variable);
		let numBins = variable.numBins;
		console.log(colorScale.domain());
		for (let i = 0; i < numBins; i++) {
			colorScaleContainer.append("div")
				.attr("class", "summary-box__list-item__color-scale__bin")
				.style("width", 300/numBins + "px")
				.style("background-color", colorScale.range()[i]);
		}

		colorScaleContainer.append("svg")
			.attr("class", "summary-box__list-item__color-scale__marker-container")
			.style("left", this.calcMarkerPosition(colorScale, value))
		   .append("svg:circle")
			.attr("r", 7)
			.attr("cx", 10)
			.attr("cy", 10)
			.attr("class", "summary-box__list-item__color-scale__marker");
		
		console.log(colorScale);
	}

	calcMarkerPosition(colorScale, value) {
		let valueScale = d3.scaleLinear();
		valueScale.domain(colorScale.domain());
		valueScale.range([0, 100]);

		console.log(colorScale.domain());
		return valueScale(value) + "%";

	}

	resize() {

	}

}