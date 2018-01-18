const d3 = require("d3");

import { formatValue } from "../../helper_functions/format_value.js";


export const getValue = (variableSettings, data) => {
	const { type, query, variable } = variableSettings;
	let retVal;

	switch (type) {
		case "value":
			if (query) {
				if (query.operation == "max") {
					let sortedData = data.sort((a, b) => {return Date.parse(b[query.varName]) - Date.parse(a[query.varName]); });
					
					return formatValue(sortedData[0][variable.variable], variable.format);
				}
			} else {
				return formatValue(data[variable.variable], variable.format);
			}
		case "sum":
			return formatValue(d3.sum(data, (d) => { return d[variable.variable]; }), variable.format);

		case "count":
			if (query) {
				let filterFunc = getFilterFunc(query);
				return data.filter((d) => { return filterFunc(d); }).length;
			} else {
				return data.length;
			}

		case "sum-range":
			const {variableMin, variableMax} = variableSettings
			let minSum = d3.sum(data, (d) => { return d[variableMin.variable]; }),
				maxSum = d3.sum(data, (d) => { return d[variableMax.variable]; });

			return minSum + " - " + maxSum;
	}
}

const getFilterFunc = ({varName, operation, compareValue}) => {
	switch (operation) {
		case ">":
			return (value) => {
				return Date.parse(value[varName]) > compareValue;
			}
	}
}