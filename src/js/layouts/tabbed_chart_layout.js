import $ from 'jquery';

let d3 = require("d3");

import { ChartToggle } from "../components/chart_toggle.js";
import { TopoJsonMap } from "../chart_types/topo_json_map.js";
import { MapboxMap } from "../chart_types/mapbox_map.js";
import { Table } from "../chart_types/table.js";
import { Dashboard } from "./dashboard.js";

export class TabbedChartLayout {
	constructor(vizSettings) {
		Object.assign(this, vizSettings);
		this.chartToggle = new ChartToggle(this.id, this.tabIcons);
		this.vizList = [];
		let i = 0;

		// let filterGroup = new FilterGroup(vizSettings);
		for (let chartSettingsObject of this.chartSettingsList) {
			let chartDiv = d3.select(this.id).append("div")
				.attr("id", this.id.replace("#", "") + "__chart" + i);
				
			// let chartSettingsObject = Object.assign({}, vizSettings);
			chartSettingsObject.id = this.id + "__chart" + i;
			chartSettingsObject.primaryDataSheet = chartSettingsObject.primaryDataSheet ? chartSettingsObject.primaryDataSheet : this.primaryDataSheet;
			
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

			chartDiv.style("display", () => { return i == 0 ? "block" : "none"; });

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
		for (let i = 0; i < this.vizList.length; i++) {
			$(this.id + "__chart" + i).toggle();
		}
		this.resize();
	}
}