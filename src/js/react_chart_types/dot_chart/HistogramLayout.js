import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";

import {spring} from "react-motion";

const d3 = require("d3");

const getRange = (start, end) => { return Array(end - start + 1).fill().map((_, idx) => start + idx) }

let dotPadding = .5;

class HistogramLayout {
	constructor(data, width, layoutSettings) {
		this.width = width;
		this.data = data;
		this.dotSettings = dotSettings;
		this.dataVariable = layoutSettings.dateVar.variable;

		let extents = d3.extent(this.data, (d) => {
			if (d[this.dataVariable]) {
				return new Date(d[this.dataVariable]);
			}
		})

		let startRounded = d3.timeYear.floor(extents[0]),
			endRounded = d3.timeYear.ceil(extents[1]);

		this.xScale = d3.scaleLinear();
		this.binScale = d3.scaleQuantize().domain([startRounded, endRounded])
		this.yScale = d3.scaleLinear();

		let axisScaleDomain = d3.timeYear.range(startRounded, endRounded)

		this.axisScale = d3.scaleBand().domain(axisScaleDomain);

		this.dotWidth = width/dotSettings.scaleFactor;
		this.dotWidth = this.dotWidth > dotSettings.maxRadius ? dotSettings.maxRadius : this.dotWidth;
		
		this.setDataColumns();
	}

	setDataColumns() {
		this.numColumns = Math.floor(this.width/((this.dotWidth + dotPadding)*2));

		this.binScale
			.range(getRange(0, this.numColumns));

		this.xScale
			.domain([0, this.numColumns])
			.range([this.dotWidth + dotPadding, this.width - this.dotWidth - dotPadding])

		this.axisScale 
			.range([this.dotWidth + dotPadding, this.width - this.dotWidth - dotPadding])

		this.dataNest = d3.nest()
			.key((d) => { return d[this.dataVariable] ? this.binScale(new Date(d[this.dataVariable])) : null })
			.sortKeys(d3.ascending)
			.sortValues((a, b) => {
				if (!a[this.dataVariable]) return b;
				if (!b[this.dataVariable]) return a;

				return new Date(a[this.dataVariable]) - new Date(b[this.dataVariable])
			})
			.entries(this.data)

		this.maxColCount = d3.max(this.dataNest, (d) => { return d.values.length});
		this.height = (this.maxColCount + 1)*((this.dotWidth + dotPadding)*2) + 27
	}


	resize(width) {
		this.width = width;

		this.dotWidth = width/this.dotSettings.scaleFactor;
		this.dotWidth = this.dotWidth > this.dotSettings.maxRadius ? this.dotSettings.maxRadius : this.dotWidth;

		this.setDataColumns();
	}

	renderDot(d, i) {
		let xPos = 0,
			yPos = 0;
		if (d[this.dataVariable]) {
			let bin = this.binScale(new Date(d[this.dataVariable]));
			yPos = this.getYPos(bin, d, i);
			xPos = this.xScale(bin)
		}
		return {x: spring(xPos), y: spring(yPos), r: this.dotWidth }
	}

	getYPos(whichBin, d, i) {
		let binValList;
		let retVal = 0;

		this.dataNest.forEach((bin) => {
			if (+bin.key === whichBin) {
				binValList = bin.values;
				return;
			}
		})

		if (binValList) {
			binValList.forEach((val, index) => {
				if (val.id == d.id) {
					retVal = index;
					return;
				}
			})
		}

		return this.dotWidth + ((this.maxColCount - retVal)*((this.dotWidth + dotPadding)*2));
	}
}

export default HistogramLayout;