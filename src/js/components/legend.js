import $ from 'jquery';

let d3 = require("d3");

import { legendColor } from 'd3-svg-legend';

let legend;

export class Legend {
	constructor(id) {
		legend = d3.select(id)
			.append("svg")
			.attr("class", "legend");
	}

	setScale(dataMin, dataMax, colorScale) {
		let numBins = colorScale.range().length
		let dataSpread = dataMax - dataMin;
		let binInterval = dataSpread/numBins;

		let calcBinVal = (i) => {
			return dataMin + (binInterval * i);
		}

		let cellContainer = legend.append("g")
			.attr("class", "legend__cell-container");

		for (let i = 0; i < numBins; i++) {
			let cell = cellContainer.append("g")
				.classed("legend__cell", true)
				.attr("transform", "translate(0," + i*15 + ")");

			cell.append("rect")
				.attr("height", 10)
				.attr("width", 10)
				.attr("x", 0)
				.attr("y", 0)
				.classed("legend__cell__color-swatch", true)
				.attr("fill", colorScale.range()[i]);

			cell.append("text")
				.attr("x", 20)
				.attr("y", 10)
				.classed("legend__cell__label", true)
				.text(calcBinVal(i) + " to " + calcBinVal(i+1));

		}

		
	}
}