import $ from 'jquery';

import * as global from "./../utilities.js";

import { formatValue } from "../helper_functions/format_value.js";

let d3 = require("d3");

let continuousLegendHeight = 20,
	continuousLegendOffset = 40;

export class Legend {
	constructor(legendSettings) {
		console.log(legendSettings);
		let {id, markerSettings, showTitle, orientation, customTitleExpression, disableValueToggling, openEnded, customLabels} = legendSettings;
		this.id = id;
		this.showTitle = showTitle;
		this.customTitleExpression = customTitleExpression;
		this.markerSettings = markerSettings;
		this.orientation = orientation;
		this.disableValueToggling = disableValueToggling;
		this.openEnded = openEnded;
		this.customLabels = customLabels;
	}

	render(legendSettings) {
		this.legendSettings = legendSettings;
		if (this.legend) {
			this.legend.remove();
		}
		this.legend = d3.select(this.id)
			.append("div")
			.attr("class", "legend " + this.orientation);

		if (this.showTitle) {
			let titleContainer = this.legend.append("div")
				.attr("class", "legend__title-container");

			this.titleDiv = titleContainer.append("h3")
				.attr("class", "legend__title");
		}

		this.cellContainer = this.legend.append("div")
			.attr("class", "legend__cell-container");

		this.colorScale = legendSettings.colorScale;

		if (this.showTitle) {
			let title;
			if (this.customTitleExpression) {
				title = this.customTitleExpression.replace("<<>>",legendSettings.title);
			} else {
				title = legendSettings.title;
			}
			this.titleDiv.text(title)
		}

		if (legendSettings.scaleType == "linear" || legendSettings.scaleType == "logarithmic") {
			this.renderContinuous(legendSettings);
		} else {
			this.renderDiscrete(legendSettings);
		}
	}

	renderContinuous(legendSettings) {
		this.legendWidth = $(this.id).width();
		if (this.legendWidth > 500) {
			this.legendWidth = 500;
		}
		this.legendSvg = this.cellContainer.append("svg")
			.attr("width", this.legendWidth)
			.attr("height", continuousLegendHeight*2);

		this.defineGradient();
		this.legendSvg.append("rect")
			.attr("width", this.legendWidth - 2*continuousLegendOffset)
			.attr("height", continuousLegendHeight)
			.attr("x", continuousLegendOffset)
			.attr("y", 0)
			.style("fill", "url(#linear-gradient)");

		this.addLabels(legendSettings.scaleType);
	}

	defineGradient() {
		//Append a defs (for definition) element to your SVG
		let defs = this.legendSvg.append("defs");

		//Append a linearGradient element to the defs and give it a unique id
		let linearGradient = defs.append("linearGradient")
		    .attr("id", "linear-gradient")
		    .attr("x1", "0%")
		    .attr("y1", "0%")
		    .attr("x2", "100%")
		    .attr("y2", "0%");

		linearGradient.append("stop") 
		    .attr("offset", "0%")   
		    .attr("stop-color", this.colorScale.range()[0]);

		//Set the color for the end (100%)
		linearGradient.append("stop") 
		    .attr("offset", "100%")   
		    .attr("stop-color", this.colorScale.range()[1]);
	}

	addLabels(scaleType) {
		let legendXScale;
		//Set scale for x-axis
		if (scaleType == "logarithmic") {
			legendXScale = d3.scaleLog();
		} else {
			legendXScale = d3.scaleLinear();
		}
		console.log(this.colorScale.domain());
		legendXScale
			.domain(this.colorScale.domain())
			.range([continuousLegendOffset, this.legendWidth - continuousLegendOffset]);

		//Define x-axis
		let legendXAxis = d3.axisBottom()
			  .tickValues([legendXScale.domain()[0], legendXScale.domain()[1]])
			  .tickFormat((d) => { return legendXScale.tickFormat(4,d3.format(",d"))(d) })
			  .scale(legendXScale);

		//Set up X axis
		this.legendSvg.append("g")
			.attr("class", "axis legend__axis")
			.attr("transform", "translate(0," + continuousLegendHeight + ")")
			.call(legendXAxis);
	}

	renderDiscrete(legendSettings) {
		let {scaleType, format, colorScale, valChangedFunction, valCounts} = legendSettings;

		this.cellList ? this.cellList.remove() : null;
		this.cellList = this.cellContainer.append("ul")
			.attr("class", "legend__cell-list");
		this.valsShown = [];

		this.numBins = this.colorScale.range().length;

		if (scaleType == "quantize") {
			[this.dataMin, this.dataMax] = this.colorScale.domain();
			let dataSpread = this.dataMax - this.dataMin;
			this.binInterval = dataSpread/this.numBins;
		}
		this.legendCellDivs = [];

		for (let i = 0; i < this.numBins; i++) {
			this.valsShown.push(i);
			let cell = this.cellList.append("li")
				.classed("legend__cell", true);

			if (this.disableValueToggling) {
				cell.style("cursor", "initial");
			} else {
				cell.on("click", () => { this.toggleValsShown(i); valChangedFunction(this.valsShown); });
			}
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

			console.log(this.colorScale.domain(), this.colorScale.range());
		if (scaleType == "quantize") {
			if (this.openEnded && i == this.colorScale.range().length - 1) {
				cellText.text(formatValue(Math.ceil(this.calcBinVal(i, this.dataMin, this.binInterval)), format) + "+");
				return;
			}
			if (format == "percent") {
				cellText.text(formatValue(Math.ceil(100*this.calcBinVal(i, this.dataMin, this.binInterval))/100, format) + " to " + formatValue(Math.floor(100*this.calcBinVal(i+1, this.dataMin, this.binInterval))/100, format));
			} else {
				cellText.text(formatValue(Math.ceil(this.calcBinVal(i, this.dataMin, this.binInterval)), format) + " to " + formatValue(Math.floor(this.calcBinVal(i+1, this.dataMin, this.binInterval)), format));
			}
		} else if (scaleType == "categorical") {
			if (this.customLabels) {
				cellText.text(this.customLabels[i]);
			} else {
				cellText.text(this.colorScale.domain()[i] ? this.colorScale.domain()[i] : "null" );
			}
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

	setOrientation(orientation) {
		this.legend.attr("class", "legend " + orientation);
	}

	resize() {
		this.render(this.legendSettings);
	}

}