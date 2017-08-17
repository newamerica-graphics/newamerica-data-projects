import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";
import { Legend } from "../components/legend.js";
import { Tooltip } from "../components/tooltip.js";
import { Trendline } from "../components/trendline.js";

import { formatValue } from "../helper_functions/format_value.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";
import { infoSVGPath } from "../utilities/icons.js";

const range = (start, end) => [...Array(end - start + 1)].map((_, i) => start + i);

export class StackedBar {
	constructor(vizSettings, imageFolderId) {
		Object.assign(this, vizSettings);
		this.margin = {top: 20, right: 20};
		this.margin.left = this.showYAxis ? 70 : 20;
		this.margin.bottom = 30;

		if (this.infoText) {
			this.infoTextContainer = d3.select(this.id).append("div")
				.attr("class", "bar-chart__info-text")

			this.infoTextContainer.append("svg")
				.attr("class", "bar-chart__info-text__icon")
				.attr("viewBox", "0 0 25 25")
				.attr("width", "16px")
				.attr("height", "16px")
				.on("mouseover", () => { this.showVarDescription(d3.event); })
				.on("mouseout", () => { this.varDescriptionPopup.classed("hidden", true); })
				.append("g")
				.attr("fill", this.infoText.color)
				.append("path")
				.attr("d", infoSVGPath);

			this.infoTextContainer.append("h5")
				.attr("class", "bar-chart__info-text__text")
				.text(this.infoText.text)


		}

		this.svg = d3.select(this.id).append("svg").attr("class", "bar-chart");


		this.initializeAxes();
		this.renderingArea = this.svg.append("g");

		this.xScale = d3.scaleBand()
			.padding(0.2);

		this.yScale = d3.scaleLinear();

		this.setDimensions();

		this.legendSettings.id = this.id;
		this.legendSettings.markerSettings = { shape:"rect", size:10 };

		this.legend = new Legend(this.legendSettings);
	}

	setDimensions() {
		this.w = $(this.id).width() - this.margin.left - this.margin.right;
		this.h = 2*this.w/3;
		this.h = this.h - this.margin.top - this.margin.bottom;

		this.svg
			.attr("width", "100%")
		    .attr("height", this.h + this.margin.top + this.margin.bottom);

		this.renderingArea
		    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
		    .attr("width", this.w - this.margin.left - this.margin.right)
            .attr("height", this.h);

		this.setScaleRanges();

	}

	setScaleRanges() {
		this.xScale.rangeRound([0, this.w]);
		this.yScale.range([this.h, 0]);
	}

	render(data) {
		this.data = data[this.primaryDataSheet];
		if (this.filterInitialDataBy) {
            this.data = this.data.filter((d) => { return d[this.filterInitialDataBy.field] == this.filterInitialDataBy.value; })
        }
	    
		this.setScaleDomains();
		this.setColorScale();

		this.setAxes();
		this.renderBars();

		let tooltipSettings = { "id":this.id, "tooltipVars":this.setTooltipVars() };
		this.tooltip = new Tooltip(tooltipSettings);
		if (this.tooltipColorVals) {
			this.tooltip.setColorScale(this.colorScale);
		}

		this.legendSettings.scaleType = "categorical";
		this.legendSettings.colorScale = this.colorScale;
		this.legendSettings.valChangedFunction = this.changeVariableValsShown.bind(this);

		this.legend.render(this.legendSettings);
	}

	setTooltipVars() {
		let title = [{variable: "year", displayName:"Year", format:"year"}]
		let categoryList = this.colorScale.domain().map((d) => {
			return {variable: d, displayName: d, format: "number"};
		});

		return [...title, ...categoryList];
	}

	setScaleDomains() {
		let yearList = [];

		let maxTotalYearVal = 0;

		this.nestedVals = this.dataNestFunction(this.data, this.filterVar);

		this.nestedVals.forEach((yearObject) => {
			yearList.push(yearObject.key);
			let valArray = yearObject.values || yearObject.value;
			let localSum = d3.sum(valArray, (d) => { return d.value; })
			maxTotalYearVal = Math.max(maxTotalYearVal, localSum);

		})
		
		let yearExtents = d3.extent(yearList);
		
		this.yScale.domain([0, maxTotalYearVal]);
		this.xScale.domain(range(+yearExtents[0], +yearExtents[1]));

	}

	setColorScale() {
		if (this.customColorScale) {
			this.colorScale = d3.scaleOrdinal()
				.domain(this.customColorScale.domain)
				.range(this.customColorScale.range);
		} else {
			this.colorScale = getColorScale(this.data, this.filterVar);
		}
		
	}

