import $ from 'jquery';

let d3 = require("d3");

import { colors } from "../helper_functions/colors.js";
import { getColorScale } from "../helper_functions/get_color_scale.js";

const topNavHeight = 70;

export class VerticalTimeline {
	constructor(vizSettings) {
		Object.assign(this, vizSettings);

		this.container = d3.select(this.id)
			.append("div")
			.attr("class", "vertical-timeline");

		this.xScale = d3.scaleBand();
		this.currScrollTop = 0;
		this.headerExpanded = true;

		this.windowHeight = $(window).height();

		$(window).scroll(() => { 
			let newScrollTop = $(window).scrollTop();
			let direction;
			if (newScrollTop > this.currScrollTop) {
				direction = "down";
			} else if (newScrollTop < this.currScrollTop) { 
				direction = "up";
			} else {
				return;
			}
			this.scrollListener(direction); 
			this.currScrollTop = newScrollTop;
		});
	}

	render(data) {
		this.data = data[this.primaryDataSheet];

		this.dataNest = d3.nest()
			.key((d) => { return d[this.timeVar.variable]; })
			.sortKeys((a, b) => { console.log(a); return d3.ascending(+a, +b); })
			.key((d) => { console.log(d); return d[this.categoryVar.variable]; })
			.entries(this.data);

		this.categories = d3.map(this.data, (d) => { return d[this.categoryVar.variable];}).keys();
		this.setDimensions();

		this.colorScale = getColorScale(this.data, this.categoryVar);
		this.xScale.domain(this.categories);

		this.appendCategoryTitles();
		this.appendItems();
	}

	setDimensions() {
		this.w = $(this.id).width();

		this.xScale.range([0, this.w]);
	}

	appendCategoryTitles() {
		this.titleContainer = this.container.append("div")
			.attr("class", "vertical-timeline__title");

		this.titleImageRow = this.titleContainer.append("div")
			.attr("class", "vertical-timeline__title__image-row");

		this.titleTextRow = this.titleContainer.append("div")
			.attr("class", "vertical-timeline__title__text-row");

		this.titleImages = this.titleImageRow.selectAll(".vertical-timeline__title__image")
			.data(this.categories)
			.enter().append("div")
			.style("width", this.xScale.bandwidth() + "px")
			.style("height", this.xScale.bandwidth() > 150 ? 150 + "px" : this.xScale.bandwidth() + "px")
			.attr("class", "vertical-timeline__title__image")
			.style("background-image", (d, i) => { return "url(" + this.categoryImageUrl + this.categoryVar.categoryImagePaths[i] + ")"; });


		this.titleText = this.titleTextRow.selectAll(".vertical-timeline__title__text")
			.data(this.categories)
			.enter().append("div")
			.style("width", this.xScale.bandwidth() + "px")
			.attr("class", "vertical-timeline__title__text")
			.style("color", (d) => { return this.colorScale(d); })
			.text((d) => { return d;});
	}

	

	appendItems() {
		this.timelineRowContainer = this.container.append("div")
			.attr("class", "vertical-timeline__row-container")

		this.timelineRows = this.timelineRowContainer.selectAll(".vertical-timeline__row")
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
			.style("width", this.xScale.bandwidth() + "px");

		this.timelineItemGroups.append("h5")
			.attr("class", "vertical-timeline__time")
			.style("color", (d) => { return this.colorScale(d.key); })
			.text((d) => { return d.values[0][this.timeVar.variable] + this.timeSuffix; });

		this.timelineItems = this.timelineItemGroups.selectAll(".vertical-timeline__item")
			.data(d => d.values)
			.enter().append("div")
			.attr("class", "vertical-timeline__item")

		this.descriptionText = this.timelineItems.append("p")
			.attr("class", "vertical-timeline__description")
			.text((d) => { return d[this.descriptionVar.variable]; })

		this.spacingDot = this.timelineItems.append("div")
			.attr("class", "vertical-timeline__spacing-dot")
			.style("background-color", (d) => { return this.colorScale(d.category); });
			
		this.appendLines();

	}

	appendLines() {
		this.timelineLines = this.timelineRowContainer.selectAll(".vertical-timeline__line")
			.data(this.categories)
			.enter().append("div")
			.attr("class", "vertical-timeline__line")
			.style("left", (d) => { return (this.xScale(d) + this.xScale.bandwidth()/2) + "px"; })
	}

	resize() {
		this.setDimensions();

		this.timelineLines
			.style("left", (d) => { return (this.xScale(d) + this.xScale.bandwidth()/2) + "px"; })

		this.titleImages
			.style("width", this.xScale.bandwidth() + "px");

		this.titleText
			.style("width", this.xScale.bandwidth() + "px");

		this.timelineItemGroups
			.style("left", (d, i) => {
				let shiftFactor = this.categories.indexOf(d.key) - i;
				return shiftFactor*this.xScale.bandwidth() + "px"; 
			})
			.style("width", this.xScale.bandwidth() + "px");
	}

	scrollListener(direction) {
		let maxTitleImageHeight = this.xScale.bandwidth() > 150 ? 150 : this.xScale.bandwidth();
		
		let titleImageClient = this.titleImageRow.node().getBoundingClientRect(),
			titleTextClient = this.titleTextRow.node().getBoundingClientRect(),
			dataRowContainerClient = this.timelineRowContainer.node().getBoundingClientRect();

		if (this.headerExpanded) {
			if (titleImageClient.top < topNavHeight) {
				console.log("top is less!")
				this.titleImages
					.style("background-position", "50% " + (maxTitleImageHeight - (titleImageClient.bottom - topNavHeight)) + "px")
					.style("background-size", (titleImageClient.bottom - topNavHeight) + "px");
			}
			if (titleTextClient.top <= topNavHeight) {
				this.titleTextRow
					.style("position", "fixed");

				this.headerExpanded = false;
			}
		} else {
			if (dataRowContainerClient.top > topNavHeight) {
				this.titleTextRow
					.style("position", "initial");

				this.headerExpanded = true;

			}
		}

		this.descriptionText
			.transition()
			.duration(100)
			.style("opacity", (d, index, paths) => {
				if (direction == "down") {
					let distanceFromBottom = this.windowHeight - paths[index].getBoundingClientRect().top;
					return distanceFromBottom > 50 ? 1 : 0;
				} else {
					let distanceFromBottom = this.windowHeight - paths[index].getBoundingClientRect().bottom;
					return distanceFromBottom > 50 ? 1 : 0;
				}
			});

		this.spacingDot
			.transition()
			.duration(100)
			.style("opacity", (d, index, paths) => {
				if (direction == "down") {
					let distanceFromBottom = this.windowHeight - paths[index].getBoundingClientRect().top;
					return distanceFromBottom > 50 ? 1 : 0;
				} else {
					let distanceFromBottom = this.windowHeight - paths[index].getBoundingClientRect().bottom;
					return distanceFromBottom > 50 ? 1 : 0;
				}
			});

		// this.timelineItemGroups
		// 	.transition()
		// 	.duration(100)
		// 	.style("opacity", (d, index, paths) => {
		// 		if (direction == "down") {
		// 			let distanceFromBottom = this.windowHeight - paths[index].getBoundingClientRect().top;
		// 			return distanceFromBottom > 50 ? 1 : 0;
		// 		} else {
		// 			let distanceFromBottom = this.windowHeight - paths[index].getBoundingClientRect().bottom;
		// 			return distanceFromBottom > 50 ? 1 : 0;
		// 		}
		// 	});

	}
}
