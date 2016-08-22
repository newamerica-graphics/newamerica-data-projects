import $ from 'jquery';

let d3 = require("d3");

let chartToggle; 
export class ChartToggle {
	constructor(id) {
		chartToggle = d3.select(id).append("div")
			.classed("chart-toggle", true);


	}

	render(projectCharts, togglefunc1, togglefunc2) {
		chartToggle.append("div")
			.text("chart")
			.on("click", togglefunc1);

		chartToggle.append("div")
			.text("table")
			.on("click", togglefunc2);


	}
}