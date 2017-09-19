require('./../scss/index.scss');
var json2csv = require('json2csv');
var JSZip = require("jszip");

import $ from 'jquery';
let d3 = require("d3");

import domtoimage from 'dom-to-image';
import React from 'react';
import { render } from 'react-dom';

import { formatValue } from "./helper_functions/format_value.js";

import { whichChart } from "./utilities.js";

export const setupProject = (projectSettings) => {
	let vizControl = new VizController(projectSettings);

	vizControl.fetchData();

	window.addEventListener('resize', vizControl.resize);

	vizControl.render("muslim-community-restrictions__states-map")
}

class VizController {
	constructor(projectSettings) {
		Object.assign(this, projectSettings)

		this.renderQueue = [];
		this.vizList = [];
	}

	fetchData() {
		console.log(this.dataUrl)
		d3.json(this.dataUrl, (data) => {
			console.log("data received")
			console.log(data);
			if (!data) { return; }
	    	if (this.renderQueue.length > 0) { 
	    		for (let renderFunc of this.renderQueue) {
	    			renderFunc(data);
	    		}
	    	}
	    	this.data = data;
	    });

	    // $('.dataviz__render-now').each(() => {
	    // 	this.render(this.getAttribute('id'));
	    // });
	}

	render(dataVizId) {
		let chart = this.initializeChart(dataVizId)
		if (!chart) { return; }

		this.vizList.push(chart)
		
		if (this.data) { 
			chart.render(this.data) 
		} else {
			this.renderQueue.push(chart.render)
		}
	}

	reset() {
		this.vizList = []
	}

	resize() {
		this.vizList.forEach((viz) => {
			viz.resize();
		})
	}

	initializeChart(dataVizId) {
		console.log(whichChart)
		let settingsObject = this.vizSettings[dataVizId]
		console.log(settingsObject)
		if (!settingsObject) { return null; }

		settingsObject.id = dataVizId
		return new whichChart[settingsObject.vizType](settingsObject)
	}
}

	

// 	renderCharts();

// 	function initialize() {
// 		for (let vizSettingsObject of vizSettingsList) {
// 			if($(vizSettingsObject.id).length != 0) {
// 				let viz;
// 				switch (vizSettingsObject.vizType) {
// 					case "bar_chart":
// 						viz = new BarChart(vizSettingsObject, imageFolderId);
// 						break;

// 					case "bar_line_combo":
// 						viz = new BarLineCombo(vizSettingsObject);
// 						break;

// 					case "bipartite":
// 						viz = new Bipartite(vizSettingsObject, imageFolderId);
// 						break;

// 					case "category_breakdown":
// 						viz = new CategoryBreakdown(vizSettingsObject, imageFolderId);
// 						break;

// 					case "chart_with_fact_box":
// 						viz = new ChartWithFactBox(vizSettingsObject, imageFolderId);
// 						break;

// 					case "comparative_dot_histogram":
// 						viz = new ComparativeDotHistogram(vizSettingsObject, imageFolderId);
// 						break;

// 					case "dashboard":
// 						viz = new Dashboard(vizSettingsObject);
// 						break;

// 					case "dot_matrix":
// 						viz = new DotMatrix(vizSettingsObject, imageFolderId);
// 						break;

// 					case "dot_histogram":
// 						viz = new DotHistogram(vizSettingsObject, imageFolderId);
// 						break;

// 					case "fact_box":
// 						viz = new FactBox(vizSettingsObject);
// 						break;

// 					case "filterable_chart":
// 						viz = new FilterableChart(vizSettingsObject);
// 						break;

// 					case "financial_opportunity_map":
// 						viz = new FinancialOpportunityMap(vizSettingsObject);
// 						break;
					
// 					case "grouped_dot_matrix":
// 						viz = new GroupedDotMatrix(vizSettingsObject, imageFolderId);
// 						break;

// 					case "line_chart":
// 						viz = new LineChart(vizSettingsObject);
// 						break;

// 					case "mapbox_map":
// 						viz = new MapboxMap(vizSettingsObject);
// 						break;

