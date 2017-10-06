import $ from 'jquery';

import * as global from "./../utilities.js";

import { formatValue } from "../helper_functions/format_value.js";

import { colors } from "../helper_functions/colors.js";

import { questionSVGPath } from "../utilities/icons.js";

let d3 = require("d3");

let continuousLegendHeight = 20,
	continuousLegendOffset = 40;

export class Legend {
	constructor(legendSettings) {
		Object.assign(this, legendSettings);
	}

	render(legendSettings) {
		let prevOrientation = this.orientation;
		Object.assign(this, legendSettings);

		this.orientation = prevOrientation ? prevOrientation : this.orientation;
		if (this.legend) {
			this.legend.remove();
		}

		this.legend = d3.select(this.id)
			.append("div")
			.attr("class", "legend " + this.orientation + " " + this.scaleType);

		this.colorLegend = this.legend.append("div")
			.attr("class", "legend__color-legend-container")

		if (this.showTitle) {
			let titleContainer = this.colorLegend.append("div")
				.attr("class", "legend__title-container");

			let title;
			if (this.customTitleExpression) {
				title = this.customTitleExpression.replace("<<>>",this.title);
			} else {
				title = this.title;
			}

			this.titleDiv = titleContainer.append("h3")
				.attr("class", "legend__title")
				.text(title);

			if (this.annotation) {
				titleContainer.append("span")
					.attr("class", "legend__annotation")
					.text(this.annotation);
			}
			
			if (this.varDescriptionData) {
				let varDescriptionText = this.getVarDescriptionText();
				console.log(varDescriptionText)
				if (varDescriptionText) {
					console.log("showing description!");
					this.appendVarDescription(varDescriptionText);
				}
			}

		}

		this.cellContainer = this.colorLegend.append("div")
			.attr("class", "legend__cell-container");

		if (this.scaleType == "linear" || this.scaleType == "logarithmic") {
			this.renderContinuous();
		} else {
			this.renderDiscrete();
		}

		if (this.radiusScale) {
			this.renderPropCircleLegend()
		}
	}

	renderContinuous() {
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

		this.addLabels();
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

	addLabels() {
		let legendXScale;
		//Set scale for x-axis
		if (this.scaleType == "logarithmic") {
			legendXScale = d3.scaleLog();
		} else {
			legendXScale = d3.scaleLinear();
		}
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

	renderDiscrete() {
		let {scaleType, format, colorScale, valChangedFunction, valCounts} = this;

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
				.classed("legend__cell", true)
				// .classed("indented", indentedIndices && indentedIndices.indexOf(i) > -1);

			if (this.disableValueToggling) {
				cell.style("cursor", "initial");
			} else {
				cell.on("click", () => { this.toggleValsShown(i); valChangedFunction(this.valsShown); });
			}
			this.appendCellMarker(cell, i);
			valCounts ? this.appendValCount(cell, i, valCounts) : null;
			this.appendCellText(cell, i);
			
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
			.text(this.valCountCustomFormattingFunc ? this.valCountCustomFormattingFunc(valCounts.get(valKey)) : valCounts.get(valKey));
	}

	appendCellText(cell, i) {
		let cellText = cell.append("h5")
			.classed("legend__cell__label", true);

		if (this.scaleType == "quantize") {
			if (this.openEnded && i == this.colorScale.range().length - 1) {
				cellText.text(formatValue(Math.ceil(this.calcBinVal(i, this.dataMin, this.binInterval)), this.format) + "+");
				return;
			}
			let start, end;
			if (this.format == "percent") {
				start = formatValue(Math.ceil(100*this.calcBinVal(i, this.dataMin, this.binInterval))/100, this.format);
				end = formatValue(Math.floor(100*this.calcBinVal(i+1, this.dataMin, this.binInterval))/100, this.format);
			} else {
				start = formatValue(Math.ceil(this.calcBinVal(i, this.dataMin, this.binInterval)), this.format);
				end = formatValue(Math.floor(this.calcBinVal(i+1, this.dataMin, this.binInterval)), this.format);
			}

			if (start === end) {
				cellText.text(start);
			} else {
				cellText.text(start + " to " + end);
			}
			
		} else if (this.scaleType == "categorical") {
			if (this.customLabels) {
				cellText.text(this.customLabels[i]);
			} else {
				cellText.text(this.colorScale.domain()[i] ? this.colorScale.domain()[i] : "null" );
			}
		}
	}

	renderPropCircleLegend() {
		this.propCircleContainer = this.legend.append("div")
			.attr("class", "legend__proportional-circle-legend-container");

        this.propCircleContainer.append("h5")
            .attr("class", "legend__title")
            .text(this.radiusVar.displayName);

        let width = this.radiusScale.range()[1] * 2 + 2,
            height = width + 15;
        
        let svg = this.propCircleContainer
            .append("div")
            .attr("class", "legend__proportional-circle__wrapper")
            .style("width", width + "px")
            .style("margin", "auto")
            .append("svg")
            .attr("height", height)
            .attr("width", width);

        svg.selectAll("circle")
            .data(this.radiusScale.range())
          .enter().append("circle")
            .attr("fill", "none")
            .attr("stroke", "#6b6d71")
            .attr("stroke-width", 1)
            .attr("cx", width/2)
            .attr("cy", height/2 - 5)
            .attr("r", (d) => { console.log(d); return d; });

        svg.selectAll("text")
            .data(this.radiusScale.range())
          .enter().append("text")
            .attr("x", width/2)
            .attr("y", (d) => { console.log(d); return height/2 + d + 7; })
            .style("font-size", "12px")
            .attr("fill", "#6b6d71")
            .style("text-anchor", "middle")
            .text((d, i) => { console.log(d); return formatValue(Math.ceil(this.radiusScale.domain()[i]), this.radiusVar.format); });
	}

	appendVarDescription(varDescriptionText) {
		this.titleDiv.append("div")
			.classed("legend__description-icon", true)
			.append("svg")
			.attr("viewBox", "0 0 16 16")
			.attr("width", "16px")
			.attr("height", "16px")
			.on("mouseover", () => { this.showVarDescription(d3.event); })
			.on("mouseout", () => { this.varDescriptionPopup.classed("hidden", true); })
			.append("g")
			.attr("fill", colors.grey.medium)
			.attr("transform", "translate(-48, -432)")
			.append("path")
			.attr("d", questionSVGPath);

		this.varDescriptionPopup = d3.select("body").append("div")
			.attr("class", "legend__description-popup")
			.classed("hidden", true)
			.text(varDescriptionText)
	}

	showVarDescription(eventObject) {
		this.varDescriptionPopup
			.classed("hidden", false)
			.attr('style', 'left:' + (eventObject.pageX - 70) + 'px; top:' + (eventObject.pageY + 10) + 'px');
	}

	getVarDescriptionText() {
		let retVal;

		this.varDescriptionData.forEach((d) => {
			if (d.variable === this.varDescriptionVariable) {
				retVal = d.description;
			}
		})

		return retVal;
	}

	toggleValsShown(valToggled) {
		// if all toggled, just show clicked value
		if (valToggled == "all") {
			this.legendCellDivs.map( function(item) { item.classed("disabled", false)});
			return;
		} else if (this.valsShown.length == this.numBins) {
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

	setOrientation(orientation, rerender) {
		this.orientation = orientation;
		rerender ? this.render() : null;
	}

	resize() {
		this.render();
	}

	removeComponent() {
		this.legend.remove();
	}

}