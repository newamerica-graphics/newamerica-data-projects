import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";

import { Chart } from "../layouts/chart.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";
import { formatValue } from "../helper_functions/format_value.js";

let colorScaleContainerWidth = 400;
let colorScaleWidth = 200;
let colorScaleMarkerSize = 8;

export class SummaryBox extends Chart {
	constructor(vizSettings) {
		let {id, vizVars, titleLabel, titleVar, titleVarValue, columns, primaryDataSheet} = vizSettings;

		super(id, false);
		this.id = id;
		this.titleVar = titleVar;
		this.titleVarValue = titleVarValue;
		this.vizVars = vizVars;
		this.primaryDataSheet = primaryDataSheet;

		let chartWrapper = d3.select(id)
			.append("div")
			.attr("class", "chart-wrapper");

		let summaryBoxOuterWrapper = chartWrapper
			.append("div")
			.attr("class", "summary-box");

		this.summaryBox = summaryBoxOuterWrapper
			.append("div")
			.attr("class", "summary-box__content-container");

		let titleContainer = this.summaryBox
			.append("div")
			.attr("class", "summary-box__title-container");

		titleContainer
			.append("h3")
			.text(titleLabel)
			.classed("summary-box__title-label", true);

		titleContainer
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
					.classed("summary-box__list-item__color-scale", true)
					.style("width", colorScaleContainerWidth + "px");

				valueField.rank = listElem.append("h3")
					.classed("summary-box__list-item__rank", true);
					
				this.valueFields[variable.variable] = valueField;
			}
		}

		let averageLegend = this.summaryBox.append("h3")
			.attr("class", "summary-box__average-line-label")
			.text(" = U.S. Average");
	}

	render(data) {
		this.data = data[this.primaryDataSheet];
		let datapoint = this.data.filter( (d) => { return d[this.titleVar.variable] == this.titleVarValue })[0];
		let natl_average = this.data.filter( (d) => { return d[this.titleVar.variable] == "United States" })[0];



		let i = 0;
		for (let variable of this.vizVars) {
			let varName = variable.variable;
			let varFormat = variable.format;
			let value = datapoint[varName] ? datapoint[varName] : null;
			let natl_average_value = natl_average[varName] ? natl_average[varName] : null;

			if (value) {
				this.appendValue(variable, value, natl_average_value, i);
				this.appendColorScale(variable, value, natl_average_value, i);
				// this.appendRank(variable, datapoint);
			} else  {
				this.valueFields[varName].label
					.style("display", "none");

				this.valueFields[varName].value
					.style("display", "none");

			}
			i++;
		}
		
	}

	appendValue(variable, value, natl_average_value, i) {
		
		let averageString = ""
		if (i >= 5) {
			value = Math.round(value);
			natl_average_value = Math.round(natl_average_value);
			if (Number(value) > Number(natl_average_value)) {
				averageString = " (Above Average)";
			} else if (Number(value) < Number(natl_average_value)) {
				averageString = " (Below Average)";
			} else {
				averageString = " (Average)";
			}
		}
		this.valueFields[variable.variable].label
			.style("display", "inline-block");

		this.valueFields[variable.variable].value
			.style("display", "inline-block")
			.text(formatValue(value, variable.format) + averageString);
	}

	appendColorScale(variable, value, natl_average_value, i) {	
		let colorScaleOuterWrapper = this.valueFields[variable.variable].colorScaleBox;
		let colorScale = getColorScale(this.data, variable);
		let numBins = variable.numBins;
		
		let minVal = colorScale.domain()[0];
		let maxVal = colorScale.domain()[1];

		if (variable.format == "price") {
			minVal = Math.floor(minVal/1000)*1000;
			maxVal = Math.ceil(maxVal/1000)*1000;

			colorScale.domain([minVal, maxVal]);
		}

		colorScaleOuterWrapper.append("h3")
			.attr("class", "summary-box__list-item__color-scale__label-left")
			.text(formatValue(minVal, variable.format));

		let colorScaleContainer = colorScaleOuterWrapper.append("div")
			.attr("class", "summary-box__list-item__color-scale__container")

		for (let i = 0; i < numBins; i++) {
			colorScaleContainer.append("div")
				.attr("class", "summary-box__list-item__color-scale__bin")
				.style("width", colorScaleWidth/numBins + "px")
				.style("background-color", colorScale.range()[i]);
		}

		colorScaleContainer.append("div")
			.style("left", this.calcMarkerPosition(colorScale, natl_average_value) + "px")
			.attr("class", "summary-box__list-item__color-scale__average-line");

		
		
		colorScaleContainer.append("svg")
			.attr("class", "summary-box__list-item__color-scale__marker-container")
			.style("left", (this.calcMarkerPosition(colorScale, value) - colorScaleMarkerSize) + "px")
		   .append("svg:circle")
			.attr("r", colorScaleMarkerSize)
			.attr("cx", 10)
			.attr("cy", 10)
			.style("stroke", colorScale(value))
			.attr("class", "summary-box__list-item__color-scale__marker");

		colorScaleOuterWrapper.append("h3")
			.attr("class", "summary-box__list-item__color-scale__label-right")
			.text(formatValue(maxVal, variable.format));
	}

	appendRank(variable, datapoint) {
		let sortedData = this.data.sort((a, b) => { return a[variable.variable] - b[variable.variable];})
		let rank = sortedData.indexOf(datapoint) + 1;

		this.valueFields[variable.variable].rank
			.text(formatValue(rank, "rank"));
	}

	calcMarkerPosition(colorScale, value) {
		let valueScale = d3.scaleLinear();
		valueScale.domain(colorScale.domain());
		valueScale.range([0, colorScaleWidth]);

		return valueScale(value);

	}

	resize() {

	}

}