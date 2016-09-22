require('./../scss/index.scss');
var json2csv = require('json2csv');

import $ from 'jquery';
let d3 = require("d3");


import { DotMatrix } from "./chart_types/dot_matrix.js";
import { DotHistogram } from "./chart_types/dot_histogram.js";
import { GroupedDotMatrix } from "./chart_types/grouped_dot_matrix.js";
import { UsStatesMap } from "./chart_types/us_states_map.js";
import { MultiChartLayout } from "./layouts/multi_chart_layout.js";
import { ChartWithFactBox } from "./layouts/chart_with_fact_box.js";
import { GroupedBarChart } from "./chart_types/grouped_bar_chart.js";
import { Table } from "./chart_types/table.js";
import { FactBox } from "./chart_types/fact_box.js";
import { LineChart } from "./chart_types/line_chart.js";
import { SummaryBox } from "./chart_types/summary_box.js";
import { PieChart } from "./chart_types/pie_chart.js";

export function setupProject(projectSettings) {
	let { vizSettingsList, imageFolderId, dataSheetNames } = projectSettings;

	let vizList = [];

	initialize();

	window.addEventListener('resize', resize);

	render();

	function initialize() {

		for (let vizSettingsObject of vizSettingsList) {
			let viz;
			switch (vizSettingsObject.vizType) {
				case "chart_table_layout":
					viz = new MultiChartLayout(vizSettingsObject);
					break;

				case "chart_with_fact_box":
					viz = new ChartWithFactBox(vizSettingsObject, imageFolderId);
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

				case "pie_chart":
					viz = new PieChart(vizSettingsObject);
					break;

				case "summary_box":
					viz = new SummaryBox(vizSettingsObject);
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

	function setDownloadLinks(data) {
		let publicDataJson = {};
		for (let sheetName of dataSheetNames) {
			publicDataJson[sheetName] = data[sheetName];
		}

		console.log(publicDataJson);

		var fields = Object.keys(publicDataJson.state_data[0]);

		console.log(publicDataJson.state_data);
		console.log(fields);

		try {
			var result = json2csv({ data: publicDataJson.state_data, fields: fields });
			console.log(result);
			var csvDataUrlString = "data:text/csv;charset=utf-8," +escape(result);

			$("#in-depth__download__csv").attr("href", csvDataUrlString);
		} catch (err) {
			// Errors are thrown for bad options, or if the data is empty and no fields are provided.
			// Be sure to provide fields if it is possible that your data array will be empty.
			console.error(err);
		}

		var jsonDataUrlString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(publicDataJson));

		$("#in-depth__download__json").attr("href", jsonDataUrlString);
	}

	function render() {
		console.log(vizList);
		d3.json(projectSettings.dataUrl, (d) => {
			console.log(d);
			for (let viz of vizList) {
				let data = d[viz.primaryDataSheet];
				console.log(viz);
				viz.render(data);
			}
			setDownloadLinks(d);
		});

	}

	function resize() {
		for (let viz of vizList) {
			viz.resize ? viz.resize() : null;
		}
	}
}
