import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { colors } from "../../helper_functions/colors.js";
import { isTouchDevice } from "../../helper_functions/is_touch_device.js";

const d3 = require("d3");

class DefinitionEntry extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			expanded: false
		}
	}

	onClick() {
		this.setState({
			expanded: !this.state.expanded
		})
	}

	render() {
		const {title, descriptionVars, subentrySettings, entryData} = this.props;
		let classList, entryDescription, subentries;
		classList = "definition-explorer__entry";
		classList += this.state.expanded ? " expanded" : "";

		entryDescription = this.renderEntryDescription(entryData)
		subentries = this.renderSubentries()
		
		return (
			<div className={classList} onClick={() => {return this.onClick()}}>
				<h5 className="definition-explorer__entry__title">{title}</h5>
				<CSSTransitionGroup
				      transitionName="entry-content"
			          transitionEnterTimeout={500}
			          transitionLeaveTimeout={0}>
				    { this.state.expanded && <div className="definition-explorer__entry__content" key={title}>
						{entryDescription}
						{subentries}
					</div> }
				</CSSTransitionGroup >
			</div>
		)
	}

	renderDescriptionSection(entryData, varSettings) {
		let text = entryData[varSettings.variable]

		if (text) {
			return (
				<div key={varSettings.variable} className="definition-explorer__entry__description-section">
					<h5 className="definition-explorer__entry__description-section__label">{varSettings.displayName}</h5>
					<h5 className="definition-explorer__entry__description-section__value">{text}</h5>
				</div>
			)
		} else {
			return null;
		}
	}

	renderEntryDescription(entryData) {
		const {descriptionVars} = this.props;

		return descriptionVars.map((varSettings) => {
			return this.renderDescriptionSection(entryData, varSettings)
		})
	}

	renderSubentries() {
		const {title, descriptionVars, subentrySettings, entryData} = this.props;
		if (subentrySettings) {
			return (
				<div className="definition-explorer__entry__sub-list">
					{ subentrySettings.map((subentry) => {
						return (
							<div className="definition-explorer__sub-entry">
								<h5 className="definition-explorer__sub-entry__title">{subentry.title}</h5>
								<div className="definition-explorer__sub-entry__description">
									{this.renderEntryDescription(subentry)}
								</div>
							</div>
						)
					})}
				</div>
			)
		}
	}

	
}

export default DefinitionEntry;