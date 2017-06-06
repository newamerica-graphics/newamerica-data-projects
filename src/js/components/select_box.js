import $ from 'jquery';

let d3 = require("d3");

export class SelectBox {
	constructor(componentSettings) {
		Object.assign(this, componentSettings);
		this.selectBoxContainer = d3.select(this.id).append("div")
			.attr("class", "select-box-container");

		this.selectBox = this.selectBoxContainer.append("select")
			.attr("class", "select-box")
			.on("change", (d) => { 
				let index = this.selectBox.property('selectedIndex');
				index -= this.placeholder ? 1 : 0;

				if (this.hasShowAllButton) {
					console.log("has show all");
					this.showAllButton
						.style("display", "inline-block");
				}

				if (this.passValueName) {
					this.filterChangeFunction(this.valList[index].key, this);
				} else {
					this.filterChangeFunction(index, this);
				}
			});

		this.showingAll = true;

		if (this.hasShowAllButton) {
			this.showAllButton = this.selectBoxContainer.append("div")
				.attr("class", "select-box__show-all")
				.text("Show All")
				.style("display", "none")
				.on("click", () => { 
					this.changeValue(""); 
					this.filterChangeFunction(null, this);
				});
		}
	}

	render(data) {
		this.valList = this.customValList || d3.nest()
			.key((d) => { return d[this.variable.variable]; })
			.sortKeys((a, b) => { return this.sortVals ? d3.ascending(a, b) : 1 })
			.entries(data[this.primaryDataSheet]);

		if (this.placeholder) {
			this.selectBox.append("option")
				.attr("value", "")
				.attr("disabled", true)
				.attr("selected", true)
				.text(this.placeholder)
		}

		this.selectBoxOptions = this.selectBox.selectAll(".select-box__option")
			.data(this.valList)
			.enter()
			.append("option")
			.text((d) => { return d.key; })
			.attr("value", (d) => { return d.values[0].id; })
			.attr("class", "select-box__option");
	}

	changeValue(value) {
		$(this.id + " .select-box").val(value);

		if (this.hasShowAllButton) {
			console.log("has show all", value);
			this.showAllButton
				.style("display", value && value != null ? "inline-block" : "none");
		}
	}

}