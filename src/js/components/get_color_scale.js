import $ from 'jquery';

let d3 = require("d3");

let colorOptions = {
	"turquoise":"#2EBCB3",
	"blue":"#4378a0",
	"red":"#E75C64"
}

export function getColorScale(type, color, numBins) {
	let scale;

	if (type == "quantize") {
		scale = d3.scaleQuantize();
		let colorBins = setColorBins(numBins, colorOptions[color]);
		scale.range(colorBins);
	}

	
	return scale;
}

function setColorBins(numBins, baseColor) {
	let colorBins = [];

	let linearColorScale = d3.scaleLinear()
		.domain([0, numBins])
		.range(["white", baseColor]);

	for (let i = 0; i < numBins; i++) {
		colorBins[i] = linearColorScale(i+1);
	}

	console.log(colorBins);

	return colorBins;

	
}