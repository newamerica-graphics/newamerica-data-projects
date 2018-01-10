import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";

import {spring} from "react-motion";

const d3 = require("d3");

const getRange = (start, end) => { return Array(end - start + 1).fill().map((_, idx) => start + idx) }

const verticalPadding = 3;

class HistogramFixedIntervalLayout {
	constructor(params) {
		Object.assign(this, params)
		this.xScale = d3.scalePoint()
		this.setWidth(this.width)
		
		this.xVariable = this.layoutSettings.xVar.variable;
		this.sortingVariable = this.layoutSettings.sortingVar.variable;

		console.log(this.extents)

		let filledOutExtents = getRange(this.extents[0], this.extents[1])

		filledOutExtents = this.layoutSettings.isYearMonth ? filledOutExtents.filter(d => {
			return Number(d.toString().slice(-2)) <= 12 && Number(d.toString().slice(-2)) > 0
		}) : filledOutExtents

		console.log(filledOutExtents)

		this.xScale.domain(filledOutExtents);

		this.setDataColumns();
	}

	setDataColumns() {
		this.dataNest = d3.nest()
			.key((d) => { return d[this.xVariable] })
			.sortKeys(d3.ascending)
			.sortValues((a, b) => {
				if (!a[this.sortingVariable]) return b;
				if (!b[this.sortingVariable]) return a;

				return new Date(a[this.sortingVariable]) - new Date(b[this.sortingVariable])
			})
			.entries(this.data)

		console.log(this.dataNest)

		this.maxColCount = d3.max(this.dataNest, (d) => { return d.values.length});
		this.height = (this.maxColCount)*(this.dotRadius*2 + verticalPadding) + verticalPadding
	}

	resize(width, dotRadius) {
		this.setWidth(width);
		this.dotRadius = dotRadius;

		this.setDataColumns();
	}

	setWidth(width) {
		if (this.layoutSettings.maxWidth) {
			if (width > this.layoutSettings.maxWidth) {
				this.width = this.layoutSettings.maxWidth
				let offset = (width - this.layoutSettings.maxWidth)/2

				this.xScale.range([this.dotRadius*4 + offset, this.width - (this.dotRadius*4) + offset])
			} else {
				this.width = width
				this.xScale.range([this.dotRadius*4, this.width - (this.dotRadius*4)])
			}
		} else {
			this.width = width
			this.xScale.range([this.dotRadius*4, this.width - (this.dotRadius*4)])
		}
	}

	renderDot(d, i) {
		let xPos = 0,
			yPos = 0;
		if (d[this.xVariable]) {
			yPos = this.getYPos(d[this.xVariable], d, i);
			xPos = this.xScale(d[this.xVariable])
		}
		return {x: spring(xPos), y: spring(yPos)}
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

		return (this.maxColCount - retVal - 1) * (this.dotRadius*2 + verticalPadding) + this.dotRadius + verticalPadding;
	}
}

export default HistogramFixedIntervalLayout;