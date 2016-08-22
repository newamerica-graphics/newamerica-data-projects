require('../../../scss/index.scss');

import $ from 'jquery';
let d3 = require("d3");

import { ChartToggle } from "../../components/chart_toggle.js";
import { UsStatesMap } from "../../components/us_states_map.js";
import { FilterGroup } from "../../components/filter_group.js";
import { Table } from "../../components/table.js";

let state = {"variable":"state", "displayName":"State"};
let value = {"variable":"value", "displayName":"Value", "category":"Cost", "scaleType":"quantize", "color":"blue", "numBins":11};
let value1 = {"variable":"value1", "displayName":"Value1", "category":"Quality", "scaleType":"quantize", "color":"red", "numBins":4};
let value2 = {"variable":"value2", "displayName":"Value2", "category":"Cost", "scaleType":"quantize", "color":"red", "numBins":4};

let projectVars = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/test/ag.json",
	filterVars: [ value, value1, value2 ],
	tooltipVars: [ value, value1, value2 ],
	tableVars: [ state, value, value1 ]
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
		.attr("id", "table");


	filterGroup = new FilterGroup("#chart", projectVars);

	usMap = new UsStatesMap("#chart", projectVars);
	table = new Table("#table", projectVars);
	
	console.log(usMap.data);
}

function render() {
	d3.json(projectVars.dataUrl, (d) => {
		
		filterGroup.render(changeFilter);
		usMap.initialRender(d.Sheet1);
		table.render(d.Sheet1);


		chartToggle.render(projectCharts, usMap.toggleVisibility, table.toggleVisibility);
	});
}

function resize() {
	let w = $(projectVars.id).width();
	usMap.resize(w);
}

function changeFilter(variable) {
	let newFilterVar = $(variable).attr("value");
	usMap.changeFilter(newFilterVar);
}

initialize();
render();