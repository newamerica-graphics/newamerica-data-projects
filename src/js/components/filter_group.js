import $ from 'jquery';

let d3 = require("d3");

let id, filterCategoryContainer, filterVariableContainer, filterList, filterListElems, filterVars;

export class FilterGroup {

	constructor(projectVars) {
		({id, filterVars} = projectVars);

		let filterContainer = d3.select(id)
			.append("div")
			.attr("class", "filter-group");

		filterCategoryContainer = filterContainer.append("ul")
			.attr("class", "filter-group__category-container");

		filterVariableContainer = filterContainer.append("ul")
			.attr("class", "filter-group__variable-container");
		
	}

	render(listenerFunc) {
		let categories = {};
		let i = 0;
		for (let variable of Object.keys(filterVars)) {
			console.log(filterVars[variable]);
			let category = filterVars[variable].category;

			if (!categories.hasOwnProperty(category)) {
				filterCategoryContainer.append("h5")
					.classed("filter-group__category", true)
					.classed("active", () => { return i == 0 ? true : false; })
					.attr("id", category)
					.text(category)
					.on("click", this.showList);

				categories[category] = filterVariableContainer.append("ul")
					.classed("filter-group__variable-list", true)
					.attr("id", category);
				
			}

			categories[category].append("li")
				.classed("filter-group__variable", true)
				.classed("active", () => { return i == 0 ? true : false; })
				.append("a")
				.text(variable)
				.attr("value", variable)
				.on("click", function() {
					$(".filter-group__variable.active").removeClass("active");
					$(this).parent().addClass("active");
					listenerFunc(this);
				});

			i++;
		}
	}

	showList() {
		let targetID = $(this).attr("id");
		$(".filter-group__category.active").removeClass("active");
		$(this).addClass("active");
		// hide any open variable list
		$(".filter-group__variable-list").hide();
		$("#" + targetID + ".filter-group__variable-list").show();
	}


}