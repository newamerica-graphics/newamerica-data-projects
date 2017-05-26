import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";

import CategoryToggle from './CategoryToggle';


class CategoryToggles extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {resourcesByCategory, changeCategoryFunc } = this.props;
		return (
			<div className="resource-toolkit__category-toggle-container">
				{resourcesByCategory.map((category) => {
					return (
						<CategoryToggle key={category.key} label={category.key} changeCategoryFunc={changeCategoryFunc} />
					)
				})}
			</div>
		)
	}
}

export default CategoryToggles;