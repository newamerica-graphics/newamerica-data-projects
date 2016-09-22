import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";
import { Legend } from "../components/legend.js";


import { formatValue } from "../helper_functions/format_value.js";


let legendWidth = 250;
let margin = {top: 0, right: legendWidth + 40, bottom: 0, left: 0};

export class PieChart {
	constructor(vizSettings, imageFolderId) {
		let {id, primaryDataSheet, dataVars, labelVars, legendShowVals} = vizSettings;

		this.id = id;
		
		this.primaryDataSheet = primaryDataSheet;
		this.currLabelVar = labelVars[0];
		this.currDataVar = dataVars[0];
		this.legendShowVals = legendShowVals;

		this.svg = d3.select(id).append("svg").attr("class", "pie-chart");
		this.renderingArea = this.svg.append("g");

		this.arc = d3.arc();
		
		this.setDimensions();

		let legendSettings = {};
		legendSettings.id = id;
		legendSettings.showTitle = true;
		legendSettings.markerSettings = { shape:"circle", size:10 };
		legendSettings.orientation = "vertical-right-center";

		this.legend = new Legend(legendSettings);
		
	}

	render(data) {
		this.data = data;
		this.setColorScale();
		this.setLegend();

		var pie = d3.pie()
		    .value((d) => { return d[this.currDataVar.variable]; });

		var g = this.renderingArea.selectAll(".arc")
		      .data(pie(data))
		    .enter().append("g")
		      .attr("class", "arc");

		this.paths = g.append("path")
		      .attr("d", this.arc)
		      .style("fill", (d) => { return this.colorScale(d.data[this.currLabelVar.variable]); });

		// g.append("text")
		//       .attr("transform", (d) => { return "translate(" + this.arc.centroid(d) + ")"; })
		//       .attr("dy", ".35em")
		//       .text((d) => { return d.data[this.currLabelVar.variable]; });
	}

	setDimensions() {
		this.w = $(this.id).width() - margin.left - margin.right;
		this.h = this.w;
		let radius = this.w / 2;

		let innerRadius = 0;
		if (radius - 70 > 0) {
		    innerRadius = radius - 70
		}

		this.arc.outerRadius(radius - 10)
			.innerRadius(innerRadius);

		

		this.svg
			.attr("width", "100%")
		    .attr("height", this.h);

		this.renderingArea
		    .attr("transform", "translate(" + this.w / 2 + "," + this.h / 2 + ")");
	}

	setColorScale() {
		this.colorScale = getColorScale(this.data, this.currLabelVar);
	}

	setLegend() {
		let legendSettings = {};

		let valCounts = new Map();
		for (let d of this.data) {
			let value = formatValue(d[this.currDataVar.variable], this.currDataVar.format)
			valCounts.set(d[this.currLabelVar.variable], value);
		}

		legendSettings.title = this.currLabelVar.displayName;
		legendSettings.format = this.currLabelVar.format;
		legendSettings.scaleType = this.currLabelVar.scaleType;
		legendSettings.colorScale = this.colorScale;
		legendSettings.valChangedFunction = this.changeVariableValsShown.bind(this);
		legendSettings.valCounts = valCounts;

		this.legend.render(legendSettings);
	}

	changeVariableValsShown(valsShown) {

		this.paths
			.style("fill", (d) => {
		   		var value = d.data[this.currLabelVar.variable];
		   			let binIndex = this.colorScale.domain().indexOf(value);
		   			if (valsShown.indexOf(binIndex) > -1) {
		   				return this.colorScale(value);
		   			}
		   		return colors.grey.light;
		    });
	}

	resize() {
		this.setDimensions();

		this.paths.attr("d", this.arc);
	}

}