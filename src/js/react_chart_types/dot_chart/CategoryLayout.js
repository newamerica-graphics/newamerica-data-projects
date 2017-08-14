import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";

import {spring} from "react-motion";

const d3 = require("d3");

const getRange = (start, end) => { return Array(end - start + 1).fill().map((_, idx) => start + idx) }

let dotWidth = 5;
let dotPadding = 1;

class CategoryLayout {
	constructor(data, width, height) {
		console.log(height, width)
		console.log("in constructor");

		this.width = width;
		this.data = data;

		let extents = d3.extent(this.data, (d) => {
			if (d.date) {
				return new Date(d.date);
			}
		})

		this.xScale = d3.scaleLinear();
		this.binScale = d3.scaleQuantize().domain(extents)
		this.yScale = d3.scaleLinear();
		this.axisScale = d3.scaleLinear();
		
		this.setDataColumns();

	}

	setDataColumns() {
		this.numColumns = Math.floor(this.width/((dotWidth + dotPadding)*2));

		console.log(this.numColumns)

		this.binScale
			.range(getRange(0, this.numColumns));

		// console.log(this.binScale.domain(), this.binScale.range())

		this.xScale
			.domain([0, this.numColumns])
			.range([dotWidth + dotPadding, this.width - dotWidth - dotPadding])

		this.axisScale 
			.domain(this.binScale.domain())
			.range(this.xScale.range())


		this.dataNest = d3.nest()
			.key((d) => { return d.date ? this.binScale(new Date(d.date)) : null })
			.sortKeys(d3.ascending)
			.sortValues((a, b) => { 
				if (!a.date) return b;
				if (!b.date) return a;

				return a.date > b.date
			})
			.entries(this.data)

		// console.log(this.dataNest)

		this.maxColCount = d3.max(this.dataNest, (d) => { return d.values.length});
		this.height = (this.maxColCount + 1)*((dotWidth + dotPadding)*2)

		// console.log(this.maxColCount);
	}


	resize(width) {
		this.width = width;

		this.setDataColumns();
	}

	renderDot(d, i) {
		// console.log(this.width, this.height)
		let xPos = 0,
			yPos = 0;
		if (d.date) {
			let bin = this.binScale(new Date(d.date));
			yPos = this.getYPos(bin, d, i);
			
			// console.log(yPos)
			xPos = this.xScale(bin)

		}
		return {x: spring(xPos), y: spring(yPos), r: 5 }
	}

	getYPos(whichBin, d, i) {
		let binValList;
		let retVal = 0;


		this.dataNest.forEach((bin) => {
			if (+bin.key === whichBin) {
				// console.log(bin)
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

		return dotWidth + ((this.maxColCount - retVal)*((dotWidth + dotPadding)*2));
	}
}

export default CategoryLayout;