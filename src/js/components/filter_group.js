import $ from 'jquery';

let d3 = require("d3");

let filterList, filterListElems, filterVars;

export class FilterGroup {
	constructor(id, filterVariables, listenerFunc) {
		filterVars = filterVariables;
		filterList = d3.select(id)
			.append("ul")
			.attr("class", "filter-list");

		filterListElems = {};

		for (let variable of filterVars) {
			filterListElems[variable] = filterList.append("li")
				.classed("filter-list__filter", true)
				.text(variable)
				.attr("value", variable)
				.on("click", listenerFunc);
		}
	}


}