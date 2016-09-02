import $ from 'jquery';

let d3 = require("d3");

import { formatValue } from "../helper_functions/format_value.js";

export class Tooltip {
	constructor(id, tooltipVars, tooltipImageVar, imageFolderId) {
		//removes first variable to be used as title
		this.titleVar = tooltipVars.shift().variable;
		this.tooltipVars = tooltipVars;
		this.tooltipImageVar = tooltipImageVar;
		this.imageFolderId = imageFolderId;

		this.tooltip = d3.select("body")
			.append("div")
			.attr("class", "tooltip hidden");

		let titleContainer = this.tooltip
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

		let categories = {};

		for (let variable of this.tooltipVars) {
			if (!variable) {
				console.log("this variable was not defined!");
			}
			let category = variable.category;
			if (category) {
				if (!categories.hasOwnProperty(category)) {
					this.tooltip.append("h5")
						.classed("tooltip__category__name", true)
						.text(category);

					categories[category] = this.tooltip.append("ul")
						.classed("tooltip__category__list", true);
				}
				
				var listElem = categories[category].append("li")
					.classed("tooltip__category__list-item", true);
			} else {
				var listElem = this.tooltip.append("li")
					.classed("tooltip__category__list-item", true);
			}


			let valueField = {};
			valueField.label = listElem.append("h3")
				.classed("tooltip__category__list-item__label", true)
				.text(variable.displayName + ":");

			valueField.value = listElem.append("h3")
				.classed("tooltip__category__list-item__value", true)
				
			this.valueFields[variable.variable] = valueField;
		}
	}

	show(d, mouse) {
		console.log(mouse);
		this.tooltip
			.classed('hidden', false)
            .attr('style', 'left:' + (mouse[0]) + 'px; top:' + (mouse[1]) + 'px');

        console.log(this.imageFolderId);

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

			console.log(value);

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
	}

	hide() {
		this.tooltip.classed('hidden', true);
	}

}