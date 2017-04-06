import $ from 'jquery';

import { globeSVGPath, tableSVGPath } from "./../utilities/icons.js";

let d3 = require("d3");

export class ChartToggle {
	constructor(id) {
		this.id = id;
		this.chartToggle = d3.select(id).append("div")
			.classed("chart-toggle", true);
	}

	render(toggleChangedFunction) {
		this.icons = [];
		this.icons[0] = this.chartToggle.append("svg")
			.classed("chart-toggle__icon active", true)
			.attr("viewBox", "0 0 100 100")
			.on("click", () => { this.toggle(0); toggleChangedFunction();});
			
		this.icons[0].append("g").append("path")
			.attr("d", globeSVGPath);
			
		this.icons[1] = this.chartToggle.append("svg")
			.classed("chart-toggle__icon", true)
			.attr("viewBox", "0 0 100 100")
			.on("click", () => { this.toggle(1); toggleChangedFunction();});
			
		this.icons[1].append("g").append("path")
			.attr("d", tableSVGPath);
	}

	toggle(whichToggled) {
		if (this.icons[whichToggled].classed("active")) { return; };

		if (whichToggled == 0) {
			this.icons[0].classed("active", true);
			this.icons[1].classed("active", false);
		} else {
			this.icons[1].classed("active", true);
			this.icons[0].classed("active", false);
		}
		
		
	}

}