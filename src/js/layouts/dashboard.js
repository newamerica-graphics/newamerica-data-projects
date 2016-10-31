import $ from 'jquery';

let d3 = require("d3");

import { DotHistogram } from "../chart_types/dot_histogram.js";
import { UsMap } from "../chart_types/us_map.js";
import { SelectBox } from "../components/select_box.js";
import { Tooltip } from "../components/tooltip.js";

export class Dashboard {
	constructor(vizSettings) {
		let { id, layoutRows } = vizSettings;
		this.id = id;

		this.componentList = [];
		let i = 0;

		for (let layoutRow of layoutRows) {
			for (let componentSettings of layoutRow) {
				d3.select(this.id).append("div")
					.attr("id", "viz" + i)
					.style("width", componentSettings.width ? componentSettings.width : "auto")
					.classed("full-row", layoutRow.length == 1 ? true : false);

				componentSettings.id = "#viz" + i;

				this.componentList.push(this.initializeComponent(componentSettings));
				i++;
			}
		}

	}

	initializeComponent(componentSettings) {
		if (componentSettings.isMessagePasser) {
			componentSettings.filterChangeFunction = this.changeFilter.bind(this);
		}
			
		let component;
		switch (componentSettings.vizType) {
			case "dot_histogram":
				component = new DotHistogram(componentSettings);
				break;
			case "select_box":
				component = new SelectBox(componentSettings);
				break;
			case "tooltip":
				component = new Tooltip(componentSettings);
				break;
			case "us_map":
				component = new UsMap(componentSettings);
				break;
		}
		
		component.messageHandlerType = componentSettings.messageHandlerType;
		return component;
	}

	render(data) {
		for (let component of this.componentList) {
			component.render(data);
		}
	}

	resize() {
		for (let component of this.componentList) {
			component.resize ? component.resize() : null;
		}
	}

	changeFilter(value, messageOriginator) {
		for (let component of this.componentList) {
			if (component.id != messageOriginator.id) {

				switch (component.messageHandlerType) {
					case null:
						break;
					case "change_filter":
						component.changeFilter(value) ? component.changeFilter(value) : null;
						break;
					case "change_value":
						console.log(component);
						component.changeValue(value) ? component.changeValue(value) : null;
						break;
				}
			}
		}
		console.log(value);
	}

	addSelectBox() {
		// this.selectBox = 
		let id = this.selectBoxValList[index].values[0].id;
			this.changeFilter(id);
	}

	populateSelectBox(data) {
		
	}


}