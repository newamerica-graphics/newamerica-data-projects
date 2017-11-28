import React from 'react';

import { colors } from "../../helper_functions/colors.js";
import { getColorScale } from "../../helper_functions/get_color_scale.js";

import { formatValue } from "../../helper_functions/format_value.js";

import {spring} from "react-motion";

const d3 = require("d3");

const getRange = (start, end) => { return Array(end - start + 1).fill().map((_, idx) => start + idx) }

const dotPadding = 2;

class CategoryLayout {
	constructor(params) {
		Object.assign(this, params)
		this.categoryVariable = this.layoutSettings.categoryVar.variable;

		this.yScale = d3.scaleBand();
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

		this.maxDotsPerRow = Math.floor((width - this.layoutSettings.leftMargin)/((this.dotRadius + dotPadding) * 2))

		console.log(this.maxDotsPerRow)

		this.setYScale();
	}

	setYScale() {
		this.height = this.sortedCategoryVals.length * this.layoutSettings.catRowHeight

		console.log(this.height)

		this.yScale.range([10, this.height])
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

			if (xIndex > this.maxDotsPerRow) {
				let whichAdditionalRow = Math.floor(xIndex/this.maxDotsPerRow);

				console.log(whichAdditionalRow);
				yPos += whichAdditionalRow*((this.dotRadius + dotPadding) * 2)
				xIndex = (xIndex % this.maxDotsPerRow) - 1
				console.log(xIndex)
			} 
			
			xPos = this.layoutSettings.leftMargin + xIndex * (this.dotRadius + dotPadding) * 2
		}
		return {x: spring(xPos), y: spring(yPos)}
	}
}

export default CategoryLayout;