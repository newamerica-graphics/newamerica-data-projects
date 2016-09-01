import $ from 'jquery';

let d3 = require("d3");

import { formatValue } from "../helper_functions/format_value.js";

export class Tooltip {
	constructor(id, tooltipVariables) {
		//removes first variable to be used as title
		this.titleVar = tooltipVariables.shift().variable;
		this.tooltipVars = tooltipVariables;
		this.tooltip = d3.select("body")
			.append("div")
			.attr("class", "tooltip hidden");

		this.title = this.tooltip
			.append("h1")
			.classed("tooltip__title", true);

		this.valueFields = {};

		let categories = {};

		for (let variable of this.tooltipVars) {
			if (!variable) {
				console.log("this variable was not defined!");
			}
			let category = variable.category;

			if (!categories.hasOwnProperty(category)) {
				this.tooltip.append("h5")
					.classed("tooltip__category__name", true)
					.text(category);

				categories[category] = this.tooltip.append("ul")
					.classed("tooltip__category__list", true);
			}
			

			let listElem = categories[category].append("li")
				.classed("tooltip__category__list-item", true);

			let valueField = {};
			valueField.label = listElem.append("h3")
				.classed("tooltip__category__list-item__label", true)
				.text(variable.displayName + ":");

			valueField.value = listElem.append("h3")
				.classed("tooltip__category__list-item__value", true)
				
			this.valueFields[variable.variable] = valueField;
		}
	}

	show(d, mouse) {
		console.log(mouse);
		this.tooltip
			.classed('hidden', false)
            .attr('style', 'left:' + (mouse[0]) + 'px; top:' + (mouse[1]) + 'px');

		this.title.text(d[this.titleVar]);

		for (let variable of this.tooltipVars) {
			let varName = variable.variable;
			let varFormat = variable.format;
			let value = d[varName] ? formatValue(d[varName], varFormat) : null;

			console.log(value);

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

	hide() {
		this.tooltip.classed('hidden', true);
	}

}