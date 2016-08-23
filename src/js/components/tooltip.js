import $ from 'jquery';

let d3 = require("d3");

import { formatValue } from "./format_value.js";

let tooltip, title, titleVar, tooltipVars, valueFields;

export class Tooltip {
	constructor(id, titleVariable, tooltipVariables) {
		titleVar = titleVariable;
		tooltipVars = tooltipVariables;
		tooltip = d3.select(id)
			.append("div")
			.attr("class", "tooltip hidden");

		title = tooltip
			.append("h1")
			.classed("tooltip__title", true);

		valueFields = {};

		let categories = {};

		for (let variable of tooltipVars) {
			let category = variable.category;

			if (!categories.hasOwnProperty(category)) {
				tooltip.append("h5")
					.classed("tooltip__category__name", true)
					.text(category);

				categories[category] = tooltip.append("ul")
					.classed("tooltip__category__list", true);
			}
			

			let listElem = categories[category].append("li")
				.classed("tooltip__category__list-item", true);

			listElem.append("h3")
				.classed("tooltip__category__list-item__label", true)
				.text(variable.displayName + ":");

			valueFields[variable.variable] = listElem.append("h3")
				.classed("tooltip__category__list-item__value", true)
				
		}
	}

	show(d, mouse) {
		tooltip
			.classed('hidden', false)
            .attr('style', 'left:' + (mouse[0] + 20) + 'px; top:' + (mouse[1] - 30) + 'px');

		title.text(d[titleVar]);

		for (let variable of tooltipVars) {
			let varName = variable.variable;
			let varFormat = variable.format;
			valueFields[varName]
				.text(formatValue(d[varName], varFormat));
		} 
	}

	hide() {
		tooltip.classed('hidden', true);
	}

}