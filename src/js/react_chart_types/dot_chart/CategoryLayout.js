import React from 'react';

import { colors } from "../../helper_functions/colors.js";
import { getColorScale } from "../../helper_functions/get_color_scale.js";

import { formatValue } from "../../helper_functions/format_value.js";

import {spring} from "react-motion";

const d3 = require("d3");

const topPadding = 5;
const getRange = (start, end) => { return Array(end - start + 1).fill().map((_, idx) => start + idx) }

class CategoryLayout {
	constructor(params) {
		Object.assign(this, params)
		this.categoryVariable = this.layoutSettings.categoryVar.variable;

		this.yScale = d3.scaleOrdinal();
		this.xScale = d3.scaleLinear();

		let categoryNest = d3.nest()
			.key((d) => { return d[this.categoryVariable]})
			.sortValues(this.layoutSettings.sortCategoryValsFunction)
			.entries(this.data)

		this.sortedCategoryVals = categoryNest.sort((a, b) => { return b.values.length - a.values.length})

		this.yScale.domain(this.sortedCategoryVals.map(d => d.key))
		this.resize(this.width, this.dotRadius)
	}

	resize(width, dotRadius) {
		this.dotRadius = dotRadius;
		this.horizontalPadding = Math.max(2, dotRadius/6);

		this.maxDotsPerRow = Math.floor((width - this.layoutSettings.leftMargin)/((this.dotRadius + this.horizontalPadding) * 2))
		this.maxDotsPerRow = this.maxDotsPerRow == 0 ? 1 : this.maxDotsPerRow

		this.setYScale();
	}

	setYScale() {
		let runningYTotal = this.dotRadius + this.horizontalPadding + topPadding;
		let currY = runningYTotal;

		this.yScale.range(this.sortedCategoryVals.map((d, i) => {
			currY = runningYTotal
			let numRows = Math.ceil(d.values.length/this.maxDotsPerRow)
			runningYTotal += numRows * ((this.dotRadius + this.horizontalPadding) * 2) + this.layoutSettings.verticalPadding

			return currY;
		}))

		this.height = currY
	}

	renderDot(d) {
		let xPos = 0,
			yPos = 0,
			index;

		if (d[this.categoryVariable]) {
			yPos = this.yScale(d[this.categoryVariable])
			index = this.yScale.domain().indexOf(d[this.categoryVariable])

			let categoryList = this.sortedCategoryVals[index].values

			let xIndex;
			categoryList.forEach((val, i) => {
				if (val.id == d.id) {
					xIndex = i
					return;
				}
			})

			if (xIndex >= (this.maxDotsPerRow - 1)) {
				let whichAdditionalRow = Math.floor(xIndex/this.maxDotsPerRow);

				yPos += whichAdditionalRow*((this.dotRadius + this.horizontalPadding) * 2)
				xIndex = xIndex % this.maxDotsPerRow
			}

			xPos = this.layoutSettings.leftMargin + xIndex * (this.dotRadius + this.horizontalPadding) * 2
		}
		return {x: spring(xPos), y: spring(yPos)}
	}
}

export default CategoryLayout;
