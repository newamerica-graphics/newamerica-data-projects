import $ from 'jquery';

import domtoimage from 'dom-to-image';

let d3 = require("d3");


// superclass for all chart types, adds download and share buttons to the chart
export class Chart {
	constructor(id, isSubComponent) {
		this.id = id;
		this.isSubComponent = isSubComponent;
		if (isSubComponent) {
			return;
		}

		this.downloadSVGButton = d3.select(id)
			.append("a")
			.text("Download SVG")
			.attr("class", "download-svg")
			.attr("download", "chart.svg");;

		this.downloadPNGButton = d3.select(id)
			.append("a")
			.text("Download PNG")
			.attr("class", "download-png")
			.attr("download", "chart.png");;

		this.canvas = d3.select(id)
			.append("canvas")
			.style("display", "none");
	}

	render() {
		console.log("rendering");
		if (this.isSubComponent) {
			return;
		}
		// sets href link for svg button, triggered on mouseenter to encapsulate current state of the chart
		this.downloadSVGButton
			.on("mouseclick", () => { this.setLink("svg"); });

		// sets href link for png button, triggered on mouseenter to encapsulate current state of the chart
		this.downloadPNGButton
			.on("mouseclick", () => { this.setLink("png"); });
	}

	setLink(type) {

		var node = document.getElementById('homegrown__outcome-for-extremist');

		domtoimage.toSvg(node)
		    .then((dataUrl) => {
		        var img = new Image();
		        img.src = dataUrl;
		        document.body.appendChild(img);
		        this.downloadSVGButton
					.attr("href", dataUrl);
		    })
		    .catch(function (error) {
		        console.error('oops, something went wrong!', error);
		    });
		// console.log("setting link")
		// let svg = d3.select(this.id + " svg");

		// let html = svg
	 //        .attr("version", 1.1)
	 //        .attr("xmlns", "http://www.w3.org/2000/svg")
	 //        .node().parentNode.innerHTML;

		// let imgsrc = 'data:image/svg+xml;base64,'+ btoa(html); 
		
		// if (type == "svg") {
		// 	this.downloadSVGButton
		// 		.attr("href", imgsrc);
		// } else {
		// 	// for png images, first sets canvas to dimensions of svg, renders the svg as an image on the canvas, then converts 
		// 	// 	the canvas to a dataURI
		// 	this.canvas
		// 		.attr("height", svg.attr("height"))
		// 		.attr("width", svg.attr("width"));

		// 	let canvas = this.canvas._groups[0][0];

		//  	let context = canvas.getContext("2d");

		// 	let image = new Image;
		// 	image.src = imgsrc;
		// 	image.onload = () => {
		// 		context.drawImage(image, 0, 0);

		// 		let canvasdata = canvas.toDataURL("image/png");

		// 		this.downloadPNGButton
		// 			.attr("href", canvasdata);
		// 	};
		// }

		
	}
}