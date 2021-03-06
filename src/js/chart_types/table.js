import $ from 'jquery';

let d3 = require("d3");

let dt = require('datatables.net');
let dtFixed = require('datatables.net-fixedcolumns');

import { getColorScale } from "../helper_functions/get_color_scale.js";
import { formatValue } from "../helper_functions/format_value.js";

let checkMark = '<svg class="passfailcheck" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.33 13.75"><defs><style>.check-mark{fill:none;stroke:#2dbbb3;stroke-linecap:square;stroke-width:4px;}</style></defs><title>check-mark</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><polyline class="check-mark" points="3.53 6.9 7.07 10.26 13.79 3.54"/></g></g></svg>';
let xMark = '<svg class="passfailcheck" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.32 13.32"><defs><style>.x-mark{fill:none;stroke:#e65c64;stroke-linecap:square;stroke-width:3px;}</style></defs><title>x-mark</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><line class="x-mark" x1="3.54" y1="3.54" x2="9.78" y2="9.78"/><line class="x-mark" x1="9.78" y1="3.54" x2="3.54" y2="9.78"/></g></g></svg>';

export class Table {
	constructor(vizSettings) {
		Object.assign(this, vizSettings)

		d3.select(this.id).append("table")
			.attr("id", "dataTable")
			.attr("class", "table");

		this.popup = d3.select("body").append("div")
			.attr("class", "table__popup hidden");

		$(window).resize(setTableWidth);
	}

	render(data) {
		this.data = data[this.primaryDataSheet];

		// should phase this one out in favor of the filter function below
		if (this.filterInitialDataBy) {
			for (let filter of this.filterInitialDataBy) {
				if (filter.value) {
	            	this.data = this.data.filter((d) => { return d[filter.field] == filter.value; });
	            } else {
	            	this.data = this.data.filter((d) => { return d[filter.field] });
	            }
			}
        }

        if (this.filterInitialDataFunction) { 
        	this.data = this.data.filter((d) => { return this.filterInitialDataFunction(d); });
        }

        if (this.colorVals) {
			this.colorScales = {};
			this.tableVars.forEach((varObject, i) => {
				if (varObject.colorTable) {
					this.colorScales[i] = getColorScale(this.data, varObject)
				} else {
					this.colorScales[i] = null;
				}
			})
		}

		this.table = $(this.id + " #dataTable").DataTable({
			data: this.data,
			columns: this.getColumnNames(),
		    lengthChange: false,
		    paging: this.pagination ? true : false,
		    pageLength: this.numPerPage,
		    scrollX: this.freezeColumn ? true : false,
		    ordering: this.disableOrdering? false : true,
		    order: this.defaultOrdering ? this.defaultOrdering : ["0", "asc"],
		    searching: this.disableSearching ? false : true,
		    fixedColumns: this.freezeColumn ? this.freezeColumn : {}
		});

		if (this.colorVals) {
			d3.selectAll("tr")
				.selectAll("td")
				.style("color", (d, i, paths) => { 
					if (this.colorScales[i]) {
						return this.colorScales[i]($(paths[i]).text().trim())
					}
					
					return "black"; 
				})
				.style("font-weight", (d, i) => { return this.colorScales[i] ? "bold" : "normal"; });
		}

		// if (this.passFailChecks) {
		// 	d3.selectAll("tr")
		// 		.selectAll("td")
		// 		.html((d, i, paths) => { 
		// 			if (this.tableVars[i].passFailChecks) {
		// 				return "test!!!!"
		// 			} else {
		// 				return "default"
		// 			}
		// 		})
		// }

		if (this.colorScaling) {
			this.table.on('order.dt', this.orderChanged.bind(this));
		}

		$(this.id + ' input').addClass("search-box__input").attr("placeholder", "Search");

		// $(this.id + " #dataTable").wrap( "<div class='block-table'></div>" );

		// hide "showing _ of _ results footer if no searching and pagination"
		this.disableSearching && !this.pagination ? $(this.id + " .dataTables_info").hide() : null;
		this.attachPopup();

		setTableWidth();
	}

	getColumnNames() {
		let columnNames = [];
		for (let tableVar of this.tableVars) {

			let varObject = {
				"title": tableVar.displayName, 
				"data": tableVar.variable,
				"orderable" : tableVar.disableTableOrdering ? false : true,
				"render": function ( data, type, row ) {
					if (tableVar.format == "long_text" && data && data.length > 100) {
						return "<div class='table__content'><span class='table__content__shown'>" + data.slice(0, 100) + "...</span><span class='table__content__hidden'>" + data.slice(100, data.length) + "</span></div>";
					} else if (tableVar.passFailChecks) {
						if (data == "Passed") {
							return checkMark
						} else {
							return xMark
						}
					} else {
						return formatValue(data, tableVar.format);
					}
        			
        		},
        	};

        	if (tableVar.format == "date" || tableVar.format == "date_simple") {
        		varObject["type"] = "date";
        	} else if (tableVar.format == "number") {
        		varObject["type"] = "num";
        	}

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

	attachPopup() {
		$(".table__content")
			.on("mouseover", (e) => {
				this.showPopup(e);
			})
			.on("mouseout", () => {
				this.popup.classed("hidden", true);
			});

		$(this.id).on("touchstart", (e) => {
			if ($(e.target).hasClass("table__content")) {
				this.showPopup(e);
			} else {
				this.popup.classed("hidden", true);
			}
		})
	}

	showPopup(e) {
		let shownText = $(e.target).children(".table__content__shown")[0].innerText,
			hiddenText = $(e.target).children(".table__content__hidden")[0].innerText;

		let text = shownText.replace("...", "") + hiddenText;

		if (text.length > 150) {
			this.popup
				.classed("hidden", false)
				.html(text)
				.style("top", (e.pageY + 35) + "px")
				.style("left", (e.pageX - 150) + "px");
		}
	}


}

function setTableWidth() {
	var $contentContainer = $(".content-container");
	var $body = $("body")
	var bodyWidth = $body.width();

	if ($contentContainer.hasClass("has-sidemenu") && (bodyWidth > 965)) {
		$(".block-table").width(bodyWidth - 300);
		$(".dataTables_wrapper").css("max-width", bodyWidth - 300);
	} else if ($body.hasClass("template-indepthsection") || $body.hasClass("template-indepthproject")) {
		$(".block-table").width(bodyWidth - 100);
		$(".dataTables_wrapper").css("max-width", bodyWidth - 100);
	} else {
		$(".block-table").width(bodyWidth - 50);
		$(".dataTables_wrapper").css("max-width", bodyWidth - 50);
	}
}



