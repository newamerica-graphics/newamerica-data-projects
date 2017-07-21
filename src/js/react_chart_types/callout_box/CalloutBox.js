import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";

import CalloutBoxDataElement from './CalloutBoxDataElement.js';

const d3 = require("d3");

class CalloutBox extends React.Component {
	constructor(props) {
		super(props);
		console.log(props);

		this.data = props.data[props.vizSettings.primaryDataSheet];
	}

	render() {
		const { sections } = this.props.vizSettings;

		return (
			<div className="callout-box">
				{ sections.map((sectionSettings) => {
					console.log(sectionSettings)
					return (
						<div className="callout-box__section" key={sectionSettings.title}>
							<h3 className="callout-box__section__title">{sectionSettings.title}</h3>
							{ sectionSettings.dataElements.map((dataElementSettings, i) => {
								console.log(dataElementSettings)
								return <CalloutBoxDataElement settings={dataElementSettings} data={this.data} key={i} />
							})}
						</div>
					)
				})}
			</div>
		)
	}
}

export default CalloutBox;