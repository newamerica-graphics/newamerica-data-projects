import $ from 'jquery';

let d3 = require("d3");

let dt = require('datatables.net');
// let zf = require('datatables.net-responsive');

export class Table {
	constructor(id, data) {
		console.log("I'm a table!");
		console.log(data);

		// d3.select(id).append("table")
		// 	.classed("table", true);

		let table = $("#tableDiv").DataTable({
			data: data,
			columns: [
		        { data: 'state' },
		        { data: 'value' },
		        { data: 'value1' }
		    ],
		    lengthChange: false,
		    paging: false,
		    // pageLength: 50
		});

		$("#tableDiv").on( 'order.dt', function () {
		    // This will show: "Ordering on column 1 (asc)", for example
		    var order = table.order();
		    console.log(order);
		   console.log( 'Ordering on column '+order[0][0]+' ('+order[0][1]+')' );
		} );

		this.applyColorScale();
	}

	applyColorScale() {
		console.log($(".sorting_1"));
	}
}


