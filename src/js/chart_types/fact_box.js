import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";


export class FactBox {
	constructor(vizSettings) {
		let { id, factBoxVals, primaryDataSheet } = vizSettings;

		this.factBoxVals = factBoxVals;
		this.numBoxes = factBoxVals.length;

		this.chartContainer = d3.select(id)
			.append("div")
			.attr("class", "fact-box-container " + this.numBoxes + "-boxes");

	}

	render(data) {
		this.data = data;
		this.factBoxDivs = [];

		for (let factBoxVal of this.factBoxVals) {
			let value = this.getValue(factBoxVal);

			let factBoxDiv = this.chartContainer.append("div")
				.attr("class", "fact-box")
				// .style("width", 100/this.numBoxes + "%");

			let factBoxLeft = factBoxDiv.append("div")
				.attr("class", "fact-box__left");

			factBoxLeft.append("div")
				.attr("class", "fact-box__value-container")
				.style("background-color", () => { return factBoxVal.color ? factBoxVal.color : colors.turquoise.light; })
			  .append("h5")
			   	.attr("class", "fact-box__value")
			   	.text(value);
			   	

			let factBoxRight = factBoxDiv.append("div")
				.attr("class", "fact-box__right");

			factBoxRight.append("div")
				.attr("class", "fact-box__label-container")	
			  .append("h5")
			   	.attr("class", "fact-box__label")
			   	.text(factBoxVal.text);

			this.factBoxDivs.push(factBoxDiv);

		}
		
	}

	getValue(factBoxVal) {
		if (factBoxVal.type == "count") {
			return this.count(factBoxVal);
		} else if (factBoxVal.type == "percent") {
			let count = this.count(factBoxVal);
			let percent = Math.round((count/this.data.length) * 100);
			return percent + "%";

		}
	}

	count(factBoxVal) {
		let counts = d3.nest()
			.key((d) => { return d[factBoxVal.variable.variable]; })
			.rollup(function(v) { return v.length; })
			.map(this.data);

		return counts.get(factBoxVal.value);
	}

	resize() {
		// this.factBoxDivs.each(function() { this.style("width", "50%") });
	}
}