import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";

import DefinitionEntry from './DefinitionEntry.js';

const d3 = require("d3");

class DefinitionExplorer extends React.Component {
	constructor(props) {
		super(props);

		this.data = props.data[props.vizSettings.primaryDataSheet];
		this.getCategoryNest();
	}

	getCategoryNest() {
		const {titleVar, categoryVar} = this.props.vizSettings;

		this.categoryData = d3.nest()
			.key((d) => { return d[categoryVar.variable]})
			.map(this.data)

		this.categoryTitles = this.categoryData.get("null")
			.sort((a, b) => { 
				if (this.props.vizSettings.sorting === "numerical") {
					return +a[titleVar.variable].substring(0, 2) > +b[titleVar.variable].substring(0, 2); 
				} else {
					return a[titleVar.variable] > b[titleVar.variable]; 
				}
			});
	}

	render() {
		const { titleVar, descriptionVars, chartTitle, format } = this.props.vizSettings;

		return (
			<div className={"definition-explorer " + format}>
				<div className="definition-explorer__entry-container">
					{this.categoryTitles.map((entryData) => {
						let title = entryData.title,
							subentrySettings = this.categoryData.get(title) ? this.categoryData.get(title).sort((a, b) => { return a[titleVar.variable] > b[titleVar.variable]; }) : null;

						return (
							<DefinitionEntry key={title} title={title} descriptionVars={descriptionVars} entryData={entryData} subentrySettings={subentrySettings} />
						)
					})}
				</div>
			</div>
		)
	}
}

export default DefinitionExplorer;