// 					case "percentage_stacked_bar":
// 						viz = new PercentageStackedBar(vizSettingsObject);
// 						break;

// 					case "pie_chart":
// 						viz = new PieChart(vizSettingsObject);
// 						break;

// 					case "pindrop_map":
// 						viz = new PinDropMap(vizSettingsObject);
// 						break;

// 					case "stacked_bar":
// 						viz = new StackedBar(vizSettingsObject);
// 						break;

// 					case "step_chart":
// 						viz = new StepChart(vizSettingsObject);
// 						break;

// 					case "summary_box":
// 						viz = new SummaryBox(vizSettingsObject);
// 						break;

// 					case "tabbed_chart_layout":
// 						viz = new TabbedChartLayout(vizSettingsObject);
// 						break;

// 					case "table":
// 						viz = new Table(vizSettingsObject);
// 						break;

// 					case "topo_json_map":
// 						viz = new TopoJsonMap(vizSettingsObject);
// 						break;

// 					case "vertical_timeline":
// 						viz = new VerticalTimeline(vizSettingsObject);
// 						break;
// 				}

// 				vizList.push(viz);
// 			} else {
// 				hideLoadingGif(vizSettingsObject.id);
// 			}
// 		}
// 	}

// 	function renderCharts() {
// 		console.log(vizList);
// 		if (!dataUrl) {
// 			for (let viz of vizList) {
// 				viz.render();
// 				hideLoadingGif(viz.id);
// 			}
			
// 			// setDataDownloadLinks(d);
// 			// setProfileValues(d);
// 		} else {
// 			d3.json(dataUrl, (d) => {
// 				console.log(d)
// 				for (let viz of vizList) {
// 					viz.render(d);
					
// 					hideLoadingGif(viz.id);
// 				}

// 				if (reactVizSettingsList) {
// 					for (let vizSettings of reactVizSettingsList) {
// 						if($(vizSettings.id).length != 0) {
// 							renderReact(vizSettings, d);
						
// 							hideLoadingGif(vizSettings.id);
// 						}
// 					}
// 				}

// 				setDataDownloadLinks(d, projectSettings);
				
// 				setProfileValues(d);
// 			});
// 		}
// 		console.log("finished rendering!")
// 	}

// 	function renderReact(vizSettings, data) {

// 		switch (vizSettings.vizType) {
// 			// case "resource_toolkit":
// 			// 	render(
// 			// 		<ResourceToolkit vizSettings={vizSettings} data={data} />,
// 			// 		document.getElementById(vizSettings.id.replace("#", ""))
// 			// 	)
// 			// 	break;
// 			case "callout_box":
// 				render(
// 					<CalloutBox vizSettings={vizSettings} data={data} />,
// 					document.getElementById(vizSettings.id.replace("#", ""))
// 				)
// 				break;
// 			case "definition_explorer":
// 				render(
// 					<DefinitionExplorer vizSettings={vizSettings} data={data} />,
// 					document.getElementById(vizSettings.id.replace("#", ""))
// 				)
// 				break;

// 			case "dot_chart":
// 				render(
// 					<DotChart vizSettings={vizSettings} data={data} />,
// 					document.getElementById(vizSettings.id.replace("#", ""))
// 				)
// 				break;
// 		}
		
// 	}

// 	function resize() {
// 		for (let viz of vizList) {
// 			viz.resize ? viz.resize() : null;
// 		}
// 	}

// 	function hideLoadingGif(id) {
// 		console.log("hiding loading gif");
// 		console.log(id);
// 		$(id).siblings(".dataviz__loading-gif").hide();
// 		$(id).css("visibility", "visible").css("min-height","none");
// 	}

// 	function setCSVZipLink(dataJson) {
// 		var zip = new JSZip();

// 		for (let sheetName of dataSheetNames) {
// 			let fields = Object.keys(dataJson[sheetName][0]);

// 			console.log("LENGTH IS")
// 			console.log(dataJson[sheetName].length)

// 			let csvString = json2csv({ data: dataJson[sheetName], fields: fields });

// 			console.log(csvString.length);

