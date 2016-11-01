import $ from 'jquery';

let d3 = require("d3");

var formatTime = d3.timeFormat("%B %d, %Y");

export function formatValue(value, format) {
	if (format == "number") {
		return d3.format(",")(value);
	} else if (format == "integer") {
		return Math.round(value);
	} else if (format == "year") {
		return value;
	} else if (format == "price") {
		return d3.format("$,.0f")(value);
	} else if (format == "percent") {
		return d3.format(".0%")(value);
	} else if (format == "string") {
		return value.replace(/<\/?[^>]+(>|$)/g, "");
	} else if (format == "rank") {
	    let s = ["th","st","nd","rd"];
		let v = value%100;
	    return value+(s[(v-20)%10]||s[v]||s[0]);
	} else if (format == "date") {
		return formatTime(new Date(value));
	} else if (format == "link") {
		return value;
	}
}

export function deformatValue(value) {
	let retVal = value.replace(',','');
	return Number(retVal);
}