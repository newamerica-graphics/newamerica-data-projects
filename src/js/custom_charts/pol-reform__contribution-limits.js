import $ from 'jquery';
let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";
import { formatValue } from "../helper_functions/format_value.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";
import { Tooltip } from "../components/tooltip.js";

const sources = [
	{"label": "Individual", "value": "indiv"},
	{"label": "Party", "value": "party"},
	{"label": "PAC", "value": "PAC"},
	{"label": "Union", "value": "union"},
	{"label": "Corporate", "value": "corporate"},
];
const recipients = [
	{"label": "Senate", "value": "senate"},
	{"label": "House", "value": "house"},
	{"label": "Attorney General", "value": "attgeneral"},
	{"label": "Secretary of State", "value": "secstate"},
	{"label": "Governor", "value": "gub"},
	{"label": "Statewide", "value": "statewide"},
	// {"label": "Municipal", "value": "municipal"},
]

const catContainerHeight = 60,
	textWidth = 125,
	circleRadius = 4,
	prohibUnlimitedWidth = 100,
	numValueColumns = 5,
	binVals = Array.apply(null, {length: numValueColumns}).map(Number.call, Number);


export class PolReformContributionLimits {
	constructor(vizSettings, imageFolderId) {
		Object.assign(this, vizSettings);

		console.log("building contribution limits graph");
		this.currRecipient = 0;
		this.currRecipientValue = recipients[0].value;

		this.binScale = d3.scaleQuantize()
			.range(binVals);
	
		this.appendControls();

		this.appendChartContainers();

		this.setDimensions();
	
	}

	setDimensions() {
		this.w = $(this.id).width() - textWidth;

		this.binWidth = this.w/(numValueColumns + 2);

		this.categoryDataContainers.attr("width", this.w);

		// this.h = sources.length * catContainerHeight;
		
		// this.dotsPerCol = Math.ceil(this.dataLength/numCols);

		// this.h = this.dotsPerCol * (this.dotSettings.width + this.dotSettings.offset);		
		// this.svg
		// 	.attr("height", this.h);


		// this.prohibitedContainer
		// 	.attr("transfor", prohibUnlimitedWidth);
		
	}

	appendControls() {
		this.controlContainer = d3.select(this.id)
			.append("div")
			.attr("class", "control-container")

		this.recipientSelect = this.controlContainer.append("select")
			.attr("class", "control-container__select")
			.on("change", () => { 
				let index = this.recipientSelect.property('selectedIndex');
				console.log(this.recipientSelect, index)
				return this.changeRecipient(index); 
			});

		this.recipientSelect.selectAll("option")
			.data(recipients)
			.enter().append("option")
			.attr("class", "control-container__select__option")
			.attr("value", (d) => { return d.value; })
			.text((d) => { return d.label; });

		this.stateSelect = this.controlContainer.append("select")
			.attr("class", "control-container__select")
			.on("change", () => { 
				let index = this.stateSelect.property('selectedIndex');
				return this.changeStateSelected(index); 
			})
	}

	appendChartContainers() {
		this.chartContainer = d3.select(this.id)
			.append("div")
			.attr("class", "chart-container");

		let categoryContainers = this.chartContainer.selectAll("div.category-container")
			.data(sources)
			.enter().append("div")
			.attr("class", "category-container")
			// .attr("transform", (d, i) => { return "translate(0," + (i * catContainerHeight) + ")"; });
	
		categoryContainers.append("h5")
			// .attr("x", 0)
			// .attr("y", catContainerHeight/2)
			.attr("class", "category-title")
			.text((d) => { return d.label; })

		this.categoryDataContainers = categoryContainers.append("div")
			.attr("class", "data-container")
			.append("svg")
			.attr("height", catContainerHeight)
			.attr("class", (d) => { return "category-" + d.value; })
			.on("mouseout", () => { return this.mouseout(); });
	}

