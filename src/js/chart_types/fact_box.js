import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";


export class FactBox {
	constructor(vizSettings) {
		let { id, factBoxType, factBoxVals, primaryDataSheet, alignment } = vizSettings;

		this.factBoxType = factBoxType;
		this.factBoxVals = factBoxVals;
		this.numBoxes = factBoxVals.length;
		this.primaryDataSheet = primaryDataSheet;

		this.chartContainer = d3.select(id)
			.append("div")
			.attr("class", "fact-box-container "+ factBoxType + " " + alignment);

	}

	render(data) {
		this.data = data;

		if (this.factBoxType == "simple") {
			this.renderSimple();
		} else {
			this.renderColored();
		}
		
		
	}

	renderSimple() {
		this.factBoxDivs = [];

		for (let factBoxVal of this.factBoxVals) {
			let value = this.getValue(factBoxVal);

			let factBoxDiv = this.chartContainer.append("div")
				.attr("class", "fact-box simple")
				// .style("width", 100/this.numBoxes + "%");

			factBoxDiv.append("div")
				.attr("class", "fact-box__label-container")	
			  .append("h5")
			   	.attr("class", "fact-box__label")
			   	.text(factBoxVal.text);

			factBoxDiv.append("div")
				.attr("class", "fact-box__value-container")
			  .append("h5")
			   	.attr("class", "fact-box__value")
			   	.text(value);

			this.factBoxDivs.push(factBoxDiv);
		}
	}

	renderColored() {
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
		} else if (factBoxVal.type == "average") {
			let mean = d3.mean(this.data, (d) => { return d[factBoxVal.variable.variable] ? d[factBoxVal.variable.variable] : null; });
			return Math.round(mean);
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