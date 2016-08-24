import $ from 'jquery';

let d3 = require("d3");

let dt = require('datatables.net');


import { getColorScale } from "../helper_functions/get_color_scale.js";

let table, id, tableVars;

export class Table {
	constructor(vizSettings) {
		({id, tableVars} = vizSettings);

		d3.select(id).append("table")
			.attr("id", "dataTable")
			.attr("class", "table hover cell-border");
	}

	render(data) {
		this.data = data;
		table = $("#dataTable").DataTable({
			data: data,
			columns: this.getColumnNames(),
		    lengthChange: false,
		    paging: false,
		}).on('order.dt', this.orderChanged.bind(this));


	}

	getColumnNames() {
		let columnNames = [];
		for (let tableVar of tableVars) {
			let varObject = {"title": tableVar.displayName, "data": tableVar.variable};
			columnNames.push(varObject);
		}

		return columnNames;
	}

	orderChanged() {
		let orderingIndex = table.order()[0][0];
		let orderingColumn = tableVars[orderingIndex];

		let dataMin = Number(d3.min(this.data, function(d) { return Number(d[orderingColumn.variable]); })); 
		let dataMax = Number(d3.max(this.data, function(d) { return Number(d[orderingColumn.variable]); }));

		let colorScale = getColorScale(orderingColumn, dataMin, dataMax);

		// clears previously colored cells
		d3.selectAll("td")
			.style("border-left", "none");

		let sorted = d3.selectAll(".sorting_1")
			.style("border-left", "7px solid")
			.style("border-left-color", function() { return colorScale($(this).text());});

	}

	applyColorScale() {
		console.log($(".sorting_1"));
	}

	toggleVisibility() {
		console.log("toggling visibility of table!");
		$(id).toggle();
	}
}


