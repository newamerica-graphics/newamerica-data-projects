import $ from 'jquery';

let d3 = require("d3");

export class SelectBox {
	constructor(componentSettings) {
		Object.assign(this, componentSettings);
		this.selectBox = d3.select(this.id).append("select")
			.attr("class", "select-box")
			.on("change", (d) => { 
				let index = this.selectBox.property('selectedIndex');
				this.filterChangeFunction(index, this);
			});	
	}

	render(data) {
		console.log("rendering!");
		this.valList = this.customValList || d3.nest()
			.key((d) => { return d[this.variable.variable]; })
			.entries(data[this.primaryDataSheet]);

		this.selectBoxOptions = [];

		this.selectBoxOptions = this.selectBox.selectAll("option")
			.data(this.valList)
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