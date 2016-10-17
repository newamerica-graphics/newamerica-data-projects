import $ from 'jquery';

import domtoimage from 'dom-to-image';

let d3 = require("d3");


// superclass for all chart types, adds download and share buttons to the chart
export class Chart {
	constructor(id, isSubComponent) {
		// console.log("hello!");
		// this.isSubComponent = isSubComponent;
		// if (isSubComponent) {
		// 	return;
		// }

		// this.downloadLink = $(id + "__download-link")
		// 	.on("click", () => { this.setSvgLink() });

		// this.canvas = d3.select(id)
		// 	.append("canvas")
		// 	.style("display", "none");
	}

	render() {
		// this.setPngLink();
	}

	setSvgLink() {
		console.log("setting link!");

		let svg = d3.select(".us-states-svg");

		let html = svg
	        .attr("version", 1.1)
	        .attr("xmlns", "http://www.w3.org/2000/svg")
	        .node().parentNode.innerHTML;

	       console.log(html);

		let imgsrc = 'data:image/svg+xml;base64,'+ btoa(html); 
		
		this.downloadLink
			.attr("href", imgsrc);
	}

	setPngLink() {
		let DOMId = this.id.replace("#", "");
		
		let node = document.getElementById(DOMId);
		// console.log(node);
		$(this.id).css("zoom","2");
		this.resize();

		domtoimage.toPng(node, { height: this.h*2, width: this.w*2 })
		    .then((dataUrl) => {
		    	var link = document.createElement("a");
		        link.download = 'chart.png';
		        link.href = dataUrl;
		        link.click();
		        link.remove();

		        let aspect = this.h/this.w;
		        let height = (670 * aspect) + "px";
		        let popup = window.open();
				popup.document.write("<img src=" + dataUrl + " height=1000px width=670px></img>");
				popup.focus(); //required for IE
				popup.print();
		    })
		    .catch(function (error) {
		        console.error('oops, something went wrong!', error);
		    });

		$(this.id).css("zoom","1");
		this.resize();
	}

	printChart() {
		let div = $(this.id);
        var mywindow = window.open('', div, 'height=400, width=600');
        mywindow.document.write('<html><head><title>my div</title>');
        /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
        mywindow.document.write('</head><body >');
        mywindow.document.write(data);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10

        mywindow.print();
        mywindow.close();

        return true;
	}
}