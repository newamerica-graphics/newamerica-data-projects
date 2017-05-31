import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";

export class VerticalTimeline {
	constructor(vizSettings) {
		Object.assign(this, vizSettings);

		this.container = d3.select(this.id)
			.append("div")
			.attr("class", "vertical-timeline");

		this.xScale = d3.scaleBand();
	}

	render(data) {
		console.log(data);
		this.data = data[this.primaryDataSheet];
		console.log(this.data);
		this.categories = d3.map(this.data, (d) => { console.log(d); return d[this.categoryVar.variable];}).keys();
		this.setDimensions();
		this.xScale.domain(this.categories);
		console.log(this.categories);

		this.appendLines();
		this.appendItems();
	}

	setDimensions() {
		this.w = $(this.id).width();

		this.xScale.range([0, this.w]);

		console.log(this.w);
		console.log(this.xScale.domain(), this.xScale.range());

	}

	appendLines() {
		this.timelineLines = this.container.selectAll(".vertical-timeline__line")
			.data(this.categories)
			.enter().append("div")
			.attr("class", "vertical-timeline__line")
			.style("left", (d) => { console.log(d); return (this.xScale(d) + this.xScale.bandwidth()/2) + "px"; })
	}

	appendItems() {
		this.timelineItems = this.container.selectAll("div")
			.data(this.data)
			.enter().append("div")
			.attr("class", "vertical-timeline__item")
			.style("left", (d) => { console.log(d); return this.xScale(d[this.categoryVar.variable]) + "px"; })
			.style("max-width", this.w/this.categories.length + "px");

		this.timelineItems.append("h5")
			.attr("class", "vertical-timeline__time")
			.text((d) => { return d[this.timeVar.variable]; });

		this.timelineItems.append("h5")
			.attr("class", "vertical-timeline__description")
			.text((d) => { return d[this.descriptionVar.variable]; });


	}
}
