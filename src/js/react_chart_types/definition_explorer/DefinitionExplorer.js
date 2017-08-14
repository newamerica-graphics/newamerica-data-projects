import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";

import CategoryBlock from './CategoryBlock.js';

const d3 = require("d3");

class DefinitionExplorer extends React.Component {
	constructor(props) {
		super(props);
		console.log(props);

		this.data = props.data[props.vizSettings.primaryDataSheet];
		this.getCategoryNest();
	}

	getCategoryNest() {
		const {titleVar, categoryVar} = this.props.vizSettings;

		this.categoryData = d3.nest()
			.key((d) => { return d[categoryVar.variable]})
			.map(this.data)

		console.log(this.categoryData)
		console.log(this.categoryData.get("null"))
		this.categoryTitles = this.categoryData.get("null").sort((a, b) => { return a[titleVar.variable] > b[titleVar.variable]; });
	}

	render() {
		const { titleVar, descriptionVar, chartTitle } = this.props.vizSettings;

		return (
			<div className="definition-explorer">
				<div className="definition-explorer__category-container">
					{this.categoryTitles.map((d) => {
						let title = d[titleVar.variable],
							description = d[descriptionVar.variable], 
							definitions = this.categoryData.get(title) ? this.categoryData.get(title).sort((a, b) => { return a[titleVar.variable] > b[titleVar.variable]; }) : null;

						return (
							<CategoryBlock key={title} title={title} description={description} categoryDefinitions={definitions} />
						)
					})}
				</div>
			</div>
		)
	}
}

export default DefinitionExplorer;