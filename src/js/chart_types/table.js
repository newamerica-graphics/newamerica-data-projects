import $ from 'jquery';

let d3 = require("d3");

let dt = require('datatables.net');

import { getColorScale } from "../helper_functions/get_color_scale.js";


export class Table {
	constructor(vizSettings) {
		let {id, tableVars, colorScaling, primaryDataSheet } = vizSettings;

		this.tableVars = tableVars;
		this.colorScaling = colorScaling;
		this.primaryDataSheet = primaryDataSheet;

		d3.select(id).append("table")
			.attr("id", "dataTable")
			.attr("class", "table hover cell-border");
	}

	render(data) {
		this.data = data;
		this.table = $("#dataTable").DataTable({
			data: data,
			columns: this.getColumnNames(),
		    lengthChange: false,
		    paging: false,
		});

		if (this.colorScaling) {
			this.table.on('order.dt', this.orderChanged.bind(this));
		}


	}

	getColumnNames() {
		let columnNames = [];
		for (let tableVar of this.tableVars) {
			let varObject = {"title": tableVar.displayName, "data": tableVar.variable};
			columnNames.push(varObject);
		}

		return columnNames;
	}

	orderChanged() {
		let orderingIndex = this.table.order()[0][0];
		let orderingColumn = this.tableVars[orderingIndex];

		let dataMin = Number(d3.min(this.data, function(d) { return Number(d[orderingColumn.variable]); })); 
		let dataMax = Number(d3.max(this.data, function(d) { return Number(d[orderingColumn.variable]); }));

		// scaleType, color, numBins, dataMin, dataMax
		// let colorScaleSettings = {};
		// colorScaleSettings.scaleType = orderingColumn.scaleType;
		// colorScaleSettings.color = orderingColumn.color;


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
}


