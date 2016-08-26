import $ from 'jquery';

let d3 = require("d3");

export class Chart {
	constructor(id) {
		console.log("in super constructor!");
		console.log(id);
		this.id = id;
		this.downloadSVGButton = d3.select(id)
			.append("a")
			.text("download SVG")
			.attr("class", "download-svg");

		this.downloadPNGButton = d3.select(id)
			.append("a")
			.text("download PNG")
			.attr("class", "download-png");

		this.canvas = d3.select(id)
			.append("canvas")
			.style("display", "none");

	}

	render() {
		console.log("in super render!", this.id);
		this.downloadSVGButton
			.on("mouseenter", () => { this.setLink("svg"); });

		this.downloadPNGButton
			.on("mouseenter", () => { this.setLink("png"); });
			
	}

	setLink(type) {
		let svg = d3.select(this.id + " svg");

		let html = svg
	        .attr("version", 1.1)
	        .attr("xmlns", "http://www.w3.org/2000/svg")
	        .node().parentNode.innerHTML;

		let imgsrc = 'data:image/svg+xml;base64,'+ btoa(html); 
		
		if (type == "svg") {
			this.downloadSVGButton
				.attr("href", imgsrc)
				.attr("download", "map.svg");
		} else {
			this.canvas
				.attr("height", svg.attr("height"))
				.attr("width", svg.attr("width"));

			var canvas = this.canvas._groups[0][0];

		 	let context = canvas.getContext("2d");

			let image = new Image;
			image.src = imgsrc;
			image.onload = () => {
				context.drawImage(image, 0, 0);

				let canvasdata = canvas.toDataURL("image/png");

				this.downloadPNGButton
					.attr("href", canvasdata)
					.attr("download", "map.png");
			};
		}

		
	}
}