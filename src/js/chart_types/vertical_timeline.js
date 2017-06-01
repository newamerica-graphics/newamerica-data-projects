import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";

export class VerticalTimeline {
	constructor(vizSettings) {
		Object.assign(this, vizSettings);

		this.container = d3.select(this.id)
			.append("div")
			.attr("class", "vertical-timeline");

		this.xScale = d3.scaleBand();

		this.windowHeight = $(window).height();
		console.log("windowHeight", this.windowHeight);

		$(window).scroll(() => { return this.scrollListener(); });
	}

	render(data) {
		console.log(data);
		this.data = data[this.primaryDataSheet];

		this.dataNest = d3.nest()
			.key((d) => { return d[this.timeVar.variable]; })
			.sortKeys((a, b) => { console.log(a); return d3.ascending(+a, +b); })
			.key((d) => { console.log(d); return d[this.categoryVar.variable]; })
			.entries(this.data);

		console.log(this.dataNest);

		console.log(this.data);
		this.categories = d3.map(this.data, (d) => { return d[this.categoryVar.variable];}).keys();
		this.setDimensions();

		this.colorScale = getColorScale(this.data, this.categoryVar);
		this.xScale.domain(this.categories);
		console.log(this.categories);

		this.appendCategoryTitles();
		this.appendLines();
		this.appendItems();
	}

	setDimensions() {
		this.w = $(this.id).width();

		this.xScale.range([0, this.w]);

		console.log(this.w);
		console.log(this.xScale.domain(), this.xScale.range());

	}

	appendCategoryTitles() {
		this.categoryTitleContainer = this.container.append("div")
			.attr("class", "vertical-timeline__category-title-container");

		this.categoryTitle = this.categoryTitleContainer.selectAll(".vertical-timeline__category-title")
			.data(this.categories)
			.enter().append("div")
			.attr("class", "vertical-timeline__category-title")

		this.categoryTitle.append("img")
			.attr("class", "vertical-timeline__category-title__image")
			.style("width", this.w/this.categories.length + "px")
			.attr("src", (d, i) => { return this.categoryImageUrl + this.categoryVar.categoryImagePaths[i];});

		this.categoryTitle.append("div")
			.attr("class", "vertical-timeline__category-title__text")
			.style("color", (d) => { return this.colorScale(d); })
			.text((d) => { return d;});
	}

	appendLines() {
		this.timelineLines = this.container.selectAll(".vertical-timeline__line")
			.data(this.categories)
			.enter().append("div")
			.attr("class", "vertical-timeline__line")
			.style("left", (d) => { console.log(d); return (this.xScale(d) + this.xScale.bandwidth()/2) + "px"; })
	}

	appendItems() {
		this.timelineRows = this.container.selectAll(".vertical-timeline__row")
			.data(this.dataNest)
			.enter().append("div")
			.attr("class", "vertical-timeline__row")
			// .append("div")
			// .attr("class", "vertical-timeline__row__inner-wrapper")

		this.timelineItemGroups = this.timelineRows.selectAll(".vertical-timeline__item-group")
			.data(d => d.values)
			.enter().append("div")
			.attr("class", "vertical-timeline__item-group")
			.style("left", (d, i) => {
				let shiftFactor = this.categories.indexOf(d.key) - i;
				return shiftFactor*this.xScale.bandwidth() + "px"; 
			})
			.style("max-width", this.w/this.categories.length + "px")

		this.timelineItemGroups.append("h5")
			.attr("class", "vertical-timeline__time")
			.style("color", (d) => { return this.colorScale(d.key); })
			.text((d) => { return d.values[0][this.timeVar.variable] + this.timeSuffix; });

		this.timelineItems = this.timelineItemGroups.selectAll(".vertical-timeline__item")
			.data(d => d.values)
			.enter().append("div")
			.attr("class", "vertical-timeline__item")

		this.descriptionText = this.timelineItems.append("h5")
			.attr("class", "vertical-timeline__description")
			.text((d) => { return d[this.descriptionVar.variable]; })
			// .style("font-size", (d, index, paths) => {
			// 	let elemOffset = paths[index].offsetHeight;
			// 	console.log(this.windowHeight);
			// 	console.log(elemOffset);
			// 	return ((this.windowHeight - elemOffset)/10) + "px"; 
			// });
			// .text((d, index, paths) => {
			// 	let elemOffset = paths[index].offsetHeight;
			// 	console.log(paths[index]);
			// 	console.log(paths[index].getBoundingClientRect());
			// 	console.log($(paths[index]));
			// 	return paths[index].getBoundingClientRect().top; 
			// });


	}

	scrollListener() {
		console.log(window);

		this.descriptionText
			.style("font-size", (d, index, paths) => {
				let distanceFromBottom = this.windowHeight - paths[index].getBoundingClientRect().top - 30;
				if (distanceFromBottom > 200) {
					return "20px";
				} else if (distanceFromBottom < 0) {
					return "0px";
				} else {
					return (distanceFromBottom/10) + "px";
				}
			});
	}
}
