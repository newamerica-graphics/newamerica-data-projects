require('../../../scss/index.scss');

import $ from 'jquery';
import { UsStatesMap } from "../../components/us_states_map.js";

let projectVars = {
	id: "#test1",
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/test/ag.json",
	colorVar: "value",
	tooltipVariables: ["value"]
}

let usMap;

function initialize() {
	window.addEventListener('resize', resize);

	usMap = new UsStatesMap(projectVars.id, projectVars.dataUrl, projectVars.colorVar, projectVars.tooltipVariables);
	usMap.initialRender();
}

function resize() {
	let w = $(projectVars.id).width();
	usMap.resize(w);
	usMap.changeFilter("value1");
}

initialize();