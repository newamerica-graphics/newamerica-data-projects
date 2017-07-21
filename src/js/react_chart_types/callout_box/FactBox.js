import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";
import { getValue } from "./utilities.js";

const FactBox = ({variableSettings, data}) => {
	console.log("in fact box", variableSettings, data);
	let currDate = new Date();
console.log(currDate.setMonth(currDate.getMonth() - 6));

	let value = getValue(variableSettings, data);
	return (
		<div className="callout-box__fact-box">
			<h1 className="callout-box__fact-box__value">{ value }</h1>
			<h5 className="callout-box__fact-box__label">{ variableSettings.label }</h5>
		</div>
	)
}


export default FactBox;