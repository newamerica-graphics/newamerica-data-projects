import $ from 'jquery';

import * as global from "./../utilities.js";

import { formatValue } from "../helper_functions/format_value.js";

let d3 = require("d3");

export class Legend {
	constructor(id) {
		let legend = d3.select(id)
			.append("div")
			.attr("class", "legend");

		this.titleDiv = legend.append("h3")
			.attr("class", "legend__title");

		this.cellContainer = legend.append("svg")
			.attr("width", global.legendWidth + "px")
			.attr("class", "legend__cell-container");
	}

	render(legendSettings) {
		let {scaleType, title, format, colorScale, valChangedFunction} = legendSettings;

		this.titleDiv.text(title);

		this.valsShown = [];

		this.cellContainer.selectAll(".legend__cell").remove();

		this.numBins = colorScale.range().length;

		this.cellContainer.attr("height", () => {
			return (this.numBins * 25) + "px";
		});

		if (scaleType == "quantize") {
			let [dataMin, dataMax] = colorScale.domain();
			let dataSpread = dataMax - dataMin;
			let binInterval = dataSpread/this.numBins;
		}

		console.log(scaleType);
		this.legendCellDivs = [];

		for (let i = 0; i < this.numBins; i++) {
			this.valsShown.push(i);
			let cell = this.cellContainer.append("g")
				.classed("legend__cell", true)
				.attr("transform", "translate(10," + (i*25 + 10) + ")")
				.on("click", () => { this.toggleValsShown(i); valChangedFunction(this.valsShown); });

			cell.append("circle")
				.attr("r", 5)
				.attr("cx", 0)
				.attr("cy", 0)
				.classed("legend__cell__color-swatch", true)
				.attr("fill", colorScale.range()[i]);

			let cellText = cell.append("text")
				.attr("x", 15)
				.attr("y", 5)
				.classed("legend__cell__label", true);

			if (scaleType == "quantize") {
				cellText.text(formatValue(Math.ceil(this.calcBinVal(i, dataMin, binInterval)), format) + " to " + formatValue(Math.floor(this.calcBinVal(i+1, dataMin, binInterval)), format));
			} else if (scaleType == "categorical") {
				cellText.text(colorScale.domain()[i]);
			}
			this.legendCellDivs[i] = cell;
		}
	}

		

	calcBinVal(i, dataMin, binInterval) {
		let binVal = dataMin + (binInterval * i);
		return Math.round(binVal * 100)/100;
	}

	toggleValsShown(valToggled) {

		// if all toggled, just show clicked value
		if (this.valsShown.length == this.numBins) {
			this.valsShown = [valToggled];
			this.legendCellDivs.map( function(item) { item.classed("disabled", true)});
			this.legendCellDivs[valToggled].classed("disabled", false);

		} else {
			let index = this.valsShown.indexOf(valToggled);
			// value is currently shown
			if (index > -1) {
				this.valsShown.splice(index, 1);
				this.legendCellDivs[valToggled].classed("disabled", true);
			} else {
				this.valsShown.push(valToggled);
				this.legendCellDivs[valToggled].classed("disabled", false);
			}
		}

		// if none toggled, show all values
		if (this.valsShown.length == 0) {
			for (let i = 0; i < this.numBins; i++) {
				this.valsShown.push(i);
			}
			this.legendCellDivs.map( function(item) { item.classed("disabled", false)});
		}
	}

}