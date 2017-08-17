import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";
import { getValue } from "./utilities.js";

const FactBox = ({variableSettings, data, format}) => {
	let currDate = new Date();
	
	let value = getValue(variableSettings, data);

	if (variableSettings.format) {
		value = formatValue(value, variableSettings.format);
	}

	let content;
	if (format == "horizontal") {
		return (
			<div className="callout-box__fact-box">
				<h1 className="callout-box__fact-box__value">{ value }</h1>
				<h5 className="callout-box__fact-box__label">{ variableSettings.label }</h5>
			</div>
		)
	} else {
		return (
			<div className="callout-box__fact-box">
				<h5 className="callout-box__fact-box__label">{ variableSettings.label }</h5>
				<h1 className="callout-box__fact-box__value">{ value }</h1>
				{variableSettings.subVars && 
					<ul className="callout-box__fact-box__sub-list">
						{variableSettings.subVars.map((currVar) => {
							let subValue = getValue(currVar, data);

							return (
								<li className="callout-box__fact-box__sub-list__item">
									<h5 className="callout-box__fact-box__sub-label">{ currVar.label }</h5>
									<h1 className="callout-box__fact-box__sub-value">{ subValue || 0 }</h1>
								</li>
							)
						})}
					</ul>
				}
			</div>
		)
	}
}


export default FactBox;