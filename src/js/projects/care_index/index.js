require('../../../scss/index.scss');

import $ from 'jquery';
let d3 = require("d3");
import { UsStatesMap } from "../../components/us_states_map.js";
import { FilterGroup } from "../../components/filter_group.js";
import { Table } from "../../components/table.js";


let projectVars = {
	id: "#test1",
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/test/ag.json",
	filterVars: [
		{"variable":"value", "displayName":"Value", "category":"Cost", "scaleType":"quantize", "color":"blue", "numBins":11},
		{"variable":"value1", "displayName":"Value1", "category":"Quality", "scaleType":"quantize", "color":"red", "numBins":4},
		{"variable":"value2", "displayName":"Value2", "category":"Cost", "scaleType":"quantize", "color":"red", "numBins":4}
	],
	tooltipVars: {
		"cost": ["value", "value1"]
	},
	tableVars: [
		{"variable":"state", "displayName":"State"},
		{"variable":"value", "displayName":"Value", "scaleType":"quantize", "color":"blue", "numBins":11},
		{"variable":"value1", "displayName":"Value1", "scaleType":"quantize", "color":"red", "numBins":4}
	]
}

let usMap, filterGroup, table;

function initialize() {
	window.addEventListener('resize', resize);

	filterGroup = new FilterGroup(projectVars);
	usMap = new UsStatesMap(projectVars);
	table = new Table(projectVars);
	
	console.log(usMap.data);
	// table = new Table("#test1", this.data);
}

function render() {
	d3.json(projectVars.dataUrl, (d) => {
		filterGroup.render(changeFilter);
		usMap.initialRender(d.Sheet1);
		table.render(d.Sheet1);
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