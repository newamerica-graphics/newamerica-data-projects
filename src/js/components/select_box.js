import $ from 'jquery';

let d3 = require("d3");

export class SelectBox {
	constructor(componentSettings) {
		let { id, filterChangeFunction, primaryDataSheet, variable } = componentSettings;
		this.id = id;
		this.primaryDataSheet = primaryDataSheet;
		this.variable = variable;
		this.selectBox = d3.select(id).append("select")
			.attr("class", "select-box")
			.on("change", (d) => { 
				let index = this.selectBox.property('selectedIndex');
				filterChangeFunction(index, this);
			});	
	}

	render(data) {
		let valList = d3.nest()
			.key((d) => { return d[this.variable.variable]; })
			.entries(data[this.primaryDataSheet]);

		let selectBoxOption;
		this.selectBoxOptions = [];

		this.selectBoxOptions = this.selectBox.selectAll("option")
			.data(valList)
			.enter()
			.append("option")
			.text((d) => { return d.key; })
			.attr("value", (d) => { return d.values[0].id; });
	}

	changeValue(value) {
		console.log("changing value" + value);
		this.selectBoxOptions.attr("selected", (d, i) => {  return i == Number(value); });
		$(this.id + " .select-box").val(value);
	}

}