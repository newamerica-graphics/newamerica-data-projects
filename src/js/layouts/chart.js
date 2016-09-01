import $ from 'jquery';

let d3 = require("d3");


// superclass for all chart types, adds download and share buttons to the chart
export class Chart {
	constructor(id, isSubComponent) {
		this.id = id;
		this.isSubComponent = isSubComponent;
		if (isSubComponent) {
			return;
		}

		this.downloadLink = d3.select(id + "__download-link");

		this.downloadSVGButton = d3.select(id + "__download-svg")
			
			.attr("download", "chart.svg");

		this.downloadPNGButton = d3.select(id + "__download-png")
			
			.attr("download", "chart.png");

		this.canvas = d3.select(id)
			.append("canvas")
			.style("display", "none");
	}

	render() {
		if (this.isSubComponent) {
			return;
		}
		// sets href link for svg button, triggered on mouseenter to encapsulate current state of the chart
		this.downloadLink
			.on("click", () => { this.setLinks() });


		// sets href link for png button, triggered on mouseenter to encapsulate current state of the chart
		// this.downloadPNGButton
		// 	.on("mouseenter", () => { this.setLink("png"); });
	}

	setLinks() {
		console.log("setting link!");
		let svg = d3.select(this.id + " svg");

		let html = svg
	        .attr("version", 1.1)
	        .attr("xmlns", "http://www.w3.org/2000/svg")
	        .node().parentNode.innerHTML;

	       console.log(html);

		let imgsrc = 'data:image/svg+xml;base64,'+ btoa(html); 
		
		this.downloadSVGButton
			.attr("href", imgsrc);
		// for png images, first sets canvas to dimensions of svg, renders the svg as an image on the canvas, then converts 
		// 	the canvas to a dataURI
		this.canvas
			.attr("height", svg.attr("height"))
			.attr("width", svg.attr("width"));

		let canvas = this.canvas._groups[0][0];

	 	let context = canvas.getContext("2d");

		let image = new Image;
		image.src = imgsrc;
		image.onload = () => {
			context.drawImage(image, 0, 0);

			let canvasdata = canvas.toDataURL("image/png");

			this.downloadPNGButton
				.attr("href", canvasdata);
		};
		

		
	}
}