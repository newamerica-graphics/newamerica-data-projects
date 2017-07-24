import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";

import FactBox from './FactBox.js';

const d3 = require("d3");

const FactBoxList = ({variables, format, data}) => {
	console.log("in fact box list", variables)
	return (
		<ul className={"callout-box__fact-box-list " + format + " " + variables.length + "-children"}>
			{ variables.map((variable, i) => {
				return <FactBox variableSettings={variable} data={data} format={format} key={i} />
			})}
		</ul>
	)
}

export default FactBoxList;