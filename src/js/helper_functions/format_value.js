import $ from 'jquery';

let d3 = require("d3");

export function formatValue(value, format) {
	if (format == "number") {
		return d3.format(",")(value);
	} if (format == "year") {
		return value;
	} else if (format == "price") {
		console.log(value);
		return d3.format("$,.2f")(value);
	} else if (format == "percent") {
		return d3.format(".0%")(value);
	} else if (format == "string") {
		return value.replace(/<\/?[^>]+(>|$)/g, "");
	} else if (format == "rank") {
	    let s = ["th","st","nd","rd"];
		let v = value%100;
	    return value+(s[(v-20)%10]||s[v]||s[0]);
	}
}

export function deformatValue(value) {
	let retVal = value.replace(',','');
	return Number(retVal);
}