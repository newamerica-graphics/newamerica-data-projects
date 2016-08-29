import $ from 'jquery';

let d3 = require("d3");

let colorValues = {
	"turquoise":{ "light": "#2EBCB3", "dark": "#005753"},
	"blue": { "light": "#5BA4DA","dark": "#234A67"},
	"red": { "light": "#E75C64","dark": "#692025"},
	"purple": { "light": "#A076AC","dark": "#48304F"}
}


let colorOptions = {
	"turquoise":["#2EBCB3","#005753"],
	"blue":["#5BA4DA","#234A67"],
	"red":["#E75C64","#692025"],
	"purple":["#A076AC","#48304F"]
}

let ordinalRange = [
	[],
	[colorValues.turquoise.light],
	[colorValues.turquoise.light, colorValues.blue.light],
	[colorValues.turquoise.light, colorValues.blue.light, colorValues.purple.light],
	[colorValues.turquoise.light, colorValues.blue.light, colorValues.purple.light, colorValues.red.light],
	[colorValues.turquoise.dark, colorValues.turquoise.light, colorValues.blue.light, colorValues.purple.light, colorValues.red.light],
	[colorValues.turquoise.dark, colorValues.turquoise.light, colorValues.blue.dark, colorValues.blue.light, colorValues.purple.light, colorValues.red.light]
]

export function getColorScale(scaleSettings) {

	console.log(scaleSettings);
	let {scaleType, color, numBins, dataMin, dataMax} = scaleSettings;
	let scale;

	console.log(ordinalRange[numBins]);

	if (!scaleType) {
		console.log("no scale type!");
		return d3.scaleQuantize().range(["#ffffff", "#ffffff"]);
	}

	if (scaleType == "quantize") {
		scale = d3.scaleQuantize();
		let colorBins = setColorBins(numBins, colorOptions[color]);
		let roundedDomain = setDomain(dataMin, dataMax, numBins);
		scale.range(colorBins);
		scale.domain(roundedDomain);
	} else if (scaleType == "categorical") {
		scale = d3.scaleOrdinal();

		scale.range(ordinalRange[numBins]);
	}
	
	return scale;
}

function setDomain(dataMin, dataMax, numBins) {
	// let dataMagnitude = Math.floor(Math.log10(dataMin));
	// let intervalDivisor = Math.pow(10, dataMagnitude) * numBins;
	// let dataSpread = dataMax - dataMin;
	// let dataInterval = dataSpread/numBins;

	// console.log("magnitude: " + dataMagnitude);
	// console.log("dataspread: " + dataSpread);
	// console.log("interval: " + dataInterval);

	// let roundedInterval = Math.ceil(dataInterval/intervalDivisor)*intervalDivisor;
	// console.log("roundedinterval: " + roundedInterval);

	// let test = Math.pow(10, dataMagnitude) * (numBins/2);

	// let newMin = Math.floor(dataMin/test)*test;
	// console.log("oldmin " + dataMin + " newmin: " + newMin);

	// let newMax = Math.ceil(dataMax/test)*test;
	// console.log("oldmax " + dataMax + " newmax: " + newMax);

	// for (let i = 0; i < numBins; i++) {
	// 	let binVal = newMin + (roundedInterval * i);
	// 	console.log(binVal);
	// }

	return [dataMin, dataMax];
}

function setColorBins(numBins, baseColor) {
	let colorBins = [];

	let linearColorScale = d3.scaleLinear()
		.domain([0, numBins/2, numBins])
		.range(["#ffffff", baseColor[0], baseColor[1]]);

	for (let i = 0; i < numBins; i++) {
		colorBins[i] = linearColorScale(i+1);
	}

	return colorBins;
}