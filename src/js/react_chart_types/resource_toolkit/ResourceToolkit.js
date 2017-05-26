import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";

import CategoryToggles from './CategoryToggles'

const d3 = require("d3");

class ResourceToolkit extends React.Component {
	constructor(props) {
		super(props);
		console.log(props);

		this.data = props.data[props.vizSettings.primaryDataSheet];

		this.state = {
			activeCategory: null;
		}

		this.getCategoryNest();
	}

	getCategoryNest() {
		console.log(this.data);

		this.resourcesByCategory = d3.nest()
			.key((d) => { console.log(d); return d.category; })
			.sortKeys(d3.ascending)
			.sortValues((a, b) => { return d3.ascending(a.title, b.title); })
			.entries(this.data);

		this.setState({
			activeCategory: this.resourcesByCategory
		})

		console.log(this.resourcesByCategory);
	}

	render() {
		const { vizSettings } = this.props;
		return (
			<div>
				<CategoryToggles resourcesByCategory={this.resourcesByCategory} changeCategoryFunc={ this.changeCategory.bind(this) }/>
			</div>
		)
	}

	changeCategory(newCategory) {
		console.log(newCategory);
	}
}

export default ResourceToolkit;
// 	constructor(vizSettings) {
// 		Object.assign(this, vizSettings);

// 		console.log("in resource toolkit");

// 		this.toolkitContainr = d3.select(this.id)
// 			.append("div")
// 			.attr("class", "resource-toolkit");
// 	}

// 	render(data) {
// 		this.data = data[this.primaryDataSheet];

// 		this.resourcesByCategory = d3.nest()
// 			.key((d) => { return d.category; })
// 			.sortKeys(d3.ascending)
// 			.sortValues((a, b) => { return d3.ascending(a.title, b.title); })
// 			.entries(this.data);

// 		console.log(this.resourcesByCategory)

// 		this.resourcesByCategory = d3.nest()
// 			.key((d) => { return d.category; })
// 			.map(this.data);

// 		console.log(this.resourcesByCategory)

// 		this.categoryToggles = this.toolkitContainer.append("div")
// 			.attr("class", "resource-toolkit__toggle-container")
// 			.selectAll("div.resource-toolkit__toggle")
			

		
		
// 	}

// 	setDimensions() {
// 		this.w = $(this.id).width() - this.margin.left - this.margin.right;
		
// 	}

// 	resize() {
// 		this.setDimensions();

// 	}

// 	mouseover(datum, eventObject) {
	
// 	}

// 	mouseout(path) {

// 	}
// }