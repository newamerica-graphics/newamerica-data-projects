import $ from 'jquery';

let d3 = require("d3");

let colorOptions = {
	"turquoise":["#2EBCB3","#005753"],
	"blue":["#5BA4DA","#234A67"],
	"red":["#E75C64","#692025"],
	"purple":["#A076AC","#48304F"]
}

export function getColorScale(variable, dataMin, dataMax) {
	let {scaleType, color, numBins} = variable;
	let scale;

	if (!scaleType) {
		console.log("no scale type!");
		return d3.scaleQuantize().range(["#ffffff", "#ffffff"]);
	}

	if (scaleType == "quantize") {
		scale = d3.scaleQuantize();
		let colorBins = setColorBins(numBins, colorOptions[color]);
		scale.range(colorBins);
		scale.domain([1, dataMax]);
	}
	
	return scale;
}

function setColorBins(numBins, baseColor) {
	let colorBins = [];

	let linearColorScale = d3.scaleLinear()
		.domain([0, numBins/2, numBins])
		.range(["#ffffff", baseColor[0], baseColor[1]]);

	for (let i = 0; i < numBins; i++) {
		colorBins[i] = linearColorScale(i+1);
	}

	console.log(colorBins);

	return colorBins;

	
}