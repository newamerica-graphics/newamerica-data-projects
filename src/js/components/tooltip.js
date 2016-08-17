import $ from 'jquery';

let d3 = require("d3");

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

		for (let category of Object.keys(tooltipVars)) {
			tooltip.append("h5")
				.classed("tooltip__category__name", true)
				.text(category);

			let listForCategory = tooltip.append("ul")
				.classed("tooltip__category__list", true);

			for (let variable of tooltipVars[category]) {
				let listElem = listForCategory.append("li")
					.classed("tooltip__category__list__elem", true);

				listElem.append("h3")
					.classed("tooltip__category__list__elem__label", true)
					.text(variable);

				valueFields[variable] = listElem.append("h3")
					.classed("tooltip__category__list__elem__value", true)
					.text(variable);
			}
		}
	}

	show(d, mouse) {
		console.log(d);
		tooltip
			.classed('hidden', false)
            .attr('style', 'left:' + (mouse[0] + 20) + 'px; top:' + (mouse[1] - 30) + 'px');

		title.text(d[titleVar]);

		for (let field of Object.keys(valueFields)) {
			valueFields[field]
				.text(d[field]);
		} 
	}

	hide() {
		tooltip.classed('hidden', true);
	}

}