import $ from 'jquery';

let d3 = require("d3");

export class ContentStream {
	constructor(vizSettings) {
		Object.assign(this, vizSettings);

		let contentStreamContainer = d3.select(this.id)
			.append("div")
			.attr("class", "content-stream__container");

		this.contentStream = contentStreamContainer
			.append("ul")
			.attr("class", "content-stream");
	}

	render(data) {
		console.log(data);
		console.log(data[this.primaryDataSheet]);
		this.dataNest = d3.nest()
			.key((d) => { return d.state_id; })
			.map(data[this.primaryDataSheet]);

		console.log(this.dataNest);

		this.changeValue("6");
	}

	show() {

	}

	hide() {

	}

	changeValue(value) {
		if (!value) { return; }
		let valueList = this.dataNest.get(value);
		let sortedList = valueList.sort((a, b) => { return new Date(a.date) - new Date(b.date); });

		let entries = this.contentStream.selectAll("li")
			.data(sortedList)
		   .enter().append("li")
		   	.attr("class", "content-stream__entry")
		   	.append("a")
		   	.attr("href", (d) => { return d.url; });

		entries.selectAll("div.content-stream__entry__image-container")
			.data((d) => { console.log(d); return d.image_url ? [d] : []})
		  .enter().append("div")
			.attr("class", "content-stream__entry__image-container")
		  .append("img")
			.attr("class", "content-stream__entry__image")
			.attr("src", (d) => { return d.image_url });

		let entryTextContainers = entries.append("div")
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