// 			zip.file(sheetName + ".csv", csvString);
// 		}

// 		zip.generateAsync({type:"base64"}).then(function (base64) {
// 		    $("#in-depth__download__csv").attr("href", "data:application/zip;base64," + base64);
// 		});
// 	}

// 	function setJSONZipLink(dataJson) {
// 		var jsonDataUrlString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataJson));
// 		$("#in-depth__download__json").attr("href", jsonDataUrlString);
// 	}

// 	function setProfileValues(data) {
// 		let $inDepthProfile = $(".in-depth__profile");
// 		let dataSheet = $inDepthProfile.attr("data-sheet-name");
// 		let lookupField = $inDepthProfile.attr("data-lookup-field");
// 		let lookupValue = decodeURI(window.location.search).replace("?", "");

// 		if (!lookupField) {
// 			return;
// 		}

// 		let allLookupValues = d3.nest()
// 			.key((d) => { return d[lookupField].toLowerCase(); })
// 			.map(data[dataSheet]);

// 		let currElement = allLookupValues.get(lookupValue);
// 		currElement = currElement ? currElement[0] : null;

// 		if (currElement) {
// 			setOtherValueSelectorOptions(allLookupValues.keys(), true);
// 		} else {
// 			setOtherValueSelectorOptions(allLookupValues.keys(), false);
// 			$(".in-depth__profile__body").empty();
// 			$(".in-depth__profile__title-block").hide();
// 			return;
// 		}

// 		let valueDiv, footnoteLabelDiv, displayField, fieldFormat, footnoteField;
		
// 		$(".in-depth__profile__title-block__title").text(currElement[lookupField])

// 		$(".block-data_reference").each(function(i, container) {
// 			let footnoteCount = 1;
// 			let footnoteContainer = $(container).children(".data-reference__footnote-container");

// 			$(container).find(".data-reference__row").each(function(j, dataRow) {
// 				valueDiv = $(dataRow).children(".data-reference__value");
// 				footnoteLabelDiv = $(dataRow).find(".data-reference__footnote__label");

// 				displayField = $(valueDiv).attr("data-field-name");
// 				fieldFormat = $(valueDiv).attr("data-field-format");
// 				footnoteField = $(footnoteLabelDiv).attr("data-footnote-field-name");

// 				let value = formatValue(currElement[displayField], fieldFormat);

// 				if (value && value.length > 0) {
// 					if (fieldFormat == "markdown") {
// 						$(valueDiv).html(value);
// 					} else {
// 						$(valueDiv).text(value);
// 					}
// 					if (footnoteField && currElement[footnoteField] && currElement[footnoteField] != null) {

// 						$(footnoteLabelDiv).text(footnoteCount);
// 						$(footnoteContainer).append("<li class='data-reference__footnote'>" + footnoteCount + ". " + currElement[footnoteField] + "</li>");
// 						footnoteCount++;
// 					}
// 				} else {
// 					$(dataRow).hide();
// 				}
// 			})
// 		})

// 		$(".video-data-reference").each(function(i, item) {
// 			displayField = $(item).attr("data-field-name");
// 			let hostSite = $(item).attr("data-host");
			
// 			let value = currElement[displayField];

// 			if (value && value.length > 0) {
// 				if (hostSite == "vimeo") {
// 					$(item).append('<iframe width="640" height="360" frameborder="0" src="https://player.vimeo.com/video/' + value + '"></iframe>');
// 				} else {
// 					$(item).append('<iframe width="640" height="360" frameborder="0" src="https://www.youtube.com/embed/' + value + '"></iframe>');				}
// 			} else {
// 				$(item).hide();
// 			}
// 		})
// 	}

// 	function setOtherValueSelectorOptions(otherValuesList, pageHasValue) { 
// 		let $valueSelector = $(".in-depth__profile__other-value-selector");
// 		for (let item of otherValuesList) {
// 			let option = $('<option/>')
// 		        .addClass('in-depth__profile__other-value-selector__option')
// 		        .text(item)
// 		        .attr("value", encodeURI(item))
// 		        .appendTo($valueSelector);
// 		}
// 	}
// }
