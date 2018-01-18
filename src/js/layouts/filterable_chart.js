import $ from 'jquery';

let d3 = require("d3");

import { StackedBar } from "../chart_types/stacked_bar.js";
import { DotMatrix } from "../chart_types/dot_matrix.js";
import { SelectBox } from "../components/select_box.js";

export class FilterableChart {
	constructor(vizSettings) {
		Object.assign(this, vizSettings);
		this.filterValList = this.customFilterOptions || this.getFilterValList();

		let selectBoxSettings = {
			id: this.id,
			dashboardChangeFunc: this.changeTopic.bind(this),
			customValList: this.filterValList,
			variable: vizSettings.topicFilterVar,
		};
		
		this.selectBox = new SelectBox(selectBoxSettings);
		this.currTopic = 0;
	}

	render(data) {
		this.data = data;
		this.selectBox.render(this.data);
		this.renderChart();
	}

	renderChart() {
		if (this.chart) {
			this.chart.removeChart();
			delete this.chart;
		}
		let chartSettings = {};

		if (this.customFilterOptions) {
			Object.assign(chartSettings, this.chartSettings[this.currTopic])
			chartSettings.id = this.id;
			chartSettings.primaryDataSheet = this.primaryDataSheet || this.filterVars[this.currTopic].dataSheet;
		} else {
			Object.assign(chartSettings, this.chartSettings)
			chartSettings.id = this.id;
			chartSettings.primaryDataSheet = this.primaryDataSheet || this.filterVars[this.currTopic].dataSheet;
			chartSettings.filterVars = [this.filterVars[this.currTopic]];
		}

		this.chart = this.initializeChart(chartSettings);
		this.chart.render(this.data);
	}

	initializeChart(chartSettings) {
		switch(this.chartType) {
			case "dot_matrix":
				return new DotMatrix(chartSettings)

			case "stacked_bar":
				return new StackedBar(chartSettings)
		}
	}

	resize() {
		this.chart.resize();
	}

	changeTopic(index) {
		this.currTopic = index;
		this.renderChart();
	}

	getFilterValList() {
		let filterValList = [];

		this.filterVars.forEach((d) => {
			filterValList.push({
				key: d.displayName,
				values: [{id:d.variable}]
			});
		})

		return filterValList;

	}

}