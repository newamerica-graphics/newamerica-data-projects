require('../../../scss/index.scss');

import $ from 'jquery';
let d3 = require("d3");

import { ChartToggle } from "../../components/chart_toggle.js";
import { UsStatesMap } from "../../components/us_states_map.js";
import { FilterGroup } from "../../components/filter_group.js";
import { Table } from "../../components/table.js";

let state = {"variable":"state", "displayName":"State"};
let cost_rank = {"variable":"cost_rank", "displayName":"Cost Rank", "format":"number", "category":"Cost", "scaleType":"quantize", "color":"blue", "numBins":5};
let cost_in_home = {"variable":"cost_in_home", "displayName":"Cost in Home", "format":"price", "category":"Cost", "scaleType":"quantize", "color":"blue", "numBins":6};
let cost_in_center = {"variable":"cost_in_center", "displayName":"Cost in Center", "format":"price", "category":"Cost", "scaleType":"quantize", "color":"blue", "numBins":5};
let quality_rank = {"variable":"quality_rank", "displayName":"Quality Rank", "format":"number", "category":"Quality", "scaleType":"quantize", "color":"red", "numBins":4};
let children_5_under = {"variable":"children_5_under", "displayName":"Children 5 & Under", "format":"number", "category":"Cost", "scaleType":"quantize", "color":"blue", "numBins":5};

let dataSheetNames = ["state_data", "state_data_variables"];

let projectVars = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/bll/care_index.json",
	filterVars: [ children_5_under, quality_rank, cost_rank, cost_in_home ],
	tooltipVars: [ children_5_under, cost_rank, cost_in_home ],
	tableVars: [ state, children_5_under, cost_rank, cost_in_home ]
}

let projectCharts = [
	{"type":"map"},
	{"id":"#table", "type":"table"}
]

let chartToggle, usMap, filterGroup, table;

function initialize() {
	window.addEventListener('resize', resize);

	chartToggle = new ChartToggle("#test1");

	d3.select("#test1").append("div")
		.attr("id", "chart");
	d3.select("#test1").append("div")
		.attr("id", "table")
		.style("display", "none");


	filterGroup = new FilterGroup("#chart", projectVars);

	usMap = new UsStatesMap("#chart", projectVars);
	table = new Table("#table", projectVars);
}

function render() {
	d3.json(projectVars.dataUrl, (d) => {
		let data = d[dataSheetNames[0]];
		
		filterGroup.render(changeFilter);
		usMap.initialRender(data);
		table.render(data);

		chartToggle.render(projectCharts, usMap.toggleVisibility, table.toggleVisibility);
	});
}

function resize() {
	let w = $("#chart").width();
	usMap.resize(w);
}

function changeFilter(variable) {
	let newFilterVar = $(variable).attr("value");
	usMap.changeFilter(newFilterVar);
}

initialize();
render();