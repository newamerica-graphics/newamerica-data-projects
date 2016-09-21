import $ from 'jquery';

import domtoimage from 'dom-to-image';

let d3 = require("d3");


// superclass for all chart types, adds download and share buttons to the chart
export class Chart {
	constructor(id, isSubComponent) {
		this.isSubComponent = isSubComponent;
		if (isSubComponent) {
			return;
		}

		this.downloadLink = $(id + "__download-link")
			.on("click", () => { this.setPngLink() });
	}

	render() {
	}

	// setSvgLink() {
	// 	console.log("setting link!");

	// 	let svg = d3.select(this.id + " svg");

	// 	let html = svg
	//         .attr("version", 1.1)
	//         .attr("xmlns", "http://www.w3.org/2000/svg")
	//         .node().parentNode.innerHTML;

	//        console.log(html);

	// 	let imgsrc = 'data:image/svg+xml;base64,'+ btoa(html); 
		
	// 	this.downloadSvgButton
	// 		.attr("href", imgsrc);
	// }

	setPngLink() {
		let DOMId = this.id.replace("#", "");
		
		let node = document.getElementById(DOMId);

		domtoimage.toPng(node)
		    .then((dataUrl) => {
		    	var link = document.createElement("a");
		        link.download = 'chart.png';
		        link.href = dataUrl;
		        link.click();
		        link.remove();
		    })
		    .catch(function (error) {
		        console.error('oops, something went wrong!', error);
		    });
	}
}