import $ from 'jquery';

import * as global from "./../utilities.js";

import { formatValue } from "./format_value.js";

let d3 = require("d3");

let legend, title, cellContainer, cellDOMElements, colorScale, dataMin, dataMax, binInterval, valsShown, numBins;

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

		valsShown = [];
	}

	render(currFilterDisplayName, valueFormat, scale, listenerFunc) {
		colorScale = scale;

		cellContainer.selectAll(".legend__cell").remove();

		numBins = colorScale.range().length;
		cellContainer.attr("height", () => {
			return (numBins * 25) + "px";
		});

		[dataMin, dataMax] = colorScale.domain();
		let dataSpread = dataMax - dataMin;
		binInterval = dataSpread/numBins;

		title.text(currFilterDisplayName);

		cellDOMElements = [];
		for (let i = 0; i < numBins; i++) {
			valsShown.push(i);
			let cell = cellContainer.append("g")
				.classed("legend__cell active", true)
				.attr("transform", "translate(10," + (i*25 + 10) + ")")
				.attr("value", i)
				.on("click", this.toggleValsShown);

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
				.text(formatValue(Math.ceil(this.calcBinVal(i)), valueFormat) + " to " + formatValue(Math.floor(this.calcBinVal(i+1)), valueFormat));
			
			cellDOMElements.push(cell);
		}
	}

	calcBinVal(i) {
		let binVal = dataMin + (binInterval * i);
		return Math.round(binVal * 100)/100;
	}

	toggleValsShown() {
		console.log(cellDOMElements);
		let valToggled = Number($(this).attr("value"));
		let legendCells = $(".legend__cell");
		console.log(legendCells[0]);

		if (valsShown.length == numBins) {
			valsShown = [valToggled];
			legendCells.addClass("disabled");
			$(legendCells[valToggled]).removeClass("disabled");

		} else {
			let index = valsShown.indexOf(valToggled);
			// value is currently shown
			if (index > -1) {
				valsShown.splice(index, 1);
				$(legendCells[valToggled]).addClass("disabled");
			} else {
				valsShown.push(valToggled);
				$(legendCells[valToggled]).removeClass("disabled");
			}
		}

		console.log(valsShown);
	}

}