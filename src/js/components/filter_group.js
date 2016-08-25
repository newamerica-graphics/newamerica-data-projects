import $ from 'jquery';

let d3 = require("d3");

export class FilterGroup {

	constructor(vizSettings) {
		let {id, filterVars} = vizSettings;

		this.id = id;
		this.filterVars = filterVars;
		let filterContainer = d3.select(id)
			.append("div")
			.attr("class", "filter-group");

		this.filterCategoryContainer = filterContainer.append("ul")
			.attr("class", "filter-group__category-container");

		this.filterVariableContainer = filterContainer.append("ul")
			.attr("class", "filter-group__variable-container");
		
	}

	render(listenerFunc) {

		this.categoryDivs = {};
		let i = 0;
		let self = this;
		for (let variable of this.filterVars) {
			let category = variable.category;
			i == 0 ? this.currCategory = category : null;

			if (!this.categoryDivs.hasOwnProperty(category)) {
				this.categoryDivs[category] = {};
				this.categoryDivs[category].label = this.filterCategoryContainer.append("p")
					.classed("filter-group__category", true)
					.classed("active", () => { return i == 0 ? true : false; })
					.attr("id", category)
					.text(category)
					.on("click", function() { 
						let firstVar = self.showList(category);
						listenerFunc(firstVar); 
					});

				this.categoryDivs[category].valueListDiv = this.filterVariableContainer.append("ul")
					.classed("filter-group__variable-list", true)
					.attr("id", category);

				this.categoryDivs[category].values = [];
				
			}
			let valListDiv = this.categoryDivs[category].valueListDiv;

			let value = valListDiv.append("li")
				.classed("filter-group__variable", true)
				.classed("active", () => { return i == 0 ? true : false; })
				.attr("value", i)
				.on("click", function() {
					let variable = self.toggleVariable($(this).val());
					listenerFunc(variable);
				})
				.text(variable.displayName);

			this.categoryDivs[category].values.push(value);
			i++;
		}
	}

	showList(newCategory) {
		// remove active class from currently category and clear its variables
		this.categoryDivs[this.currCategory].label.classed("active", false);
		this.categoryDivs[this.currCategory].valueListDiv.style("display", "none");


		this.categoryDivs[newCategory].label
			.classed("active", true);

		this.categoryDivs[newCategory].valueListDiv
			.style("display", "inline-block");

		this.currCategory = newCategory;

		let firstVar = this.toggleVariable(0);

		return firstVar;
	}

	toggleVariable(index) {
		// remove active class from currently active variable
		this.categoryDivs[this.currCategory].values.map(function(elem) {
			elem.classed("active", false);
		});

		let variable = this.categoryDivs[this.currCategory].values[index]
			.classed("active", true);

		return variable.attr("value");

	}


}