import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";

import {spring} from "react-motion";

const d3 = require("d3");

const getRange = (start, end) => { return Array(end - start + 1).fill().map((_, idx) => start + idx) }

let dotWidth = 5;
let dotPadding = 1;
let leftMargin = 120;

class CategoryLayout {
	constructor(data, width, height, categoryVar) {
		console.log(height, width)
		console.log("in constructor");

		this.categoryVar = categoryVar;
		this.width = width;
		this.data = data;

		this.yScale = d3.scaleBand();
		this.xScale = d3.scaleLinear();

		let categoryNest = d3.nest()
			.key((d) => { return d[categoryVar.variable]})
			.sortValues((a, b) => { return new Date(a.date) - new Date(b.date)})
			.entries(data)

		console.log(categoryNest)

		this.sortedCategoryVals = categoryNest.sort((a, b) => { return b.values.length - a.values.length})

		console.log(this.sortedCategoryVals)

		this.height = this.sortedCategoryVals.length * (dotWidth + dotPadding + 2) * 2

		this.yScale.domain(this.sortedCategoryVals.map(d => d.key))
			.range([0, this.height])

	}


	resize(width) {
		this.width = width;

	}

	renderDot(d) {
		let xPos = 0,
			yPos = 0,
			index;

		if (d[this.categoryVar.variable]) {
			yPos = this.yScale(d[this.categoryVar.variable])
			index = this.yScale.domain().indexOf(d[this.categoryVar.variable])

			let categoryList = this.sortedCategoryVals[index].values

			let xIndex;
			categoryList.forEach((val, i) => {
				if (val.id == d.id) {
					xIndex = i
					return;
				}
			})
			xPos = xIndex * (dotWidth + dotPadding) * 2 + leftMargin
		}
		return {x: spring(xPos), y: spring(yPos), r: 5 }
	}
}

export default CategoryLayout;