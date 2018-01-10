import $ from 'jquery';

let d3 = require("d3");

export class FilterGroup {
	constructor(vizSettings) {
		Object.assign(this, vizSettings)

		this.activeCategoryIndex = 0;
		this.activeFilterIndex = 0;

		let parentContainer = d3.select(this.id)
			.append("div")
			.attr("class", "filter-group");

		if (this.hasCategories()) {
			this.categoryContainer = parentContainer.append("ul")
				.attr("class", "filter-group__category-container");

			this.categoryNest = d3.nest()
				.key(d => d.category)
				.entries(this.filterVars)

			console.log(this.categoryNest)
		}

		this.filterContainer = parentContainer.append("ul")
			.attr("class", "filter-group__variable-container");

		if (this.filterGroupSettings && this.filterGroupSettings.mobileSelectBox) {
			filterContainer.classed("has-mobile-select", true);
			this.mobileSelectBox = d3.select(this.id)
				.append("select")
				.attr("class", "select-box filter-group__mobile-select-box");
		}
	}

	render(listenerFunc) {
		this.listenerFunc = listenerFunc
		this.mobileSelectBox ? this.renderMobileSelectBox(listenerFunc) : null;

		this.categoryDivs = this.categoryContainer.selectAll("p")
			.data(this.categoryNest)
			.enter().append("p")
			.classed("filter-group__category", true)
			.classed("active", (d, i) => i === 0)
			.text(d => d.key)
			.on("click", (d, i) => this.changeCategory(d, i));

		this.filterLists = this.filterContainer.selectAll("ul")
			.data(this.categoryNest)
			.enter().append("ul")
			.classed("filter-group__variable-list", true)
			.classed("active", (d, i) => i === 0)
			.attr("id", d => d.key);

		this.filterDivs = this.filterLists.selectAll("li")
			.data(d.values.length > 1 ? d => d.values : [])
			.enter().append("li")
			.classed("filter-group__variable", true)
			.classed("active", (d, i) => i === 0)
			.text(d => d.displayName)
			.on("click", (d, i) => this.changeFilter(d, i))
	}

	changeCategory(newCategory, newCategoryIndex) {
		console.log("changing category to", newCategory, newCategoryIndex)
		this.activeCategoryIndex = newCategoryIndex;

		this.categoryDivs.classed("active", (d, i) => i === this.activeCategoryIndex)
		this.filterLists.classed("active", (d, i) => i === this.activeCategoryIndex)

		let newFilterIndex = this.sameFilterIndexWhenCategoryChanged ? this.activeFilterIndex : 0;

		let newFilter = this.categoryNest[newCategoryIndex].values[newFilterIndex] || this.categoryNest[newCategoryIndex].values[0]

		this.changeFilter(newFilter, newFilterIndex)
	}

	changeFilter(newFilter, newFilterIndex) {
		console.log("changing filter to", newFilter, newFilterIndex)
		this.activeFilterIndex = newFilterIndex;

		this.filterDivs ? this.filterDivs.classed("active", (d, i) => i === this.activeFilterIndex) : null

		this.listenerFunc(newFilter, newFilterIndex)
	}

	hasCategories() {
		for (let filterVar of this.filterVars) {
			if ('category' in filterVar) {
				return true;
			}
		}
		return false;
	}

	renderMobileSelectBox(listenerFunc) {
		this.mobileSelectBox.selectAll("option")
			.data(this.filterVars)
		  .enter().append("option")
		   	.text((d) => { return d.displayName; })
		   	.attr("value", (d, i) => { return i; });

		this.mobileSelectBox.on("change", (d) => {
			let index = this.mobileSelectBox.property('selectedIndex');
			listenerFunc(index);
		});
	}
}