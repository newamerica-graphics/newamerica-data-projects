import $ from 'jquery';

let d3 = require("d3");

let dt = require('datatables.net');

export class Table {
	constructor(id, data) {
		console.log("I'm a table!");
		console.log(data);

		let table = d3.select(id).append("table")
			.classed("table", true);

		var dataSample = [
			{
				"state":"California",
				"value":"1",
				"value1":"2"
			},
			{
				"state":"Alabama",
				"value":"5",
				"value1":"2"
			},
			{
				"state":"Arizona",
				"value":"1",
				"value1":"3"
			}
		];

		$(table).DataTable( {
		    data: dataSample
		} );
	}
}


