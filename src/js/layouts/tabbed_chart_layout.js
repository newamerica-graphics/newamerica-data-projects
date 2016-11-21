import $ from 'jquery';

let d3 = require("d3");

import { ChartToggle } from "../components/chart_toggle.js";
import { TopoJsonMap } from "../chart_types/topo_json_map.js";
import { Table } from "../chart_types/table.js";

export class TabbedChartLayout {
	constructor(vizSettings) {
		let { id, primaryDataSheet, chartSettingsList } = vizSettings;

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
			chartSettingsObject.primaryDataSheet = primaryDataSheet;
			
			let viz;
			switch (chartSettingsObject.vizType) {
				case "topo_json_map":
					viz = new TopoJsonMap(chartSettingsObject);
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