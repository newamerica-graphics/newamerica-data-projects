import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";

import {spring} from "react-motion";

const d3 = require("d3");

const getRange = (start, end) => { return Array(end - start + 1).fill().map((_, idx) => start + idx) }


class HistogramFixedIntervalLayout {
	constructor(data, width, layoutSettings, dotSettings, fullDataExtent) {
		this.width = width;
		this.data = data;
		this.dotSettings = dotSettings;
		this.xVariable = layoutSettings.xVar.variable;
		this.sortingVariable = layoutSettings.sortingVar.variable;

		let filledOutExtents = getRange(fullDataExtent[0], fullDataExtent[1])
		filledOutExtents = layoutSettings.isYearMonth ? filledOutExtents.filter(d => {
			return Number(d.toString().slice(-2)) <= 12 && Number(d.toString().slice(-2)) > 0
		}) : filledOutExtents


		this.paddingScale = d3.scaleLinear().domain([350, 1050]).range([.1, .45])
		this.xScale = d3.scaleBand().domain(filledOutExtents).paddingInner(this.paddingScale(width)).paddingOuter(1);
		this.yScale = d3.scaleLinear();

		this.setDataColumns();
	}

	setDataColumns() {
		this.xScale
			.range([0, this.width])

		this.dataNest = d3.nest()
			.key((d) => { return d[this.xVariable] })
			.sortKeys(d3.ascending)
			.sortValues((a, b) => {
				if (!a[this.sortingVariable]) return b;
				if (!b[this.sortingVariable]) return a;

				return new Date(a[this.sortingVariable]) - new Date(b[this.sortingVariable])
			})
			.entries(this.data)

		this.maxColCount = d3.max(this.dataNest, (d) => { return d.values.length});
		this.height = (this.maxColCount + 1)*(this.xScale.bandwidth()) + 27
	}

	resize(width) {
		this.width = width;

		this.xScale.paddingInner(this.paddingScale(width))

		this.setDataColumns();
	}

	renderDot(d, i) {
		let xPos = 0,
			yPos = 0;
		if (d[this.xVariable]) {
			yPos = this.getYPos(d[this.xVariable], d, i);
			xPos = this.xScale(d[this.xVariable]) + this.xScale.bandwidth()/2
		}
		return {x: spring(xPos), y: spring(yPos), r: this.xScale.bandwidth()/2 }
	}

	getYPos(whichBin, d, i) {
		let binValList;
		let retVal = 0;

		this.dataNest.forEach((bin) => {
			if (bin.key === whichBin) {
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

		return (this.maxColCount - retVal) * this.xScale.bandwidth();
	}
}

export default HistogramFixedIntervalLayout;