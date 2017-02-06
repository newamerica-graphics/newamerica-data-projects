import $ from 'jquery';

let d3 = require("d3");

import { formatValue } from "../helper_functions/format_value.js";

export class PopupDataBox {
	constructor(componentSettings) {
		Object.assign(this, componentSettings);

		this.dataBox = d3.select(this.id)
			.append("div")
			.attr("class", "data-box")
			.classed("hidden", true);

		this.title = this.dataBox.append("h3")
			.attr("class", "data-box__title")

		this.subtitle = this.dataBox.append("h5")
			.attr("class", "data-box__subtitle")

		this.valueFields = {};

		for (let category of this.dataBoxVars.categories) {
			console.log(category);

			this.dataBox.append("h5")
				.attr("class", "data-box__category-label")
				.text(category.label);

			let categoryContainer = this.dataBox.append("div")
				.attr("class", "data-box__category-container");

			for (let field of category.fields) {
				let valContainer = categoryContainer.append("div")
					.attr("class", "data-box__value-container");

				valContainer.append("h5")
					.attr("class", "data-box__value-label")
					.text(field.displayName + ":");

				valContainer.append("h5")
					.attr("class", "data-box__value");

				this.valueFields[field.variable] = valContainer;
			}
		}
	}

	show(featureProps) {
		console.log("showing data box");
		console.log(featureProps);

		this.dataBox.classed("hidden", false);

		this.title
			.text(formatValue(featureProps[this.dataBoxVars.title.variable], this.dataBoxVars.title.format));

		let subtitleText = "",
			i = 0;
		for (let subTitleVar of this.dataBoxVars.subtitle) {
			console.log(featureProps[subTitleVar.variable]);
			if (featureProps[subTitleVar.variable] && featureProps[subTitleVar.variable] != "null") {
				subtitleText += i != 0 ? ", " : "";
				subtitleText += formatValue(featureProps[subTitleVar.variable], subTitleVar.format);
				i++;
			}
		}

		this.subtitle
			.text(subtitleText);

		for (let category of this.dataBoxVars.categories) {
			for (let field of category.fields) {
				let val = featureProps[field.variable],
				format = field.format;
				if (val && val != "null") {
					if (format != "link") {
						this.valueFields[field.variable]
							.classed("hidden", false)
						  .select(".data-box__value")
							.text(formatValue(featureProps[field.variable], format));
					} else {
						this.valueFields[field.variable]
							.classed("hidden", false)
						  .select(".data-box__value")
							.html(formatValue(featureProps[field.variable], format));
					}
				} else {
					this.valueFields[field.variable]
						.classed("hidden", true)
				}
				
			}
		}

		// for (let dataBoxVar of this.dataBoxVars) {
		// 	let val = featureProps[dataBoxVar.variable];

		// 	if (val && val != "null") {
		// 		this.valueFields[dataBoxVar.variable]
		// 			.classed("hidden", false)
		// 		.select(".data-box__value")
		// 			.text(featureProps[dataBoxVar.variable]);
		// 	} else {
		// 		this.valueFields[dataBoxVar.variable]
		// 			.classed("hidden", true)
		// 	}
		// }
	}

	hide() {
		console.log("hiding data box");
		this.dataBox.classed("hidden", true);
	}
}

	// render(data) {
	// 	this.data = data[this.primaryDataSheet];
	// 	let defaultVal = 0;

	// 	this.changeValue(defaultVal);
	// }

	// changeValue(value) {
	// 	let currElement = this.data[value];

	// 	this.title.text(currElement[this.titleVar]);

	// 	for (let variable of this.dataBoxVars) {
	// 		let varName = variable.variable;
	// 		let varFormat = variable.format;
	// 		let value = currElement[varName] ? formatValue(currElement[varName], varFormat) : null;

	// 		if (value) {
	// 			this.valueFields[varName].value
	// 				.style("display", "inline-block")

	// 			if (varFormat == "link") {
	// 				this.valueFields[varName].value.select("a").remove();
	// 				this.valueFields[varName].value
	// 					.append("a")
	// 					.attr("href", value)
	// 					.text(variable.displayName);
	// 			} else {
	// 				this.valueFields[varName].label
	// 					.style("display", "inline-block");

	// 				this.valueFields[varName].value
	// 					.text(value);
	// 			}
					
	// 		} else  {
	// 			if (this.valueFields[varName].label) {
	// 				this.valueFields[varName].label
	// 					.style("display", "none");
	// 			}
	// 			this.valueFields[varName].value
	// 				.style("display", "none");

	// 		}
	// 	}
	// }

// 	}

// 	show() {
// 		console.log("showing data box");
// 	}

// 	hide() {
// 		console.log("hiding data box");
// 	}

// }

//     console.log(this);
//     let splitPieces = feature.properties.Geography.split(", ");

//     console.log(feature.properties);

//     let popupProperties = "";

//     for (let key in this.tooltipVars) {
//         console.log(key);
//         popupProperties += "<div class='mapbox-map__popup__category-container'>" +
//             "<h5 class='mapbox-map__popup__category-label'>" + key + "</h5>" +
//             "<ul class='mapbox-map__popup__property-list'>";

