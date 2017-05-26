import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";


const CategoryToggle = ({label, changeCategoryFunc}) => {
	return (
		<div className="resource-toolkit__category-toggle" onClick={() => { return changeCategoryFunc("a"); }}>{label}</div>
	)
}

export default CategoryToggle;