import $ from 'jquery';

let d3 = require("d3");

import { formatValue } from "../helper_functions/format_value.js";

export class Tooltip {
	constructor(id, titleVariable, tooltipVariables) {
		this.titleVar = titleVariable;
		this.tooltipVars = tooltipVariables;
		this.tooltip = d3.select(id)
			.append("div")
			.attr("class", "tooltip hidden");

		this.title = this.tooltip
			.append("h1")
			.classed("tooltip__title", true);

		this.valueFields = {};

		let categories = {};

		for (let variable of this.tooltipVars) {
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

			listElem.append("h3")
				.classed("tooltip__category__list-item__label", true)
				.text(variable.displayName + ":");

			this.valueFields[variable.variable] = listElem.append("h3")
				.classed("tooltip__category__list-item__value", true)
				
		}
	}

	show(d, mouse) {
		this.tooltip
			.classed('hidden', false)
            .attr('style', 'left:' + (mouse[0] + 20) + 'px; top:' + (mouse[1] - 30) + 'px');

		this.title.text(d[this.titleVar]);

		for (let variable of this.tooltipVars) {
			let varName = variable.variable;
			let varFormat = variable.format;
			this.valueFields[varName]
				.text(formatValue(d[varName], varFormat));
		} 
	}

	hide() {
		this.tooltip.classed('hidden', true);
	}

}