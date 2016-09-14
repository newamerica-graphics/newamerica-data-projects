import $ from 'jquery';

import * as global from "./../utilities.js";

import { formatValue } from "../helper_functions/format_value.js";

let d3 = require("d3");

export class Legend {
	constructor(legendSettings) {
		let {id, markerSettings, showTitle, orientation} = legendSettings;
		this.showTitle = showTitle;
		this.markerSettings = markerSettings;

		let legend = d3.select(id)
			.append("div")
			.attr("class", "legend " + orientation);

		if (showTitle) {
			let titleContainer = legend.append("div")
				.attr("class", "legend__title-container");

			this.titleDiv = titleContainer.append("h3")
				.attr("class", "legend__title");

			this.titleDescriptionDiv = titleContainer.append("p")
				.attr("class", "legend__title-description")
				.text("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et metus ut lorem viverra mattis. In hac habitasse platea dictumst.");
		}

		let cellContainer = legend.append("div")
			.attr("class", "legend__cell-container");

		this.cellList = cellContainer.append("ul")
			.attr("class", "legend__cell-list");
	}

	render(legendSettings) {
		let {scaleType, title, format, colorScale, valChangedFunction, valCounts} = legendSettings;

		this.colorScale = colorScale;

		this.showTitle ? this.titleDiv.text(title) : null;

		this.valsShown = [];

		this.cellList.selectAll(".legend__cell").remove();

		this.numBins = colorScale.range().length;

		console.log(this.numBins);

		// this.cellList.attr("height", () => {
		// 	return (this.numBins * 25) + "px";
		// });

		if (scaleType == "quantize") {
			[this.dataMin, this.dataMax] = colorScale.domain();
			let dataSpread = this.dataMax - this.dataMin;
			this.binInterval = dataSpread/this.numBins;
		}

		this.legendCellDivs = [];

		for (let i = 0; i < this.numBins; i++) {
			this.valsShown.push(i);
			let cell = this.cellList.append("li")
				.classed("legend__cell", true)
				.on("click", () => { this.toggleValsShown(i); valChangedFunction(this.valsShown); });

			this.appendCellMarker(cell, i);
			valCounts ? this.appendValCount(cell, i, valCounts) : null;
			this.appendCellText(cell, i, scaleType, format);

			
			this.legendCellDivs[i] = cell;
		}
	}

		

	calcBinVal(i, dataMin, binInterval) {
		let binVal = dataMin + (binInterval * i);
		return Math.round(binVal * 100)/100;
	}


	appendCellMarker(cell, i) {
		let size = this.markerSettings.size;
		let shape = this.markerSettings.shape;

		let svg = cell.append("svg")
			.attr("height", size)
			.attr("width", size)
			.style("margin-top", 14 - size)
			.attr("class", "legend__cell__color-swatch-container");

		let marker = svg.append(shape)
			.attr("class", "legend__cell__color-swatch")
			.attr("fill", this.colorScale.range()[i]);

		if (shape == "circle") {
			marker.attr("r", size/2)
				.attr("cx", size/2)
				.attr("cy", size/2);
		} else {
			marker.attr("width", size)
				.attr("height", size)
				.attr("x", 0)
				.attr("y", 0);
		}
	}

	appendValCount(cell, i, valCounts) {
		let valKey = this.colorScale.domain()[i];

		cell.append("h5")
			.attr("class", "legend__cell__val-count")
			.style("color", this.colorScale.range()[i])
			.text(valCounts.get(valKey));
	}

	appendCellText(cell, i, scaleType, format) {
		let cellText = cell.append("h5")
			.classed("legend__cell__label", true);

		if (scaleType == "quantize") {
			cellText.text(formatValue(Math.ceil(this.calcBinVal(i, this.dataMin, this.binInterval)), format) + " to " + formatValue(Math.floor(this.calcBinVal(i+1, this.dataMin, this.binInterval)), format));
		} else if (scaleType == "categorical") {
			cellText.text(this.colorScale.domain()[i] ? this.colorScale.domain()[i] : "null" );
		}
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