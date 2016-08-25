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

	render(currFilterDisplayName, valueFormat, scale, listenerFunc) {
		let colorScale = scale;
		this.valsShown = [];

		this.cellContainer.selectAll(".legend__cell").remove();

		this.numBins = colorScale.range().length;
		this.cellContainer.attr("height", () => {
			return (this.numBins * 25) + "px";
		});

		let [dataMin, dataMax] = colorScale.domain();
		let dataSpread = dataMax - dataMin;
		let binInterval = dataSpread/this.numBins;

		this.titleDiv.text(currFilterDisplayName);

		for (let i = 0; i < this.numBins; i++) {
			this.valsShown.push(i);
			let cell = this.cellContainer.append("g")
				.classed("legend__cell", true)
				.attr("transform", "translate(10," + (i*25 + 10) + ")")
				.on("click", () => { this.toggleValsShown(i); listenerFunc(this.valsShown); });

			cell.append("circle")
				.attr("r", 5)
				.attr("cx", 0)
				.attr("cy", 0)
				.classed("legend__cell__color-swatch", true)
				.attr("fill", colorScale.range()[i]);

			cell.append("text")
				.attr("x", 15)
				.attr("y", 5)
				.classed("legend__cell__label", true)
				.text(formatValue(Math.ceil(this.calcBinVal(i, dataMin, binInterval)), valueFormat) + " to " + formatValue(Math.floor(this.calcBinVal(i+1, dataMin, binInterval)), valueFormat));
		}
	}

	calcBinVal(i, dataMin, binInterval) {
		let binVal = dataMin + (binInterval * i);
		return Math.round(binVal * 100)/100;
	}

	toggleValsShown(valToggled) {
		let legendCells = $(".legend__cell");

		// if all toggled, just show clicked value
		if (this.valsShown.length == this.numBins) {
			this.valsShown = [valToggled];
			legendCells.addClass("disabled");
			$(legendCells[valToggled]).removeClass("disabled");

		} else {
			let index = this.valsShown.indexOf(valToggled);
			// value is currently shown
			if (index > -1) {
				this.valsShown.splice(index, 1);
				$(legendCells[valToggled]).addClass("disabled");
			} else {
				this.valsShown.push(valToggled);
				$(legendCells[valToggled]).removeClass("disabled");
			}
		}

		// if none toggled, show all values
		if (this.valsShown.length == 0) {
			for (let i = 0; i < legendCells.length; i++) {
				this.valsShown.push(i);
			}
			$(legendCells).removeClass("disabled");
		}
	}

}