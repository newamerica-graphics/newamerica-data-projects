import $ from 'jquery';

let d3 = require("d3");

let filterContainer, filterList, filterListElems, filterVars;

export class FilterGroup {

	constructor(id, filterVariables, listenerFunc) {
		filterVars = filterVariables;

		filterContainer = d3.select(id)
			.append("div")
			.attr("class", "filter-group");

		for (let category of Object.keys(filterVars)) {
			console.log(category);
			filterContainer.append("h5")
				.classed("filter-group__category__name", true)
				.text(category);

			let filterList = filterContainer.append("ul")
				.classed("filter-group__category__list", true);

			for (let variable of filterVars[category]) {
				filterList.append("li")
					.classed("filter-list__filter", true)
					.text(variable)
					.attr("value", variable)
					.on("click", listenerFunc);
			}
		}


		// filterList = d3.select(id)
		// 	.append("ul")
		// 	.attr("class", "filter-list");

		// filterListElems = {};

		// for (let variable of filterVars) {
		// 	filterListElems[variable] = filterList.append("li")
		// 		.classed("filter-list__filter", true)
		// 		.text(variable)
		// 		.attr("value", variable)
		// 		.on("click", listenerFunc);
		// }
	}


}