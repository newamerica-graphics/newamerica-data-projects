import $ from 'jquery';

let d3 = require("d3");

import { GroupedDotMatrix } from "./grouped_dot_matrix.js";

export class DotHistogram extends GroupedDotMatrix {
	constructor(vizSettings) {
		vizSettings.dotsPerRow = 1;
		vizSettings.distanceBetweenGroups = 0;
		
		super(vizSettings);
	}

	render(data) {
		super.render(data);
	}

	resize() {
		super.resize();
	}
}