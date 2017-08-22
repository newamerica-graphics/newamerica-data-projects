import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";

let Select = require('react-select');

const d3 = require("d3");

class SelectBox extends React.Component {
	constructor() {
		super()
	}

	filterChanged(val) {
		console.log("Selected: " + JSON.stringify(val));
		if (val) {
			this.props.filterChangeFunc(val.value)
		} else {
			this.props.filterChangeFunc(null)
		}
	}

	render() {
		const { values } = this.props; 
		let options = values.map((d) => {
			return { value: d, label: d}
		})

		console.log(options)
		return (
			<Select
				name="select-box"
				value="one"
				options={options}
				onChange={(val) => { return this.filterChanged(val); }} />
		)
	}
}

export default SelectBox;