import $ from 'jquery';

let d3 = require("d3");

export function formatValue(value, format) {
	if (format == "number") {
		return d3.format(",")(value);
	} if (format == "year") {
		return value;
	} else if (format == "price") {
		return d3.format("$,.2f")(value);
	} else if (format == "percent") {
		return d3.format("%")(value);
	} else if (format == "string") {
		return value.replace(/<\/?[^>]+(>|$)/g, "");
	}
}

export function deformatValue(value) {
	let retVal = value.replace(',','');
	return Number(retVal);
}