import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";

const Definition = ({settings}) => {
	const {title, description} = settings;
	return (
		<div className="definition-explorer__definition">
			<h5 className="definition-explorer__definition__title">{title}</h5>
			<p className="definition-explorer__definition__description">{description}</p>
		</div>
	)
}

export default Definition;