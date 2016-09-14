require('./../scss/index.scss');

import $ from 'jquery';
let d3 = require("d3");

import { DotMatrix } from "./chart_types/dot_matrix.js";
import { DotHistogram } from "./chart_types/dot_histogram.js";
import { GroupedDotMatrix } from "./chart_types/grouped_dot_matrix.js";
import { UsStatesMap } from "./chart_types/us_states_map.js";
import { MultiChartLayout } from "./layouts/multi_chart_layout.js";
import { GroupedBarChart } from "./chart_types/grouped_bar_chart.js";
import { Table } from "./chart_types/table.js";
import { FactBox } from "./chart_types/fact_box.js";
import { LineChart } from "./chart_types/line_chart.js";

export function setupProject(projectSettings) {
	let { vizSettingsList, imageFolderId } = projectSettings;

	let vizList = [];

	initialize();

	window.addEventListener('resize', resize);

	render();

	function initialize() {

		setDownloadLinks();

		for (let vizSettingsObject of vizSettingsList) {
			let viz;
			switch (vizSettingsObject.vizType) {
				case "chart_table_layout":
					viz = new MultiChartLayout(vizSettingsObject);
					break;

				case "dot_matrix":
					viz = new DotMatrix(vizSettingsObject, imageFolderId);
					break;

				case "dot_histogram":
					viz = new DotHistogram(vizSettingsObject, imageFolderId);
					break;

				case "fact_box":
					viz = new FactBox(vizSettingsObject);
					break;
				
				case "grouped_bar_chart":
					viz = new GroupedBarChart(vizSettingsObject);
					break;

				case "grouped_dot_matrix":
					viz = new GroupedDotMatrix(vizSettingsObject, imageFolderId);
					break;

				case "line_chart":
					viz = new LineChart(vizSettingsObject);
					break;

				case "table":
					viz = new Table(vizSettingsObject);
					break;

				case "us_states_map":
					viz = new UsStatesMap(vizSettingsObject);
					break;
			}

			vizList.push(viz);
		}
	}

	function setDownloadLinks() {
		$("#in-depth__download__xls").attr("href", projectSettings.downloadDataLink + "export?format=xlsx");
		$("#in-depth__download__json").attr("href", projectSettings.dataUrl);
	}

	function render() {
		console.log(vizList);
		d3.json(projectSettings.dataUrl, (d) => {

			for (let viz of vizList) {
				let data = d[viz.primaryDataSheet];
				viz.render(data);
			}
		});

	}

	function resize() {
		for (let viz of vizList) {
			viz.resize ? viz.resize() : null;
		}
	}
}
