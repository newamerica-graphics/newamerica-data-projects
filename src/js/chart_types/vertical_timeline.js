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
		this.currScrollTop = 0;
		this.headerExpanded = true;

		this.windowHeight = $(window).height();
		console.log("windowHeight", this.windowHeight);

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
		console.log("bandwidth", this.xScale.bandwidth());
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
			.style("width", this.xScale.bandwidth() + "px")
			.attr("class", "vertical-timeline__category-title")

		this.categoryTitleImageWrapper = this.categoryTitle.append("div")
			.attr("class", "vertical-timeline__category-title__image-wrapper")
			.style("min-height", this.xScale.bandwidth() > 150 ? 150 + "px" : this.xScale.bandwidth() + "px")
			
		this.categoryTitleImage = this.categoryTitleImageWrapper.append("img")
			.attr("class", "vertical-timeline__category-title__image")
			.attr("src", (d, i) => { return this.categoryImageUrl + this.categoryVar.categoryImagePaths[i];});

		this.categoryTitleText = this.categoryTitle.append("div")
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
		this.timelineRowContainer = this.container.append("div")
			.attr("id", "vertical-timeline__row-container")

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

	resize() {
		this.setDimensions();

		this.timelineLines
			.style("left", (d) => { return (this.xScale(d) + this.xScale.bandwidth()/2) + "px"; })

		this.categoryTitle
			.style("width", this.xScale.bandwidth() + "px");

		this.timelineItemGroups
			.style("left", (d, i) => {
				let shiftFactor = this.categories.indexOf(d.key) - i;
				return shiftFactor*this.xScale.bandwidth() + "px"; 
			})
			.style("width", this.xScale.bandwidth() + "px");
	}

	scrollListener(direction) {
		console.log(direction, this.headerExpanded);
		let maxTitleImageHeight = this.xScale.bandwidth() > 150 ? 150 : this.xScale.bandwidth();
		console.log(this.xScale.bandwidth());
		console.log("maximageHeight", maxTitleImageHeight);
		let titleContainer = this.categoryTitleContainer.node().getBoundingClientRect(),
			titleImage = this.categoryTitleImage.node().getBoundingClientRect(),
			titleText = this.categoryTitleText.node().getBoundingClientRect(),
			dataRowContainer = this.timelineRowContainer.node().getBoundingClientRect();

		console.log(titleImage);


		if (this.headerExpanded) {
			if (titleImage.bottom < 0) {
				console.log("bottom less");
				this.categoryTitleImageWrapper //change to image wrapper
					.style("display", "none");

			} else if (titleImage.top < 0 || titleImage.height < maxTitleImageHeight) {
				console.log("top less", titleImage.bottom);
				this.categoryTitleImage
					.style("margin-top", (maxTitleImageHeight - titleImage.bottom) > 0 ? (maxTitleImageHeight - titleImage.bottom) + "px" : "0px")
					.style("height", titleImage.bottom + "px");
			} 

			if (titleText.top < 0) {
				this.headerExpanded = false;
				this.categoryTitleContainer
				 	.style("position", "fixed");
			}
		} else {
			if (dataRowContainer.top > titleText.height) {
				this.categoryTitleContainer
				 	.style("position", "relative");

				this.categoryTitleImageWrapper
					.style("display", "initial");

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
