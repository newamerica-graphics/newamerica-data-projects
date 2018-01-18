import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";
import { Legend } from "../components/legend.js";

import { formatValue } from "../helper_functions/format_value.js";

const barLabelPadding = 10,
	mobileBreakpoint = 500;

export class PercentageStackedBar {
	constructor(vizSettings, imageFolderId) {
		Object.assign(this, vizSettings);		
		this.margin = {top: 0, right: 300, bottom: 0, left: 0};

		if (this.showLegend) {
			let legendSettings = {
				id : this.id,
				showTitle : false,
				markerSettings : { shape:"rect", size:10 },
				orientation : "horizontal-left",
				disableValueToggling : true
			};
			
			this.legend = new Legend(legendSettings);
		}

		this.svg = d3.select(this.id).append("svg").attr("class", "percentage-stacked-bar");

		this.renderingArea = this.svg.append("g");

		this.groupingScale = d3.scaleBand()
			.padding(.5);

		this.lengthScale = d3.scaleLinear();

		this.setDimensions();


	}

	setDimensions() {
		this.w = $(this.id).width() - this.margin.left - this.margin.right;

		// if (this.w < 300) {
			this.foldupMode = "mobile";
			this.w += this.margin.right;
		// } else {
		// 	this.foldupMode = "desktop";
		// }

		this.h = 2*this.w/3;
		this.h = this.h - this.margin.top - this.margin.bottom;
		this.h = this.h > 500 ? 500 : this.h;
		this.h = this.h < 300 ? 300 : this.h;

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
		this.groupingScale.rangeRound([0, this.h]);
		this.lengthScale.range([this.w, 0]);
	}

	render(data) {
		this.data = data[this.primaryDataSheet];
		if (this.filterInitialDataBy) {
            this.data = this.data.filter((d) => { return d[this.filterInitialDataBy.field] == this.filterInitialDataBy.value; })
        }
	    
	    if (this.aggregateData) {
			this.setScaleDomainsAggregate();
			this.colorScale = getColorScale(this.data, this.filterVars[0]);
		} else {
			this.setScaleDomainsSimpleVal();
			let colorDomain = [];
			let colorRange = [];
			for (let filterVar of this.filterVars) {
				colorDomain.push(filterVar.displayName);
				colorRange.push(filterVar.color);
			}
			this.colorScale = d3.scaleOrdinal().domain(colorDomain).range(colorRange);
		}

		this.renderBars();
		this.renderBarGroupLabels();
		this.renderBarLabels();

		if (this.showLegend) { this.setLegend(); }
	}

	setScaleDomainsAggregate() {
		let groupingVals = new Set();

		this.groupingSums = d3.nest()
			.key((d) => { 
				if (!d || d[this.groupingVar.variable] == null) {
					return;
				}
				groupingVals.add(d[this.groupingVar.variable]); 
				return d[this.groupingVar.variable]; 
			})
			.rollup((v) => {return v.length })
			.map(this.data);
		
		delete this.groupingSums["$undefined"];

		this.nestedVals = d3.nest()
			.key((d) => { return d[this.groupingVar.variable]; })
			.key((d) => { return d[this.filterVars[0].variable]; })
			.sortKeys((a, b) => { return this.colorScale.domain().indexOf(a) - this.colorScale.domain().indexOf(b); })
			.rollup((v) => { let currGroupingVal = v[0][this.groupingVar.variable]; return {"count":v.length, "percent": v.length/this.groupingSums.get(currGroupingVal)}; })
			.entries(this.data);

		this.lengthScale.domain([0, 1]);
		this.groupingScale.domain(Array.from(groupingVals));
	}

	setScaleDomainsSimpleVal() {
		let groupingVals = new Set();
		this.nestedVals = [];

		this.data.forEach((d) => {
			groupingVals.add(d[this.groupingVar.variable]);
			let dataVal = { key:d[this.groupingVar.variable], values:[] };
				
			for (let filterVar of this.filterVars) {
				dataVal.values.push({
					key: filterVar.displayName,
					value: { percent: d[filterVar.variable] }
				})
			}
			this.nestedVals.push(dataVal);
		})

		this.lengthScale.domain([0, 1]);
		this.groupingScale.domain(Array.from(groupingVals));
	}

