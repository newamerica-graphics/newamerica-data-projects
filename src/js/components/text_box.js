import $ from 'jquery';

let d3 = require("d3");

import { formatValue } from "../helper_functions/format_value.js";

export class TextBox {
	constructor(vizSettings) {
		let {id, textBoxVars, textBoxImageVar, imageFolderId, primaryDataSheet } = vizSettings;
		//removes first variable to be used as title
		this.titleVar = textBoxVars.shift().variable;
		this.textBoxVars = textBoxVars;
		this.textBoxImageVar = textBoxImageVar;
		this.imageFolderId = imageFolderId;
		this.primaryDataSheet = primaryDataSheet;

		this.textBox = d3.select(id)
			.append("div")
			.attr("class", "text-box");

		let contentContainer = this.textBox
			.append("div")
			.attr("class", "text-box__content-container");

		let titleContainer = contentContainer
			.append("div")
			.attr("class", "text-box__title-container");
			
		if (textBoxImageVar) {
			this.imageContainer = titleContainer
				.append("div")
				.attr("class", "person__icon");

			this.image = this.imageContainer
				.append("div")
				.attr("class", "person__icon__photo");
		}

		this.title = titleContainer
			.append("h1")
			.classed("text-box__title", true);

		this.valueFields = {};

		let categoryNest = d3.nest()
				.key((d) => { return d.category; })
				.entries(this.textBoxVars);
		let showCategories = categoryNest.length > 1;
		let whichContainer;

		for (let category of categoryNest) {
			whichContainer = contentContainer;
			if (category.key != "undefined" && showCategories) {
				contentContainer.append("h5")
					.classed("text-box__category__name", true)
					.text(category.key);

				whichContainer = contentContainer.append("ul")
					.classed("text-box__category__list", true);
			}

			for (let variable of category.values) {
				var listElem = whichContainer.append("li")
					.classed("text-box__category__list-item", true);

				let valueField = {};
				valueField.label = listElem.append("h3")
					.classed("text-box__category__list-item__label", true)
					.text(variable.displayName + ":");

				valueField.value = listElem.append("h3")
					.classed("text-box__category__list-item__value", true)
					
				this.valueFields[variable.variable] = valueField;
			}
		}
	}

	render(data) {
		this.data = data[this.primaryDataSheet];
		let defaultVal = 0;

		this.changeValue(defaultVal);
	}

	changeValue(value) {
		let currElement = this.data[value];

		this.title.text(currElement[this.titleVar]);

		for (let variable of this.textBoxVars) {
			let varName = variable.variable;
			let varFormat = variable.format;
			let value = currElement[varName] ? formatValue(currElement[varName], varFormat) : null;

			if (value) {
				this.valueFields[varName].label
					.style("display", "inline-block");

				this.valueFields[varName].value
					.style("display", "inline-block")
					.text(value);
			} else  {
				this.valueFields[varName].label
					.style("display", "none");

				this.valueFields[varName].value
					.style("display", "none");

			}
		}
	}

}