	renderBars() {
		this.barGroups = this.renderingArea.selectAll("g")
			.data(this.nestedVals)
		  .enter().append("g")
		  	.on("mouseover", (d, index, paths) => {  return this.mouseover(d, paths[index], d3.event); })
		  	.on("mouseout", (d, index, paths) => {  return this.mouseout(paths[index]); });

		this.bars = this.barGroups.selectAll("rect")
			.data((d) => { return d.values || d.value; })
		  .enter().append("rect")
		  	.attr("x", 0)
		  	.attr("stroke", "white")
			.style("fill", (d) => { return this.colorScale(d.key); })
			.style("fill-opacity", 1);

		this.setBarHeights();
	}

	initializeAxes() {
		this.yAxis = this.svg.append("g")
            .attr("class", "axis axis--y");

        this.yAxisLabel = this.yAxis.append("text")
            .attr("class", "data-block__viz__y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", -45)
            .attr("fill", "#000")
            .style("text-anchor", "middle")
            .text(this.yAxisLabelText);

        this.xAxis = this.svg.append("g")
            .attr("class", "axis axis--x");

	}

	calculateTicks() {
		let currInterval;
		if (this.w < 575) {
			currInterval = this.xAxisLabelInterval.small;
		} else if (this.w > 1100) {
			currInterval = this.xAxisLabelInterval.large;
		} else {
			currInterval = this.xAxisLabelInterval.medium;
		}
		return this.xScale.domain().filter( (d, i) => { return !(i%currInterval);});
	}

	setBarHeights() {
		this.barGroups
			.attr("transform", (d) => { return "translate(" + this.xScale(d.key) + ")"})
		
		let currCumulativeY = 0;
		this.bars
			.attr("y", (d, i) => {
				let barHeight = this.h - this.yScale(d.value);
				currCumulativeY = i == 0 ? this.h - barHeight : currCumulativeY - barHeight;
				return currCumulativeY; 
			})
			.attr("height", (d) => { return this.h - this.yScale(d.value); })
			.attr("width", this.xScale.bandwidth());
	}

	setAxes() {
		this.yAxis
			.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
            .call(d3.axisLeft(this.yScale)
            	.ticks(5)
            	.tickSize(-this.w, 0, 0)
                .tickSizeOuter(0)
                .tickPadding(10));

        this.yAxisLabel
            .attr("x", -this.h/2)

        let ticks = this.calculateTicks();

        this.xAxis
            .attr("transform", "translate(" + this.margin.left + "," + (this.h + this.margin.top) + ")")
            .call(d3.axisBottom(this.xScale).tickValues(ticks));
	}

	resize() {
		this.setDimensions();
		this.setBarHeights();
		this.setAxes();

	 //    let ticks = this.calculateTicks();

		// this.groupingAxis
		// 	.attr("transform", "translate(0," + this.h + ")")
		// 	.call(d3.axisBottom(this.groupingScale).tickValues(ticks));

		// if (this.groupingAxisLabel) {
		// 	this.groupingAxisLabel.attr("x", this.w/2);
		// }

		// if (this.showYAxis) {
		// 	this.yAxis
		// 		.call(d3.axisLeft(this.yScales[this.filterVars[0].variable]));

		// 	this.yAxisLabel
		// 		.attr("x", -this.h/2);
		// }

		// if (this.trendline) {
		// 	this.trendline.resize(this.groupingScale, this.yScales[this.filterVars[0].variable]);
		// }
	}

	mouseover(datum, path, eventObject) {
		d3.select(path).selectAll("rect")
			.style("fill-opacity", .7);
		
		let mousePos = [];
		mousePos[0] = eventObject.pageX;
		mousePos[1] = eventObject.pageY;

		let tooltipData = {};
		tooltipData.year = datum.key;
		let valArray = datum.values || datum.value;

		valArray.forEach((d) => {
			tooltipData[d.key] = d.value;
		})
			
		this.tooltip.show(tooltipData, mousePos);
	}

	mouseout(path) {
		d3.select(path).selectAll("rect")
			.style("fill-opacity", 1);

	    this.tooltip.hide();
	}

	changeVariableValsShown(valsShown) {
		this.bars
			.style("fill", (d, i) => {
				let binIndex = this.colorScale.domain().indexOf(d.key);
	   			if (valsShown.indexOf(binIndex) > -1) {
	   				return this.colorScale(d.key);
	   			}
		   		return colors.grey.light;
		    });
	}

	removeChart() {
		this.svg.remove();
		this.legend.removeComponent();
		this.infoTextContainer ? this.infoTextContainer.remove() : null;
	}
}