import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";

import FactBox from './FactBox.js';

const d3 = require("d3");

const FactBoxList = ({variables, format, data}) => {
	return (
		<div className={"callout-box__fact-box-list " + format + " " + variables.length + "-children"}>
			{ variables.map((variable, i) => {
				return <FactBox variableSettings={variable} data={data} format={format} key={i} />
			})}
		</div>
	)
}

export default FactBoxList;