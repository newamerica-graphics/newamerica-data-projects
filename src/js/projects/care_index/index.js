require('../../../scss/index.scss');

import $ from 'jquery';
let d3 = require("d3");

import { DotMatrix } from "../../chart_types/dot_matrix.js";
import { DotHistogram } from "../../chart_types/dot_histogram.js";
import { GroupedDotMatrix } from "../../chart_types/grouped_dot_matrix.js";
import { UsStatesMap } from "../../chart_types/us_states_map.js";
import { MultiChartLayout } from "../../layouts/multi_chart_layout.js";
import { GroupedBarChart } from "../../chart_types/grouped_bar_chart.js";

let state = {"variable":"state", "displayName":"State"};
let cost_rank = {"variable":"cost_rank", "displayName":"Cost Rank", "format":"number", "category":"Cost", "scaleType":"quantize", "color":"blue", "numBins":4};
let cost_in_home = {"variable":"cost_in_home", "displayName":"Cost in Home", "format":"price", "category":"Cost", "scaleType":"quantize", "color":"blue", "numBins":6};
let cost_in_center = {"variable":"cost_in_center", "displayName":"Cost in Center", "format":"price", "category":"Cost", "scaleType":"quantize", "color":"blue", "numBins":5};
let quality_rank = {"variable":"quality_rank", "displayName":"Quality Rank", "format":"number", "category":"Quality", "scaleType":"quantize", "color":"red", "numBins":4};
let children_5_under = {"variable":"children_5_under", "displayName":"Children 5 & Under", "format":"number", "category":"Cost", "scaleType":"quantize", "color":"blue", "numBins":5};
let field_kids = {"variable":"field_kids", "displayName":"Kids", "format":"string", "scaleType":"categorical", "color":"blue"};
let field_age = {"variable":"field_age", "displayName":"Age", "format":"number", "scaleType":"linear", "color":"blue"};
let field_gender = {"variable":"field_gender", "displayName":"Gender", "format":"number", "scaleType":"categorical", "color":"blue"};
let field_year_indicted = {"variable":"field_year_indicted", "displayName":"Field Indicted", "format":"year", "scaleType":"categorical", "color":"blue"};
let dataSheetNames = ["Sheet1"];

let vizSettingsList = [
	// {
	// 	id: "#explore-the-index", 
	// 	vizType: "chart_table_layout",
	// 	layoutComponents: ["us_states_map", "table"],
	// 	filterVars: [ children_5_under, quality_rank, cost_rank, cost_in_home ],
	// 	tooltipVars: [ children_5_under, cost_rank, cost_in_home ],
	// 	tableVars: [ state, children_5_under, cost_rank, cost_in_home ]
	// },
	{
		id: "#explore-the-index", 
		vizType: "dot_matrix",
		dotsPerRow: 5,
		orientation: "horizontal",
		filterVars: [ field_kids ],
		tooltipVars: [ field_kids, field_age ],
	},
	{
		id: "#test0", 
		vizType: "grouped_dot_matrix",
		dotsPerRow: 5,
		distanceBetweenGroups: 20,
		groupingVars: [ field_year_indicted ],
		filterVars: [ field_kids ],
		tooltipVars: [ field_year_indicted, field_kids, field_age ],
		labelSettings: { interval: 1, showNumVals: true}
	},
	{
		id: "#test1", 
		vizType: "dot_histogram",
		groupingVars: [ field_year_indicted ],
		filterVars: [ field_kids ],
		tooltipVars: [ field_year_indicted, field_kids, field_age ],
		labelSettings: { interval: 5}
	}
	// {
	// 	id: "#test1", 
	// 	vizType: "us_states_map",
	// 	filterVars: [ quality_rank, cost_rank, cost_in_home ],
	// 	tooltipVars: [ children_5_under, cost_rank, cost_in_home ]
	// },
]

let projectVars = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/isp/homegrown.json",
	// vizList = visualizationList
}


let vizList = [];

function initialize() {
	window.addEventListener('resize', resize);

	for (let vizSettingsObject of vizSettingsList) {
		let viz;
		switch (vizSettingsObject.vizType) {
			case "chart_table_layout":
				viz = new MultiChartLayout(vizSettingsObject);
				break;

			case "dot_matrix":
				viz = new DotMatrix(vizSettingsObject);
				break;

			case "dot_histogram":
				viz = new DotHistogram(vizSettingsObject);
				break;
			
			case "grouped_bar_chart":
				viz = new GroupedBarChart(vizSettingsObject);
				
				break;

			case "grouped_dot_matrix":
				viz = new GroupedDotMatrix(vizSettingsObject);
				break;

			case "us_states_map":
				viz = new UsStatesMap(vizSettingsObject);
				
				break;
		}

		vizList.push(viz);
	}
}



function render() {
	d3.json(projectVars.dataUrl, (d) => {
		console.log(d);

		let data = d[dataSheetNames[0]];

		console.log(data);

		for (let viz of vizList) {
			viz.render(data);
		}
	});
}

function resize() {
	for (let viz of vizList) {
		viz.resize ? viz.resize() : null;
	}
}

initialize();
render();