	renderBars() {
		this.barGroups = this.renderingArea.selectAll("g")
			.data(this.nestedVals)
		  .enter().append("g");

		if (!this.aggregateData) {
			this.backgroundRects = this.barGroups.append("rect")
				.attr("x", 0)
				.attr("y", 0)
				.attr("fill", colors.grey.light)
				.attr("height", this.groupingScale.bandwidth())
		}

		this.bars = this.barGroups.selectAll("rect.data-rect")
			.data((d) => { return d.values; })
		  .enter().append("rect")
		  	.attr("y", 0)
		  	.attr("fill", (d) => { return this.colorScale(d.key); })
			.style("fill-opacity", .75)
			.attr("class", "data-rect")
			.on("mouseover", (d, index, paths) => {  return this.mouseover(d, paths[index], d3.event); })
		  	.on("mouseout", (d, index, paths) => {  return this.mouseout(paths[index]); });

		this.setBarLengths();
	}

	setBarLengths() {
		this.barGroups
			.attr("transform", (d) => { return "translate(0," + this.groupingScale(d.key) + ")"})
		
		if (this.backgroundRects) {
			this.backgroundRects
				.attr("width", this.w)
				.attr("height", this.groupingScale.bandwidth());
		}

		let currCumulativeLength = 0;
		this.bars
			.attr("x", (d, i) => {
				let barLength = this.w - this.lengthScale(d.value.percent);
				currCumulativeLength = i == 0 ? 0 : currCumulativeLength;
				let retVal = currCumulativeLength;
				currCumulativeLength += barLength;

				return retVal; 
			})
			.attr("width", (d) => { return this.w - this.lengthScale(d.value.percent); })
			.attr("height", this.groupingScale.bandwidth())
			.attr("stroke", "white");
	}

	renderBarGroupLabels() {
		this.barGroupLabels = this.barGroups
			.append("text")
			.style("font-weight", "bold")
			.text(((d) => { return d.key; }));
	}

	renderBarLabels() {
		this.barLabels = this.barGroups.selectAll("text.percentage-stacked-bar__bar-label")
			.data((d) => { return d.values; })
		  .enter().append("text")
		  	.attr("class", "percentage-stacked-bar__bar-label")
			.text((d) => { 
				return this.aggregateData ? d.key : formatValue(d.value.percent, "percent");
			});

		this.setBarLabelPositions();
	}

	setBarLabelPositions() {
		this.barGroupLabels
			.attr("transform", "translate(0,-" + this.groupingScale.bandwidth()/2 + ")");

		let currCumulativeLength = barLabelPadding;
		this.barLabels
			.classed("visible", (d, i, paths) => {
				let textLength = paths[i].getBBox().width + 2*barLabelPadding;
				let barLength = this.w - this.lengthScale(d.value.percent);

				return textLength < barLength;
			})
			.attr("y", this.groupingScale.bandwidth()/2)
			.attr("x", (d, i) => {
				let barLength = this.w - this.lengthScale(d.value.percent);
				currCumulativeLength = i == 0 ? barLabelPadding : currCumulativeLength;
				let retVal = currCumulativeLength;
				currCumulativeLength += barLength;

				return retVal; 
			});
			
	}

	setLegend() {
		let legendSettings = {};
		legendSettings.scaleType = "categorical";
		legendSettings.colorScale = this.colorScale;

		this.legend.render(legendSettings);
	}

	resize() {
		this.setDimensions();
		this.setBarLengths();
		this.setBarLabelPositions();
	}

	mouseover(datum, path, eventObject) {
		this.bars
			.style("fill-opacity", (d) => { return d.key == datum.key ? 1 : .2; });

		this.barGroupHoverLabels = this.barGroups
			.append("text")
			.attr("transform", () => {
				// if (this.foldupMode == "desktop") {
				// 	return "translate(" + (this.w + 25) + "," + this.groupingScale.bandwidth()/2 + ")";
				// } else {
					return "translate(" + this.w + ",-" + this.groupingScale.bandwidth()/2 + ")";
				// }
			})
			.style("text-anchor", this.foldupMode == "desktop" ? "start" : "end")
			.attr("class", "percentage-stacked-bar__bar-group-hover-label")
			.html((d) => { 
				let count, percent;
				d.values.map((entry) => {
					if (entry.key == datum.key) {
						count = entry.value.count;
						percent = formatValue(entry.value.percent, "percent");
					}
				})
			});
	}

	mouseout(path) {
		this.bars
			.style("fill-opacity", .75);

		this.barGroupHoverLabels.remove();
	}

	changeVariableValsShown(valsShown) {
		this.bars
			.style("fill", (d, i) => {
	   			if (valsShown.indexOf(i) > -1) {
	   				return this.filterVars[i].color;
	   			}
		   		return colors.grey.light;
		    });
	}
}