	render(data) {
		this.data = data[this.primaryDataSheet];

		console.log(this.data);

		this.stateSelect.append("option")
			.attr("class", "control-container__select__option")
			.attr("value", (d) => { return "all"; })
			.text("All");

		this.stateSelect.selectAll("option.state")
			.data(this.data)
			.enter().append("option")
			.attr("class", "control-container__select__option state")
			.attr("value", (d) => { return d.state_id; })
			.text((d) => { return d.state; });

		this.buildGraph();
	}

	setBinScaleDomain() {
		let globalMax = 0;

		sources.forEach((source) => {
			let localMax = d3.max(this.data, (d) => {
				let value = d[source.value + "_contrib_" + this.currRecipientValue];
				return isNaN(value) ? null : +value;
			});
			globalMax = globalMax > localMax ? globalMax : localMax;
		})

		this.binScale.domain([0, 15000]);
	}

	setValBinLists() {
		this.valBinLists = {};

		sources.forEach((source) => {
			this.valBinLists[source.value] = d3.nest()
				.key((d) => {
					let value = d[source.value + "_contrib_" + this.currRecipientValue];
					if (value == "Prohibited" || value == "Unlimited") { return value; }
					return +this.binScale(+value); 
				})
				.sortKeys((a, b) => { return d3.ascending(+a, +b); })
				.sortValues((a, b) => { return d3.ascending(+a[source.value + "_contrib_" + this.currRecipientValue], +b[source.value + "_contrib_" + this.currRecipientValue]); console.log(a, b); })
				.entries(this.data);
		})
	}

	buildGraph() {
		this.setBinScaleDomain();

		this.setValBinLists();

		this.setTooltip();

		this.dataCircles = this.categoryDataContainers
			.selectAll("g")
			.data((source) => { return this.valBinLists[source.value]; })
		  .enter().append("g")
		  	.attr("transform", (d) => {
		  		let xTranslate = 0; 
		  		if (d.key == "Unlimited") {
		  			xTranslate = this.binWidth * (numValueColumns + 1);
		  		} else if (!isNaN(d.key)) {
		  			xTranslate = this.binWidth * (+d.key + 1);
		  		}
		  		return "translate(" + xTranslate + ")";
		  	})
		  	.attr("class", (d) => { return "bin-" + d.key; })
			.selectAll("circle")
			.data((d) => { return d.values; })
		  .enter().append("circle")
			.attr("cx", (d, i) => { return i%5 * (circleRadius*2 + 1) + circleRadius; })
			.attr("cy", (d, i) => { return catContainerHeight - (Math.floor(i/5) * (circleRadius*2 + 1)) - circleRadius })
			.attr("r", circleRadius)
			.on("mouseover", (d) => { return this.mouseover(d, d3.event); })
	}

	setTooltip() {
		let tooltipVars = [{ "variable": "state", "displayName":"State"}];

		sources.forEach((d) => {
			tooltipVars.push({"variable": d.value + "_contrib_" + this.currRecipientValue, "displayName": d.label, "format": "string"});
		})
		let tooltipSettings = { 
			"id":this.id, 
			"tooltipVars": tooltipVars, 
			"highlightActive": false
		}

		this.tooltip = new Tooltip(tooltipSettings);
	}

	changeRecipient(newIndex) {
		this.currRecipient = +newIndex;
		this.currRecipientValue = recipients[+newIndex].value;

		this.categoryDataContainers.selectAll("g").remove();
		this.changeStateSelected("all");
		this.buildGraph();
	}

	changeStateSelected(newStateId) {
		this.dataCircles
			.style("opacity", (d) => {
				if (newStateId == "all") {
					return 1;
				} else {
					return d.state_id == newStateId ? 1 : .2;
				}
			})
	}

	mouseover(datum, eventObject) {
		let mousePos = [];
		mousePos[0] = eventObject.pageX;
		mousePos[1] = eventObject.pageY;

		this.dataCircles
			.style("opacity", (d) => { return datum.state_id == d.state_id ? 1 : .2; } )

		console.log(datum);
		this.tooltip.show(datum, mousePos);
	}

	mouseout() {
		this.dataCircles.style("opacity", 1);
		this.tooltip.hide();
	}
	
	resize() {
		this.setDimensions();

	}


}