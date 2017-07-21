import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";
import { getValue } from "./utilities.js";

const DataParagraph = ({variable, data}) => {

	let value = getValue(variable, data);
	return (
		<div className="callout-box__data-paragraph">
			<h5 className="callout-box__fact-box__label">{ variable.label }</h5>
			<h1 className="callout-box__data-paragraph__value">{ value }</h1>
		</div>
	)
}


export default DataParagraph;