import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";
import { getValue } from "./utilities.js";

const DataParagraph = ({variable, data}) => {

	let value = getValue(variable, data);
	return (
		<div className="callout-box__data-paragraph">
			<h5 className="callout-box__data-paragraph__label">{ variable.label }</h5>
			<p className="callout-box__data-paragraph__value">{ value }</p>
		</div>
	)
}


export default DataParagraph;