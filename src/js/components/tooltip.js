import $ from 'jquery';

let d3 = require("d3");

let tooltip, title, titleVar, dataVars, variableList, variableListElems;

export class Tooltip {
	constructor(id, titleVariable, dataVariables) {
		titleVar = titleVariable;
		dataVars = dataVariables;
		tooltip = d3.select(id)
			.append("div")
			.attr("class", "tooltip hidden");

		title = tooltip
			.append("h1")
			.classed("tooltip__title", true);

		variableList = tooltip
			.append("ul")
			.classed("tooltip__variable-list", true);

		variableListElems = {};

		for (let variable of dataVariables) {
			variableListElems[variable] = variableList.append("li")
				.classed("tooltip__variable-list__element", true);
		}
	}

	show(d, mouse) {
		tooltip.classed('hidden', false)
            .attr('style', 'left:' + (mouse[0] + 20) + 'px; top:' + (mouse[1] - 30) + 'px');

		title.text(d[titleVar]);

		for (let variable of dataVars) {
			variableListElems[variable]
				.text(d[variable]);
		} 
	}

	hide() {
		tooltip.classed('hidden', true);
	}

}