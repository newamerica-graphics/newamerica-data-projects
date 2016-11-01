import $ from 'jquery';

let d3 = require("d3");

let tooltipWidth = 330;
let nonScrollXPadding = 15;
let scrollXPadding = 2;

import { formatValue } from "../helper_functions/format_value.js";

export class Tooltip {
	constructor(vizSettings) {
		let {id, tooltipVars, tooltipImageVar, imageFolderId, tooltipScrollable} = vizSettings;
		//removes first variable to be used as title
		this.titleVar = tooltipVars.shift().variable;
		this.tooltipVars = tooltipVars;
		this.tooltipImageVar = tooltipImageVar;
		this.imageFolderId = imageFolderId;
		this.tooltipScrollable = tooltipScrollable;

		this.isHovered = false;

		let tooltipClass = "tooltip hidden";
		tooltipClass += tooltipScrollable ? " scrollable" : "";
		this.xPadding = tooltipScrollable ? scrollXPadding : nonScrollXPadding;

		this.tooltip = d3.select("body")
			.append("div")
			.attr("class", tooltipClass)
			.on("mouseleave", this.mouseleave.bind(this));

		if (tooltipScrollable) {
			this.tooltip
				.append("div")
				.attr("class", "tooltip__fadeout__top");
			this.tooltip
				.append("div")
				.attr("class", "tooltip__fadeout__bottom");
		}

		let contentContainer = this.tooltip
			.append("div")
			.attr("class", "tooltip__content-container");

		let titleContainer = contentContainer
			.append("div")
			.attr("class", "tooltip__title-container");
			

		if (tooltipImageVar) {
			this.imageContainer = titleContainer
				.append("div")
				.attr("class", "person__icon");

			this.image = this.imageContainer
				.append("div")
				.attr("class", "person__icon__photo");
		}

		this.title = titleContainer
			.append("h1")
			.classed("tooltip__title", true);

		this.valueFields = {};

		let categoryNest = d3.nest()
				.key((d) => { return d.category; })
				.entries(this.tooltipVars);
		let showCategories = categoryNest.length > 1;
		let whichContainer;

		for (let category of categoryNest) {
			whichContainer = contentContainer;
			if (category.key != "undefined" && showCategories) {
				contentContainer.append("h5")
					.classed("tooltip__category__name", true)
					.text(category.key);

				whichContainer = contentContainer.append("ul")
					.classed("tooltip__category__list", true);
			}

			for (let variable of category.values) {
				var listElem = whichContainer.append("li")
					.classed("tooltip__category__list-item", true);

				let valueField = {};
				valueField.label = listElem.append("h3")
					.classed("tooltip__category__list-item__label", true)
					.text(variable.displayName + ":");

				valueField.value = listElem.append("h3")
					.classed("tooltip__category__list-item__value", true)
					
				this.valueFields[variable.variable] = valueField;
			}
		}
	}

	show(d, mouse) {
        if (this.tooltipImageVar) {
        	if (d[this.tooltipImageVar.variable]) {
        		this.title
        			.classed("has-image", true)
        		this.imageContainer
        			.style("display", "table-cell");
        		this.image
        			.style("background", "no-repeat center/100% url(https://googledrive.com/host/" + this.imageFolderId + "/" + d[this.tooltipImageVar.variable] + ")");
        	} else {
        		this.imageContainer.style("display", "none");
        		this.title
        			.classed("has-image", false)
        	}
        }
		this.title.text(d[this.titleVar]);

		for (let variable of this.tooltipVars) {
			let varName = variable.variable;
			let varFormat = variable.format;
			let value = d[varName] ? formatValue(d[varName], varFormat) : null;

			if (value) {
				this.valueFields[varName].label
					.style("display", "inline-block");

				this.valueFields[varName].value
					.style("display", "inline-block")
					.text(value);
			} else  {
				this.valueFields[varName].label
					.style("display", "none");

				this.valueFields[varName].value
					.style("display", "none");

			}
		}

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

		if (mouse[0] > (windowWidth - tooltipWidth - this.xPadding)) {
			retCoords[0] = mouse[0] - tooltipWidth;
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