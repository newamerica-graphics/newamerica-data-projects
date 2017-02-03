import $ from 'jquery';

let d3 = require("d3");

import { ChartToggle } from "../components/chart_toggle.js";
import { TopoJsonMap } from "../chart_types/topo_json_map.js";
import { MapboxMap } from "../chart_types/mapbox_map.js";
import { Table } from "../chart_types/table.js";
import { Dashboard } from "./dashboard.js";

export class TabbedChartLayout {
	constructor(vizSettings) {
		let { id, primaryDataSheet, chartSettingsList } = vizSettings;
		this.id = id;
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
				case "dashboard":
					viz = new Dashboard(chartSettingsObject);
					break;
				case "mapbox_map":
					viz = new MapboxMap(chartSettingsObject);
					break;
				case "table":
					viz = new Table(chartSettingsObject);
					break;
				case "topo_json_map":
					viz = new TopoJsonMap(chartSettingsObject);
					break;
			}
			this.vizList.push(viz);

			i++;
		}
	}

	render(data) {
		console.log(this.vizList);
		let visibilityToggles = [];
		for (let viz of this.vizList) {
			console.log(viz);
			viz.render(data);
		}

		this.chartToggle.render(this.toggleChangedFunction.bind(this));
	}

	resize() {
		for (let viz of this.vizList) {
			viz.resize ? viz.resize() : null;
		}
	}

	toggleChangedFunction() {
		console.log("changing toggles");
		for (let i = 0; i < this.vizList.length; i++) {
			$("#chart" + i).toggle();
		}
		this.resize();
	}
}