import $ from 'jquery';

let d3 = require("d3");

let id, filterContainer, filterList, filterListElems, filterVars;

export class FilterGroup {

	constructor(projectVars) {
		({id, filterVars} = projectVars);

		filterContainer = d3.select(id)
			.append("div")
			.attr("class", "filter-group");
		
	}

	render(listenerFunc) {
		let categoryList = {};

		for (let variable of Object.keys(filterVars)) {
			console.log(filterVars[variable]);
			let category = filterVars[variable].category;

			if (!categoryList.hasOwnProperty(category)) {
				filterContainer.append("h5")
					.classed("filter-group__category__name", true)
					.text(category);

				categoryList[category] = filterContainer.append("ul")
					.classed("filter-group__category__name", true);
				
			}

			categoryList[category].append("li")
				.classed("filter-list__filter", true)
				.text(variable)
				.attr("value", variable)
				.on("click", listenerFunc);
		}
	}


}