//         let values = this.tooltipVars[key];
//         for (let i = 0; i < values.length; i++) {
//             let currVar = values[i];
//             popupProperties += "<li class='mapbox-map__popup__property'>" +
//                         "<h5 class='mapbox-map__popup__property__label'>" + currVar.displayName + "</h5>" +
//                         "<h5 class='mapbox-map__popup__property__value'>" + formatValue(feature.properties[currVar.variable], currVar.format)  + "</h5>" +
//                     "</li>";
//         }
//         popupProperties += "</ul></div>";
//     }

//     return "<h5 class='mapbox-map__popup__subheading'>" + splitPieces[2] + "</h5>" +
//     "<h3 class='mapbox-map__popup__heading'>" + splitPieces[1] + "</h3>" +
//     "<h5 class='mapbox-map__popup__subheading'>" + splitPieces[0] + "</h5>" +
//     "<div class='mapbox-map__popup__properties'>" + popupProperties + "</div>"



// 		let {id, tooltipVars, tooltipImageVar, imageFolderId, tooltipScrollable} = vizSettings;
// 		//removes first variable to be used as title
// 		this.titleVar = tooltipVars[0].variable;
// 		this.tooltipVars = tooltipVars.slice(1);
// 		this.tooltipImageVar = tooltipImageVar;
// 		this.imageFolderId = imageFolderId;
// 		this.tooltipScrollable = tooltipScrollable;

// 		this.isHovered = false;

// 		let tooltipClass = "tooltip hidden";
// 		tooltipClass += tooltipScrollable ? " scrollable" : "";
// 		this.xPadding = tooltipScrollable ? scrollXPadding : nonScrollXPadding;

// 		this.tooltip = d3.select("body")
// 			.append("div")
// 			.attr("class", tooltipClass);

// 		if (tooltipScrollable) {
// 			this.tooltip
// 				.append("div")
// 				.attr("class", "tooltip__fadeout__top");
// 			this.tooltip
// 				.append("div")
// 				.attr("class", "tooltip__fadeout__bottom");
// 		}

// 		let contentContainer = this.tooltip
// 			.append("div")
// 			.attr("class", "tooltip__content-container");

// 		let titleContainer = contentContainer
// 			.append("div")
// 			.attr("class", "tooltip__title-container")
// 			.classed("no-content", tooltipVars.length < 1);
			
// 		if (tooltipImageVar) {
// 			this.imageContainer = titleContainer
// 				.append("div")
// 				.attr("class", "person__icon");

// 			this.image = this.imageContainer
// 				.append("div")
// 				.attr("class", "person__icon__photo");
// 		}

// 		this.title = titleContainer
// 			.append("h1")
// 			.classed("tooltip__title", true);

// 		this.valueFields = {};

// 		let categoryNest = d3.nest()
// 				.key((d) => { return d.category; })
// 				.entries(this.tooltipVars);
// 		let showCategories = categoryNest.length > 1;
// 		let whichContainer;

// 		for (let category of categoryNest) {
// 			whichContainer = contentContainer;
// 			if (category.key != "undefined" && showCategories) {
// 				contentContainer.append("h5")
// 					.classed("tooltip__category__name", true)
// 					.text(category.key);

// 				whichContainer = contentContainer.append("ul")
// 					.classed("tooltip__category__list", true);
// 			}

// 			for (let variable of category.values) {
// 				var listElem = whichContainer.append("li")
// 					.classed("tooltip__category__list-item", true);

// 				let valueField = {};
// 				valueField.label = listElem.append("h3")
// 					.classed("tooltip__category__list-item__label", true)
// 					.text(variable.displayName + ":");

// 				valueField.value = listElem.append("h3")
// 					.classed("tooltip__category__list-item__value", true)
					
// 				this.valueFields[variable.variable] = valueField;
// 			}
// 		}
// 	}

// 	show(d, mouse) {
// 		if ($(window).width() < 450) {
// 			return;
// 		}
//         if (this.tooltipImageVar) {
//         	if (d[this.tooltipImageVar.variable]) {
//         		this.title
//         			.classed("has-image", true)
//         		this.imageContainer
//         			.style("display", "table-cell");
//         		this.image
//         			.style("background", "no-repeat center/100% url(https://googledrive.com/host/" + this.imageFolderId + "/" + d[this.tooltipImageVar.variable] + ")");
//         	} else {
//         		this.imageContainer.style("display", "none");
//         		this.title
//         			.classed("has-image", false)
//         	}
//         }
// 		this.title.text(d[this.titleVar]);

// 		for (let variable of this.tooltipVars) {
// 			let varName = variable.variable;
// 			let varFormat = variable.format;
// 			let value = d[varName] ? formatValue(d[varName], varFormat) : null;

// 			if (value) {
// 				this.valueFields[varName].label
// 					.style("display", "inline-block");

// 				this.valueFields[varName].value
// 					.style("display", "inline-block")
// 					.text(value);
// 			} else  {
// 				this.valueFields[varName].label
// 					.style("display", "none");

// 				this.valueFields[varName].value
// 					.style("display", "none");

// 			}
// 		}

// 		this.tooltip
// 			.classed('hidden', false);

//         this.isHovered = true;
// 	}

// 	hide() {
// 		this.isHovered = this.tooltipScrollable ? $(this.tooltip._groups[0][0]).is(":hover") : false;
// 		this.isHovered ? null : this.tooltip.classed('hidden', true);
// 	}

// }