require('./../scss/index.scss');
var json2csv = require('json2csv');
var JSZip = require("jszip");

import $ from 'jquery';
let d3 = require("d3");

import domtoimage from 'dom-to-image';
import React from 'react';
import { render } from 'react-dom';

import { formatValue } from "./helper_functions/format_value.js";

import { whichChart, defaultClickToProfile, setCSVZipLink, setJSONZipLink, setProfileValues } from "./utilities.js";

import DefinitionExplorer from "./react_chart_types/definition_explorer/DefinitionExplorer.js";
import CalloutBox from "./react_chart_types/callout_box/CalloutBox.js";
import DotChart from "./react_chart_types/dot_chart/DotChart.js";
import CustomHomegrownMap from "./react_chart_types/custom_homegrown_map/CustomHomegrownMap.js";
import QuoteScroller from "./react_chart_types/quote_scroller/QuoteScroller.js";


export default class VizController {
	constructor(vizSettings, preProcessData) {
		this.vizSettings = vizSettings;

		this.renderQueue = [];
		this.vizList = [];
		this.clickToProfileFunction = defaultClickToProfile;
		this.deferredSetDataDownload = null;
		this.preProcessData = preProcessData
	}

	initialize({dataUrl, clickToProfileFunction, downloadableDataSheets}) {
		this.sendDataRequest(dataUrl, downloadableDataSheets)
		if (clickToProfileFunction) {
			this.overrideClickToProfileFunction(clickToProfileFunction)
		}
	}

	sendDataRequest(dataUrl, downloadableDataSheets) {
		if (!dataUrl) { return; }
		d3.json(dataUrl, (data) => {
			if (!data) { return; }
			this.data = this.preProcessData ? this.preProcessData(data) : data
	    	if (this.renderQueue && this.renderQueue.length > 0) {
	    		for (let renderFunc of this.renderQueue) {
	    			renderFunc(this.data);
	    		}
	    	}

	    	// the following function, which currently sets the values for the in depth profile pages based on the results from the data request, will be unneccessary after the refresh
	    	setProfileValues(this.data);

	    	if (this.deferredSetDataDownload) { this.deferredSetDataDownload() }
	    });
	}

	render(dataVizId) {
		let settingsObject = this.vizSettings[dataVizId]

		if (settingsObject.isReact) {
			if (this.data) {
				this.renderReactChart(dataVizId, settingsObject)

				// after refresh, this functionality can be handled from front-end page template, instead of here
				this.hideLoadingGif(dataVizId);
			} else {
				this.renderQueue.push((data) => { this.hideLoadingGif(dataVizId); return this.renderReactChart(dataVizId, settingsObject, data); })
			}
		} else {
			let chart = this.initializeChart(dataVizId, settingsObject)

			if (!chart) { return; }

			this.vizList.push(chart)

			if (this.data || settingsObject.vizType === "financial_opportunity_map") {
				chart.render(this.data)
				// after refresh, this functionality can be handled from front-end page template, instead of here
				this.hideLoadingGif(dataVizId);
			} else {
				this.renderQueue.push((data) => { this.hideLoadingGif(dataVizId); return chart.render(data); })
			}
		}
	}

	reset() {
		this.vizList = []
	}

	resize() {
		this.vizList.forEach((viz) => {
			viz.resize ? viz.resize() : null;
		})
	}

	initializeChart(dataVizId, settingsObject) {
		if (!settingsObject) { return null; }
		if ($("#" + dataVizId).length < 1) { return; }

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

			case "custom_homegrown_map":
				render(
					<CustomHomegrownMap vizSettings={settingsObject} data={data} id={dataVizId} />,
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
					<DotChart vizSettings={settingsObject} data={data} id={dataVizId} />,
					document.getElementById(dataVizId)
				)
				break;

			case "quote_scroller":
				render(
					<QuoteScroller vizSettings={settingsObject} data={data} id={dataVizId} />,
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

	// after refresh, this functionality can be handled from front-end page template, instead of here
	hideLoadingGif(id) {
		let selector = "#" + id
		$(selector).siblings(".dataviz__loading-gif").hide();
		$(selector).css("visibility", "visible").css("min-height","0px");
	}

	setDataDownloadLinks(downloadableDataSheets, customDataDownloadSource) {
		if (customDataDownloadSource) {
			$("#in-depth__download__csv").attr("href", customDataDownloadSource);
		} else {
			if (!this.data) {
				this.deferredSetDataDownload = (downloadableDataSheets, customDataDownloadSource) => this.setDataDownloadLinks(downloadableDataSheets, customDataDownloadSource)
				return;
			}

			let downloadableDataJson = {};
			for (let sheetName of downloadableDataSheets) {
				downloadableDataJson[sheetName] = this.data[sheetName];
			}

			setCSVZipLink(downloadableDataJson);
			setJSONZipLink(downloadableDataJson);
		}
	}
}
