import $ from 'jquery';

let d3 = require("d3");

let colorOptions = {
	"turquoise":"#005753",
	"blue":"#4378a0",
	"red":"#E75C64"
}

export function getColorScale(variable, dataMin, dataMax) {
	let {scaleType, color, numBins} = variable;
	let scale;

	if (scaleType == "quantize") {
		scale = d3.scaleQuantize();
		let colorBins = setColorBins(numBins, colorOptions[color]);
		scale.range(colorBins);
		scale.domain([dataMin, dataMax]);
	}
	
	return scale;
}

function setColorBins(numBins, baseColor) {
	let colorBins = [];

	let linearColorScale = d3.scaleLinear()
		.domain([0, numBins/2, numBins])
		.range(["#ffffff", "#2EBCB3", "#005753"]);

	for (let i = 0; i < numBins; i++) {
		colorBins[i] = linearColorScale(i+1);
	}

	console.log(colorBins);

	return colorBins;

	
}