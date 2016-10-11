import $ from 'jquery';

let d3 = require("d3");

import { BarChart } from "../chart_types/bar_chart.js";
import { UsCountiesMap } from "../chart_types/us_counties_map.js";

export class Dashboard {
	constructor(vizSettings) {
		let { id, chartSettingsList } = vizSettings;

		this.vizList = [];
		let i = 0;

		// let filterGroup = new FilterGroup(vizSettings);
		for (let chartSettingsObject of chartSettingsList) {
			d3.select(id).append("div")
				.attr("id", "chart" + i);

			// let chartSettingsObject = Object.assign({}, vizSettings);
			chartSettingsObject.id = "#chart" + i;

			if (chartSettingsObject.isMessagePasser) {
				chartSettingsObject.filterChangeFunction = this.changeFilter.bind(this);
			}
			
			let viz;
			switch (chartSettingsObject.vizType) {
				case "bar_chart":
					viz = new BarChart(chartSettingsObject);
					this.vizList.push(viz);
					break;
				case "us_counties_map":
					viz = new UsCountiesMap(chartSettingsObject);
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
	}

	resize() {
		for (let viz of this.vizList) {
			viz.resize ? viz.resize() : null;
		}
	}

	changeFilter(value) {
		for (let viz of this.vizList) {
			viz.changeFilter ? viz.changeFilter(value) : null;
		}
		console.log(value);
	}


}