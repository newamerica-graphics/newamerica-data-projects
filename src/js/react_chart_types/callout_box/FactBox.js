import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";
import { getValue } from "./utilities.js";

const FactBox = ({variableSettings, data, format}) => {
	console.log("in fact box", variableSettings, data);
	let currDate = new Date();
console.log(currDate.setMonth(currDate.getMonth() - 6));

	let value = getValue(variableSettings, data);

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
			</div>
		)
	}
}


export default FactBox;