import $ from 'jquery';

let d3 = require("d3");

import { formatValue } from "../helper_functions/format_value.js";
import { colors } from "../helper_functions/colors.js";


export class PopupDataBox {
	constructor(componentSettings) {
		Object.assign(this, componentSettings);

		this.dataBox = d3.select(this.id)
			.append("div")
			.attr("class", "data-box")
			.style("background-color", this.dataBoxBackgroundColor || "white")
			.style("border-color", this.dataBoxBackgroundColor ? "white" : colors.grey.light)
			.classed("hidden", true);

		this.title = this.dataBox.append("h3")
			.attr("class", "data-box__title")

		this.subtitle = this.dataBox.append("h5")
			.attr("class", "data-box__subtitle")

		this.valueFields = {};
		this.categoryLabels = {};

		for (let category of this.dataBoxVars.categories) {
			if (category.label) {
				this.categoryLabels[category.label] = this.dataBox.append("h5")
					.attr("class", "data-box__category-label")
					.text(category.label);
			}

			let categoryContainer = this.dataBox.append("div")
				.attr("class", "data-box__category-container");

			for (let field of category.fields) {
				let valContainer = categoryContainer.append("div")
					.attr("class", "data-box__value-container");

				valContainer.append("h5")
					.attr("class", "data-box__value-label")
					.text(field.displayName + ":");

				valContainer.append("h5")
					.attr("class", "data-box__value");

				this.valueFields[field.variable] = valContainer;
			}
		}
	}

	show(featureProps, maxHeight) {
		this.dataBox.classed("hidden", false)

		if (maxHeight) {
			this.dataBox.style("max-height", (maxHeight - 25) + "px")
		}

		this.title
			.text(formatValue(featureProps[this.dataBoxVars.title.variable], this.dataBoxVars.title.format));

		let subtitleText = "",
			i = 0;
		for (let subTitleVar of this.dataBoxVars.subtitle) {
			if (featureProps[subTitleVar.variable] && featureProps[subTitleVar.variable] != "null") {
				subtitleText += i != 0 ? ", " : "";
				subtitleText += formatValue(featureProps[subTitleVar.variable], subTitleVar.format);
				i++;
			}
		}

		this.subtitle
			.text(subtitleText);

		for (let category of this.dataBoxVars.categories) {
			let hasVals = false;
			for (let field of category.fields) {
				let val = featureProps[field.variable],
				format = field.format;
				if (val && val != "null") {
					hasVals = true;
					if (format != "link") {
						this.valueFields[field.variable]
							.classed("hidden", false)
						  .select(".data-box__value")
							.text(formatValue(featureProps[field.variable], format));
					} else {
						this.valueFields[field.variable]
							.classed("hidden", false)
						  .select(".data-box__value")
							.html(formatValue(featureProps[field.variable], format));
					}
				} else {
					this.valueFields[field.variable]
						.classed("hidden", true)
				}
				
			}

			if (category.label) {
				if (!hasVals) {
					this.categoryLabels[category.label]
						.style("display", "none");
				} else {
					this.categoryLabels[category.label]
						.style("display", "block");
				}
			}
		}
	}

	hide() {
		this.dataBox.classed("hidden", true);
	}
}