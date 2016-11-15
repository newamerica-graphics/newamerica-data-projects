require('./../scss/index.scss');
var json2csv = require('json2csv');
var JSZip = require("jszip");

import $ from 'jquery';
let d3 = require("d3");

import domtoimage from 'dom-to-image';

import { BarChart } from "./chart_types/bar_chart.js";
import { Dashboard } from "./layouts/dashboard.js";
import { DotMatrix } from "./chart_types/dot_matrix.js";
import { DotHistogram } from "./chart_types/dot_histogram.js";
import { GroupedDotMatrix } from "./chart_types/grouped_dot_matrix.js";
import { UsMap } from "./chart_types/us_map.js";
import { TabbedChartLayout } from "./layouts/tabbed_chart_layout.js";
import { ChartWithFactBox } from "./layouts/chart_with_fact_box.js";
import { Table } from "./chart_types/table.js";
import { FactBox } from "./chart_types/fact_box.js";
import { LineChart } from "./chart_types/line_chart.js";
import { SummaryBox } from "./chart_types/summary_box.js";
import { PieChart } from "./chart_types/pie_chart.js";

import { formatValue } from "./helper_functions/format_value.js";

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
				case "bar_chart":
					viz = new BarChart(vizSettingsObject, imageFolderId);
					break;

				case "chart_with_fact_box":
					viz = new ChartWithFactBox(vizSettingsObject, imageFolderId);
					break;

				case "dashboard":
					viz = new Dashboard(vizSettingsObject);
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

				case "tabbed_chart_layout":
					viz = new TabbedChartLayout(vizSettingsObject);
					break;

				case "table":
					viz = new Table(vizSettingsObject);
					break;

				case "us_counties_map":
					viz = new UsCountiesMap(vizSettingsObject);
					break;

				case "us_map":
					viz = new UsMap(vizSettingsObject);
					break;
			}

			vizList.push(viz);
		}

		
	}



	function render() {
		d3.json(projectSettings.dataUrl, (d) => {
			if ($("body").hasClass("template-indepthprofile")) {
				setProfileValues(d);
			} else {
				for (let viz of vizList) {
					viz.render(d);
				}

				setDataDownloadLinks(d);
			}
		});

		console.log(gapi);

		downloadFile("https://www.googleapis.com/drive/v3/files/1UHVsknlx8sWPNg6nYBg2_WdXTp2RwnWwe7BdInWncdg", (d) => { console.log(d)});

	}

	function downloadFile(file, callback) {
		function start() {
			gapi.client.init({
			    'apiKey': 'AIzaSyDEw5U0UeTsSQ_GA542Auu6bW9Z5_tuB-w',
			    // clientId and scope are optional if auth is not required.
			    'clientId': '748333064756-ocgu5vjjip1iffns3jbikguts7604sn6.apps.googleusercontent.com',
			    'scope':'https://www.googleapis.com/auth/drive.file',
			  }).then(function() {
			    // 3. Initialize and make the API request.
			    return gapi.client.request({
			      'path': 'https://www.googleapis.com/drive/v3/files',
			    })
			  }).then(function(resp) {
			    console.log(resp.result);
			  }, function(reason) {
			    console.log(reason);
			  });

		}
		// 1. Load the JavaScript client library.
		gapi.load('client', start);
	  // if (file) {
	  //   var accessToken = gapi.auth.getToken().access_token;
	  //   var xhr = new XMLHttpRequest();
	  //   xhr.open('GET', file);
	  //   xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
	  //   xhr.onload = function() {
	  //     callback(xhr.responseText);
	  //   };
	  //   xhr.onerror = function() {
	  //     callback(null);
	  //   };
	  //   xhr.send();
	  // } else {
	  //   callback(null);
	  // }
	}

	function resize() {
		for (let viz of vizList) {
			viz.resize ? viz.resize() : null;
		}
	}

	function setDataDownloadLinks(data) {
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

	function setProfileValues(data) {
		projectSettings.imageFolderId ? setProfileHeaderImage(data) : null;
		setProfileDataReferences(data);
	}

	function setProfileHeaderImage(data) {
		let $inDepthProfileImage = $(".in-depth__profile__header-image");
		let dataSheet = $inDepthProfileImage.attr("data-sheet-name");
		let lookupField = $inDepthProfileImage.attr("data-lookup-field");
		let lookupValue = window.location.search.replace("?", "").replace("/", "").replace(/_/g, " ").toLowerCase();
		let imageField =  $inDepthProfileImage.attr("data-image-field");

		if (!lookupField) {
			return;
		}
		let allLookupValues = d3.nest()
			.key((d) => { return d[lookupField].toLowerCase(); })
			.map(data[dataSheet]);

		if (!allLookupValues.get(lookupValue)) {
			$inDepthProfileImage.empty();
		}

		for (let d of data[dataSheet]) {
			if (d[lookupField].toLowerCase() == lookupValue) {
				let imageUrl = d[imageField];
				console.log(imageUrl);
				let imageDiv = $inDepthProfileImage.append("div");
				// imageDiv.css("background", "no-repeat center/100% url('https://docs.google.com/uc?id=0B2KbJlQb9jlgeG5hOXZqbURpRUE')")
				break;
			}
		}
	}

	function setProfileDataReferences(data) {
		let $inDepthProfileBody = $(".in-depth__profile__body");
		let dataSheet = $inDepthProfileBody.attr("data-sheet-name");
		let lookupField = $inDepthProfileBody.attr("data-lookup-field");
		let lookupValue = window.location.search.replace("?", "").replace("/", "").replace(/_/g, " ").toLowerCase();

		if (!lookupField) {
			return;
		}
		let allLookupValues = d3.nest()
			.key((d) => { return d[lookupField].toLowerCase(); })
			.map(data[dataSheet]);

		if (!allLookupValues.get(lookupValue)) {
			$inDepthProfileBody.empty();
		} else {
			document.title = lookupValue;
		}

		let displayField, fieldFormat;

		$(".data-reference__value").each(function(i, item) {
			displayField = $(item).attr("data-field-name");
			fieldFormat = $(item).attr("data-field-format");
			let value;
			for (let d of data[dataSheet]) {
				if (d[lookupField].toLowerCase() == lookupValue) {
					value = formatValue(d[displayField], fieldFormat);
					$(item).text(value);
					break;
				}
			}
		})

		setOtherValueSelectorOptions(allLookupValues.keys())
	}

	function setOtherValueSelectorOptions(otherValuesList) { 
		let $valueSelector = $(".in-depth__profile__other-value-selector");
		for (let item of otherValuesList) {
			let option = $('<option/>')
		        .addClass('in-depth__profile__other-value-selector__option')
		        .text(item)
		        .attr("value", item.toLowerCase().replace(/ /g, "_"))
		        .appendTo($valueSelector);
		}
	}
}
