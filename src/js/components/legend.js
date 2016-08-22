import $ from 'jquery';

import * as global from "./../utilities.js";

let d3 = require("d3");

let legend, title, cellContainer;

export class Legend {
	constructor(id) {
		legend = d3.select(id)
			.append("div")
			.attr("class", "legend");

		title = legend.append("h3")
			.attr("class", "legend__title");

		cellContainer = legend.append("svg")
			.attr("width", global.legendWidth + "px")
			.attr("class", "legend__cell-container");
	}

	setScale(currFilterVar, dataMin, dataMax, colorScale) {
		cellContainer.selectAll(".legend__cell").remove();

		let numBins = colorScale.range().length;
		cellContainer.attr("height", () => {
			return (numBins * 25) + "px";
		});

		let dataSpread = dataMax - dataMin;
		let binInterval = dataSpread/numBins;

		let calcBinVal = (i) => {
			let binVal = dataMin + (binInterval * i);
			return Math.round(binVal * 100)/100;
		}

		title.text(currFilterVar);

		for (let i = 0; i < numBins; i++) {
			let cell = cellContainer.append("g")
				.classed("legend__cell", true)
				.attr("transform", "translate(10," + (i*25 + 10) + ")");

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
				.text(calcBinVal(i) + " to " + calcBinVal(i+1));

		}
	}
}