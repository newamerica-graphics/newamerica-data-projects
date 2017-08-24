import $ from 'jquery';

import { colors } from "../helper_functions/colors.js";

let d3 = require("d3");

export class ContentStream {
	constructor(vizSettings) {
		Object.assign(this, vizSettings);

		this.contentStreamContainer = d3.select(this.id)
			.append("div")
			.attr("class", "content-stream__container");

		if (this.defaultText) {
			this.defaultTextDiv = this.contentStreamContainer
				.append("div")
				.append("h5")
				.attr("class", "content-stream__default-text")
				.text(this.defaultText);
		} 

		let contentStreamTitleContainer = this.contentStreamContainer
			.append("div")
			.attr("class", "content-stream__title-container");

		this.contentStreamTitle = contentStreamTitleContainer
			.append("div")
			.attr("class", "content-stream__title");

		if (this.showCurrFilterVal) {
			let filterValContainer = contentStreamTitleContainer
				.append("div")
				.attr("class", "content-stream__filter-val");

			this.filterValLabel = filterValContainer
				.append("h5")
				.attr("class", "content-stream__filter-val__label");

			this.filterValValue = filterValContainer
				.append("h5")
				.attr("class", "content-stream__filter-val__value");
		}

		this.contentStream = this.contentStreamContainer
			.append("ul")
			.attr("class", "content-stream");
	}

	render(data) {
		this.data = data[this.primaryDataSheet]
		this.dataNest = d3.nest()
			.key((d) => { return d.state; })
			.map(this.data);
		if (!this.defaultText) {
			this.setStreamContent({color: colors.grey.medium, dataPoint: "all", currFilter: this.defaultFilter});
		}
	}

	hide() {
		if (this.entries) { this.entries.remove(); }

		this.contentStreamTitle
			.text("");

		this.defaultText ? this.defaultTextDiv.classed("hidden", false) : null;
	}

	changeValue(params) {
		if (this.entries) { this.entries.remove(); }

		if (params.dataPoint) {
			this.defaultText ? this.defaultTextDiv.classed("hidden", true) : null;
			this.setStreamContent(params);
		} else {
			if (this.defaultText) {
				this.defaultTextDiv.classed("hidden", false);
				this.contentStreamContainer.style("border", "none")
				this.contentStreamTitle.text("")

				if (this.showCurrFilterVal) {
					this.filterValLabel.text("")
					this.filterValValue.text("")
				}
				return;
			} else {
				this.setStreamContent({color: colors.grey.medium, dataPoint: "all", currFilter: params.currFilter});
			}
		}
	}

	setStreamContent({color, dataPoint, currFilter}) {
		let valueList, filterVal;

		if (dataPoint == "all" || !dataPoint.state || !this.dataNest.get(String(dataPoint.state))) {
			valueList = this.data;
			this.contentStreamTitle
				.text("All States");

		} else {
			let value = dataPoint.state;
			valueList = this.dataNest.get(String(value));
			
			this.contentStreamTitle
				.text(value);
		}

		valueList = currFilter && currFilter.filterVal && this.filterVar ? valueList.filter((d) => { return d[this.filterVar.variable] == currFilter.filterVal}) : valueList
		let sortedList = valueList.sort((a, b) => { return new Date(b.date) - new Date(a.date); });

		if (color) {
			this.contentStreamContainer
				.style("border", "2px solid " + color)
		}

		
		if (this.showCurrFilterVal && currFilter) {
			this.filterValLabel
				.text(currFilter.displayName + ":")

			this.filterValValue
				.text(sortedList.length)
				.style("color", color)
		}

		this.entries = this.contentStream.selectAll("li")
			.data(sortedList)
		   .enter().append("li")
		   	.attr("class", "content-stream__entry");

		let entriesLinks = this.entries.append("a")
		   	.attr("href", (d) => { return d.url; });

		entriesLinks.selectAll("div.content-stream__entry__image-container")
			.data((d) => { return d.image_url ? [d] : []})
		  .enter().append("div")
			.attr("class", "content-stream__entry__image-container")
		  .append("img")
			.attr("class", "content-stream__entry__image")
			.attr("src", (d) => { return d.image_url });

		let entryTextContainers = entriesLinks.append("div")
			.attr("class", "content-stream__entry__text-container");

		entryTextContainers.append("h5")
			.attr("class", "content-stream__entry__date")
			.text((d) => { return d.date; });

		entryTextContainers.append("h5")
			.attr("class", "content-stream__entry__title")
			.text((d) => { return d.title; });

		entryTextContainers.append("h5")
			.attr("class", "content-stream__entry__description")
			.text((d) => { return d.description; });   	
	}
}