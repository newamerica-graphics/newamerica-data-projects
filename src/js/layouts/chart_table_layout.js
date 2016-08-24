import $ from 'jquery';

let d3 = require("d3");

import { ChartToggle } from "../components/chart_toggle.js";
import { UsStatesMap } from "../chart_types/us_states_map.js";
import { FilterGroup } from "../components/filter_group.js";
import { Table } from "../chart_types/table.js";

let chartToggle, usMap, filterGroup, table;

let vizList = [];

export class ChartTableLayout {
	constructor(vizSettings) {
		chartToggle = new ChartToggle(vizSettings.id);

		let i = 0;

		// let filterGroup = new FilterGroup(vizSettings);
		for (let chartType of vizSettings.layoutComponents) {
			d3.select(vizSettings.id).append("div")
				.attr("id", "chart" + i)
				.style("display", function() { return i == 0 ? "block" : "none"; });

			let chartSettingsObject = Object.assign({}, vizSettings);
			chartSettingsObject.id = "#chart" + i;
			
			let viz;
			switch (chartType) {
				case "us_states_map":
					viz = new UsStatesMap(chartSettingsObject);
					vizList.push(viz);
					break;
				case "table":
					viz = new Table(chartSettingsObject);
					vizList.push(viz);
					break;
			}

			i++;
		}
	}

	render(data) {
		// filterGroup.render(this.changeFilter);
		let visibilityToggles = [];
		for (let viz of vizList) {
			viz.render(data);
			visibilityToggles.push(viz.toggleVisibility);
		}

		chartToggle.render(visibilityToggles);
	}

	resize() {
		for (let viz of vizList) {
			viz.resize ? viz.resize() : null;
		}
	}

	changeFilter(variable) {
		let newFilterVar = $(variable).attr("value");
		usMap.changeFilter(newFilterVar);
	}
}