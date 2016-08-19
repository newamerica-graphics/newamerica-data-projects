require('../../../scss/index.scss');

import $ from 'jquery';
import { UsStatesMap } from "../../components/us_states_map.js";
import { FilterGroup } from "../../components/filter_group.js";


let projectVars = {
	id: "#test1",
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/test/ag.json",
	defaultFilterVar: "value",
	filterVars: {
		"value":{"category":"cost", "scaleType":"quantize", "color":"blue", "numBins":5},
		"value1":{"category":"quality", "scaleType":"quantize", "color":"turquoise", "numBins":7},
		"value2":{"category":"cost", "scaleType":"quantize", "color":"red", "numBins":5}
	},
	tooltipVars: {
		"cost": ["value", "value1"]
	}
}

let usMap, filterGroup, table;

function initialize() {
	window.addEventListener('resize', resize);

	filterGroup = new FilterGroup(projectVars.id, projectVars.filterVars, changeFilter);
	usMap = new UsStatesMap(projectVars);
	usMap.initialRender();
	
}

function resize() {
	let w = $(projectVars.id).width();
	usMap.resize(w);
}

function changeFilter() {
	let newFilterVar = $(this).attr("value");
	usMap.changeFilter(newFilterVar);
}

initialize();