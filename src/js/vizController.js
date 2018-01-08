require('./../scss/index.scss');
var json2csv = require('json2csv');
var JSZip = require("jszip");

import $ from 'jquery';
let d3 = require("d3");

import domtoimage from 'dom-to-image';
import React from 'react';
import { render } from 'react-dom';

import { formatValue } from "./helper_functions/format_value.js";

import { whichChart, defaultClickToProfile } from "./utilities.js";

import DefinitionExplorer from "./react_chart_types/definition_explorer/DefinitionExplorer.js";
import CalloutBox from "./react_chart_types/callout_box/CalloutBox.js";
import DotChart from "./react_chart_types/dot_chart/DotChart.js";



export default class VizController {
	constructor(vizSettings) {
		this.vizSettings = vizSettings;

		this.renderQueue = [];
		this.vizList = [];
		this.clickToProfileFunction = defaultClickToProfile
	}

	initialize({dataUrl, clickToProfileFunction}) {
		this.sendDataRequest(dataUrl)
		if (clickToProfileFunction) {
			this.overrideClickToProfileFunction(clickToProfileFunction)
		}
	}

	sendDataRequest(dataUrl) {
		console.log(dataUrl)
		d3.json(dataUrl, (data) => {
			console.log("data received")
			console.log(data);
			if (!data) { return; }
	    	if (this.renderQueue.length > 0) { 
	    		for (let renderFunc of this.renderQueue) {
	    			console.log("rendering from queue")
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
		let settingsObject = this.vizSettings[dataVizId]
		if (settingsObject.isReact) {
			if (this.data) {
				this.renderReactChart(dataVizId, settingsObject)
			} else {
				this.renderQueue.push((data) => { return this.renderReactChart(dataVizId, settingsObject, data); })
			}
		} else {
			let chart = this.initializeChart(dataVizId, settingsObject)
			if (!chart) { return; }

			this.vizList.push(chart)
			
			if (this.data) {
				chart.render(this.data) 
			} else {
				this.renderQueue.push((data) => { return chart.render(data); })
			}
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

	initializeChart(dataVizId, settingsObject) {
		if (!settingsObject) { return null; }

		settingsObject.id = "#" + dataVizId
		settingsObject.clickToProfileFunction = this.clickToProfileFunction
		return new whichChart[settingsObject.vizType](settingsObject)
	}

	renderReactChart(dataVizId, settingsObject, data) {
		if ($("#" + dataVizId).length < 1) { return; }

		settingsObject.clickToProfileFunction = this.clickToProfileFunction

		switch (settingsObject.vizType) {
			case "callout_box":
				render(
					<CalloutBox vizSettings={settingsObject} data={data} />,
					document.getElementById(dataVizId)
				)
				break;
			case "definition_explorer":
				render(
					<DefinitionExplorer vizSettings={settingsObject} data={data} />,
					document.getElementById(dataVizId)
				)
				break;

			case "dot_chart":
				render(
					<DotChart vizSettings={settingsObject} data={data} />,
					document.getElementById(dataVizId)
				)
				break;
		}
	}

	overrideClickToProfileFunction(clickToProfileFunction) {
		this.clickToProfileFunction = clickToProfileFunction
	}

	getData() {
		return this.data;
	}
}

// 	function hideLoadingGif(id) {
// 		console.log("hiding loading gif");
// 		console.log(id);
// 		$(id).siblings(".dataviz__loading-gif").hide();
// 		$(id).css("visibility", "visible").css("min-height","none");
// 	}

// function setDataDownloadLinks(data, projectSettings) {
// 	if (projectSettings.customDataDownloadSource) {
// 		$("#in-depth__download__csv").attr("href", projectSettings.customDataDownloadSource);
// 	} else {
// 		let publicDataJson = {};
// 		for (let sheetName of dataSheetNames) {	
// 			publicDataJson[sheetName] = data[sheetName];
// 		}

// 		setCSVZipLink(publicDataJson);
// 		setJSONZipLink(publicDataJson);
// 	}
// }

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
