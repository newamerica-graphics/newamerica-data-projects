import $ from 'jquery';

let d3 = require("d3");

const nonScrollXPadding = 15;
const scrollXPadding = 2;

import { formatValue } from "../helper_functions/format_value.js";

export class Tooltip {
	constructor(vizSettings) {
		Object.assign(this, vizSettings);
		//removes first variable to be used as title
		this.titleVar = this.tooltipVars[0].variable;
		this.tooltipVars = this.tooltipVars.slice(1);
		this.isHovered = false;

		this.appendTooltip();

		this.setCategoryNest();
		
		this.tooltipCategoryTitles = {};

		// this.valueFields = {};

		
		// let showCategories = categoryNest.length > 1;
		// let whichContainer;

		// for (let category of categoryNest) {
		// 	whichContainer = contentContainer;
		// 	if (category.key != "undefined" && showCategories) {
		// 		this.tooltipCategoryTitles[category.key] = contentContainer.append("h5")
		// 			.classed("tooltip__category__name", true)
		// 			.text(category.key);

		// 		whichContainer = contentContainer.append("ul")
		// 			.classed("tooltip__category__list", true);
		// 	}

		// 	for (let variable of category.values) {
		// 		var listElem = whichContainer.append("li")
		// 			.classed("tooltip__category__list-item", true);

		// 		let valueField = {};
		// 		valueField.label = listElem.append("h3")
		// 			.classed("tooltip__category__list-item__label", true)
		// 			.text(variable.displayName + ":");

		// 		valueField.value = listElem.append("h3")
		// 			.classed("tooltip__category__list-item__value", true)
					
		// 		this.valueFields[variable.variable] = valueField;
		// 	}
		// }
	}

	appendTooltip() {
		let tooltipClass = "tooltip hidden";
		tooltipClass += this.tooltipScrollable ? " scrollable" : "";
		this.xPadding = this.tooltipScrollable ? scrollXPadding : nonScrollXPadding;

		this.tooltip = d3.select("body")
			.append("div")
			.attr("class", tooltipClass)
			.on("mouseleave", this.mouseleave.bind(this));

		if (this.tooltipScrollable) {
			this.tooltip
				.append("div")
				.attr("class", "tooltip__fadeout__top");
			this.tooltip
				.append("div")
				.attr("class", "tooltip__fadeout__bottom");
		}

		this.contentContainer = this.tooltip
			.append("div")
			.attr("class", "tooltip__content-container");

		let titleContainer = this.contentContainer
			.append("div")
			.attr("class", "tooltip__title-container")
			.classed("no-content", this.tooltipVars.length < 1);
			
		if (this.tooltipImageVar) {
			this.imageContainer = titleContainer
				.append("div")
				.attr("class", "person__icon");

			this.image = this.imageContainer
				.append("div")
				.attr("class", "person__icon__photo");
		}

		this.titleDiv = titleContainer
			.append("h1")
			.classed("tooltip__title", true);
	}

	setCategoryNest() {
		let categoryNest = d3.nest()
			.key((d) => { return d.category; })
			.entries(this.tooltipVars);

		console.log(categoryNest);

		this.categoryContainers = this.contentContainer.selectAll("g.tooltip__category")
			.data(categoryNest)
			.enter().append("g")
			.attr("class", "tooltip__category");

		this.categoryContainers.append("h5")
			.attr("class", "tooltip__category__name")
			.text((d) => { return d.key; });

		let categoryValList = this.categoryContainers.append("ul")
			.attr("class", "tooltip__category__val-list");

		this.listItems = categoryValList.selectAll("li")
			.data((d) => { return d.values; })
			.enter().append("li")
			.attr("class", "tooltip__category__list-item");

		this.listItems.append("h3")
			.attr("class", "tooltip__category__list-item__label")
			.text((d) => { return d.displayName + ":" })

		this.listItems.append("h3")
			.attr("class", "tooltip__category__list-item__value")
	}

	show(datum, mouse, currFilterVar, filterColor) {
		if ($(window).width() < 450) {
			return;
		}
        // if (this.tooltipImageVar) {
        // 	if (d[this.tooltipImageVar.variable]) {
        // 		this.titleDiv
        // 			.classed("has-image", true)
        // 		this.imageContainer
        // 			.style("display", "table-cell");
        // 		this.image
        // 			.style("background", "no-repeat center/100% url(https://googledrive.com/host/" + this.imageFolderId + "/" + d[this.tooltipImageVar.variable] + ")");
        // 	} else {
        // 		this.imageContainer.style("display", "none");
        // 		this.titleDiv
        // 			.classed("has-image", false)
        // 	}
        // }

        console.log(datum);
		this.titleDiv.text(datum[this.titleVar]);

		if (this.showOnlyVars == "same category") {
			this.categoryContainers
				.style("display", (d) => { console.log(d); return currFilterVar.category == d.key ? "block" : "none"; })
		}

		this.listItems
			.style("display", (d) => { return datum[d.variable] ? "block" : "none"; })
			.classed("active", (d) => { console.log(d.variable); return d.variable == currFilterVar.variable; })
			.style("border-color", filterColor);

		this.listItems.selectAll("h3.tooltip__category__list-item__value")
			.text((d) => { console.log(d); return formatValue(datum[d.variable], d.format); })


		let tooltipCoords = this.getTooltipCoords(mouse);
		this.tooltip
			.classed('hidden', false)
            .attr('style', 'left:' + (tooltipCoords[0]) + 'px; top:' + (tooltipCoords[1]) + 'px');

        this.isHovered = true;
	}

	hide() {
		this.isHovered = this.tooltipScrollable ? $(this.tooltip._groups[0][0]).is(":hover") : false;
		this.isHovered ? null : this.tooltip.classed('hidden', true);
	}

	getTooltipCoords(mouse) {
		let retCoords = mouse;
		let windowWidth = $(window).width();
		let tooltipHeight = $(this.tooltip._groups[0]).height();
		let tooltipWidth = $(this.tooltip._groups[0]).width();

		if (mouse[0] > (windowWidth - tooltipWidth - this.xPadding)) {
			retCoords[0] = mouse[0] - tooltipWidth - 50;
			retCoords[0] -= this.xPadding;
		} else {
			retCoords[0] += this.xPadding;
		}

		retCoords[1] -= (tooltipHeight/2 + 15);

		return retCoords;
	}

	mouseleave() {
		this.isHovered = false;
		this.hide();
	}

}