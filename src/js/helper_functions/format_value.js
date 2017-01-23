import $ from 'jquery';

let d3 = require("d3");

var formatTime = d3.timeFormat("%B %d, %Y");

export function formatValue(value, format) {
	let retVal;

	switch(format) {
		case "number":
			return d3.format(",")(value);
		case "number_with_decimal_2":
			return d3.format(",.2f")(value);
		case "number_per_ten_thousand":
			return d3.format(",.2f")(Number(value)*10000);
		case "integer":
			return Math.round(value);
		case "year":
			return value;
		case "price":
			return d3.format("$,.0f")(value);
		case "price_with_decimal_1":
			return d3.format("$,.1f")(value);
		case "percent_no_multiply":
			return d3.format(".1f")(value) + "%";
		case "percent":
			return d3.format(".0%")(value);
		case "string":
			return value.replace(/<\/?[^>]+(>|$)/g, "");
		case "rank":
		    let s = ["th","st","nd","rd"];
			let v = value%100;
		    return value+(s[(v-20)%10]||s[v]||s[0]);
		case "date":
			return formatTime(new Date(value));
		case "link":
			return value;
	}
}

export function deformatValue(value) {
	let retVal = value.replace(',','');
	return Number(retVal);
}