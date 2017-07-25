import $ from 'jquery';

let d3 = require("d3");

import { StackedBar } from "../chart_types/stacked_bar.js";
import { DotMatrix } from "../chart_types/dot_matrix.js";
import { SelectBox } from "../components/select_box.js";

export class FilterableChart {
	constructor(vizSettings) {
		Object.assign(this, vizSettings);
		console.log("in filterable chart");
		this.getFilterValList();

		let selectBoxSettings = {
			id: this.id,
			filterChangeFunction: this.changeTopic.bind(this),
			customValList: this.filterValList,
			variable: vizSettings.topicFilterVar,
		};
		
		console.log(selectBoxSettings);
		this.selectBox = new SelectBox(selectBoxSettings);
		this.currTopic = 0;
	}

	render(data) {
		this.data = data;
		this.selectBox.render(this.data);
		this.renderChart();
	}

	renderChart() {
		this.chart ? this.chart.removeChart() : null;

		this.chartSettings.id = this.id;
		this.chartSettings.primaryDataSheet = this.primaryDataSheet ? this.primaryDataSheet : this.filterVars[this.currTopic].dataSheet;
		this.chartSettings.filterVars = [this.filterVars[this.currTopic]];
		this.chart = initializeChart();
		this.chart.render(this.data);
	}

	initializeChart() {
		switch(this.chartType) {
			case "dot_matrix":
				return new DotMatrix(this.chartSettings)

			case "stacked_bar":
				return new StackedBar(this.chartSettings)
		}
	}

	resize() {
		this.chart.resize();
	}

	changeTopic(index) {
		console.log("changing topic");
		
		console.log(index);
		this.currTopic = index;
		this.renderChart();

	}

	getFilterValList() {
		this.filterValList = [];

		this.filterVars.forEach((d) => {
			this.filterValList.push({
				key: d.displayName,
				values: [{id:d.variable}]
			});
		})

	}

}