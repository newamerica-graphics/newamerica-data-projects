import $ from 'jquery';

let d3 = require("d3");

export function formatValue(value, format) {
	if (format == "number") {
		return d3.format(",")(value);
	} else if (format == "price") {
		return d3.format("$,")(value);
	} else if (format == "percent") {
		return d3.format("%")(value);
	}
}