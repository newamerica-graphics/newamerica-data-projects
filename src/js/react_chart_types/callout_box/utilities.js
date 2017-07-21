const d3 = require("d3");

export const getValue = (variableSettings, data) => {
	const { type, query, variable } = variableSettings;

	switch (type) {
		case "value":
			if (query) {
				if (query.operation == "max") {
					let sortedData = data.sort((a, b) => {return Date.parse(b[query.varName]) - Date.parse(a[query.varName]); });
					
					console.log(sortedData[0])
					return sortedData[0][variable.variable];
				}
			} else {
				return data[variable.variable];
			}
		case "sum":
			return d3.sum(data, (d) => { return d[variable.variable]; });

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
	console.log(varName)
	switch (operation) {
		case ">":
			return (value) => {
				console.log(value[varName], compareValue);
				return Date.parse(value[varName]) > compareValue;
			}
	}
}