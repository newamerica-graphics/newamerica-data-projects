import $ from 'jquery';

let d3 = require("d3");

import { DotMatrix } from "../chart_types/dot_matrix.js";
import { SelectBox } from "../components/select_box.js";

export class FilterableDotMatrix {
	constructor(vizSettings) {
		Object.assign(this, vizSettings);
		console.log("in filterable dot matrix");
		this.getFilterValList();

		let selectBoxSettings = {
			id: vizSettings.id,
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
		this.renderDotMatrix();
	}

	renderDotMatrix() {
		this.chart ? this.chart.removeChart() : null;
		let settingsObject = {};
		Object.assign(settingsObject, this);
		settingsObject.primaryDataSheet = this.filterVars[this.currTopic].dataSheet;
		settingsObject.filterVars = [this.filterVars[this.currTopic]];
		this.chart = new DotMatrix(settingsObject);
		this.chart.render(this.data);
	}

	resize() {
		this.chart.resize();
	}

	changeTopic(index) {
		console.log("changing topic");
		
		console.log(index);
		this.currTopic = index;
		this.renderDotMatrix();

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