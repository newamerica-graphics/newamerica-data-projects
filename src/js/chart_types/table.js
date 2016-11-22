import $ from 'jquery';

let d3 = require("d3");

let dt = require('datatables.net');

import { getColorScale } from "../helper_functions/get_color_scale.js";
import { formatValue } from "../helper_functions/format_value.js";


export class Table {
	constructor(vizSettings) {
		let {id, tableVars, colorScaling, primaryDataSheet, pagination, numPerPage, defaultOrdering} = vizSettings;

		this.id = id;
		this.tableVars = tableVars;
		this.colorScaling = colorScaling;
		this.pagination = pagination;
		this.numPerPage = numPerPage;
		this.defaultOrdering = defaultOrdering;
		this.primaryDataSheet = primaryDataSheet;

		d3.select(id).append("table")
			.attr("id", "dataTable")
			.attr("class", "table");
	}

	render(data) {
		this.data = data[this.primaryDataSheet];
		this.table = $(this.id + " #dataTable").DataTable({
			data: this.data,
			columns: this.getColumnNames(),
		    lengthChange: false,
		    paging: this.pagination ? true : false,
		    pageLength: this.numPerPage,
		    scrollX: false,
		    order: this.defaultOrdering ? this.defaultOrdering : ["0", "asc"]
		});

		if (this.colorScaling) {
			this.table.on('order.dt', this.orderChanged.bind(this));
		}

		$(this.id + ' input').addClass("search-box__input").attr("placeholder", "Search");

		$(this.id + " #dataTable").wrap( "<div class='block-table'></div>" );
	}

	getColumnNames() {
		let columnNames = [];
		for (let tableVar of this.tableVars) {

			let varObject = {
				"title": tableVar.displayName, 
				"data": tableVar.variable,
				"orderable" : tableVar.disableTableOrdering ? false : true,
				"render": function ( data, type, row ) {
        			return formatValue(data, tableVar.format);
        		}
        	};
        	console.log(varObject);
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


