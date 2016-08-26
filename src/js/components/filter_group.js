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
		this.valDivs = [];
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
				
			}

			let valListDiv = this.categoryDivs[category].valueListDiv;

			this.valDivs[i] = valListDiv.append("li")
				.classed("filter-group__variable", true)
				.classed("active", () => { return i == 0 ? true : false; })
				.attr("value", i)
				.on("click", function() {
					self.toggleVariable($(this).val());
					listenerFunc($(this).val());
				})
				.text(variable.displayName);

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


		let firstVar = this.categoryDivs[newCategory].valueListDiv.select("li")._groups[0];
		let firstVarIndex = $(firstVar).val();

		this.toggleVariable(firstVarIndex);

		this.currCategory = newCategory;

		return firstVarIndex;
	}

	toggleVariable(index) {
		// remove active class from currently active variable
		this.valDivs.map(function(elem) {
			elem.classed("active", false);
		});

		this.valDivs[index]
			.classed("active", true);

	}


}