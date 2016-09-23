require('./../scss/index.scss');
var json2csv = require('json2csv');
var JSZip = require("jszip");

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



	function render() {
		d3.json(projectSettings.dataUrl, (d) => {
			for (let viz of vizList) {
				let data = d[viz.primaryDataSheet];
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

	function setDownloadLinks(data) {
		let publicDataJson = {};
		for (let sheetName of dataSheetNames) {
			publicDataJson[sheetName] = data[sheetName];
		}

		setCSVZipLink(publicDataJson);
		setJSONZipLink(publicDataJson);
	}

	function setCSVZipLink(dataJson) {
		var zip = new JSZip();

		for (let sheetName of dataSheetNames) {
			let fields = Object.keys(dataJson[sheetName][0]);

			let csvString = json2csv({ data: dataJson[sheetName], fields: fields });
			zip.file(sheetName + ".csv", csvString);
		}

		zip.generateAsync({type:"base64"}).then(function (base64) {
		    $("#in-depth__download__csv").attr("href", "data:application/zip;base64," + base64);
		});
	}

	function setJSONZipLink(dataJson) {
		var jsonDataUrlString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataJson));

		$("#in-depth__download__json").attr("href", jsonDataUrlString);
	}
}
