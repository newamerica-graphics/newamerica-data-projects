import $ from 'jquery';

let d3 = require("d3");

import { ChartToggle } from "../components/chart_toggle.js";
import { UsStatesMap } from "../chart_types/us_states_map.js";
import { Table } from "../chart_types/table.js";

export class MultiChartLayout {
	constructor(vizSettings) {
		let { id, primaryDataSheet, chartSettingsList } = vizSettings;

		this.primaryDataSheet = primaryDataSheet;

		this.chartToggle = new ChartToggle(id);
		this.vizList = [];
		let i = 0;

		// let filterGroup = new FilterGroup(vizSettings);
		for (let chartSettingsObject of chartSettingsList) {
			d3.select(id).append("div")
				.attr("id", "chart" + i)
				.style("display", function() { return i == 0 ? "block" : "none"; });

			// let chartSettingsObject = Object.assign({}, vizSettings);
			chartSettingsObject.id = "#chart" + i;
			
			let viz;
			switch (chartSettingsObject.vizType) {
				case "us_states_map":
					viz = new UsStatesMap(chartSettingsObject);
					this.vizList.push(viz);
					break;
				case "table":
					viz = new Table(chartSettingsObject);
					this.vizList.push(viz);
					break;
			}

			i++;
		}
	}

	render(data) {
		let visibilityToggles = [];
		for (let viz of this.vizList) {
			viz.render(data);
		}

		this.chartToggle.render(this.vizList.length);
	}

	resize() {
		for (let viz of this.vizList) {
			viz.resize ? viz.resize() : null;
		}
	}
}