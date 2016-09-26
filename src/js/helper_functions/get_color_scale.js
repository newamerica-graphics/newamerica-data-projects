import $ from 'jquery';

let d3 = require("d3");

import { colors } from "./colors.js";

let colorOptions = {
	"turquoise":["#2EBCB3","#005753"],
	"blue":["#5BA4DA","#234A67"],
	"red":["#E75C64","#692025"],
	"purple":["#A076AC","#48304F"]
}

let ordinalRange = [
	[],
	[colors.turquoise.light],
	[colors.turquoise.light, colors.blue.light],
	[colors.turquoise.light, colors.blue.light, colors.purple.light],
	[colors.turquoise.light, colors.blue.light, colors.purple.light, colors.red.light],
	[colors.turquoise.dark, colors.turquoise.light, colors.blue.light, colors.purple.light, colors.red.light],
	[colors.turquoise.dark, colors.turquoise.light, colors.blue.dark, colors.blue.light, colors.purple.light, colors.red.light],
	[colors.turquoise.dark, colors.turquoise.light, colors.blue.dark, colors.blue.light, colors.purple.dark, colors.purple.light, colors.red.light],
	[colors.turquoise.dark, colors.turquoise.light, colors.blue.dark, colors.blue.light, colors.purple.dark, colors.purple.light, colors.red.dark, colors.red.light],
	[colors.turquoise.dark, colors.turquoise.medium, colors.turquoise.light, colors.blue.dark, colors.blue.light, colors.purple.dark, colors.purple.light, colors.red.dark, colors.red.light],
	[colors.turquoise.dark, colors.turquoise.medium, colors.turquoise.light, colors.blue.dark, colors.blue.medium, colors.blue.light, colors.purple.dark, colors.purple.light, colors.red.dark, colors.red.light],
	[colors.turquoise.dark, colors.turquoise.medium, colors.turquoise.light, colors.blue.dark, colors.blue.medium, colors.blue.light, colors.purple.dark, colors.purple.medium, colors.purple.light, colors.red.dark, colors.red.light],
	[colors.turquoise.dark, colors.turquoise.medium, colors.turquoise.light, colors.blue.dark, colors.blue.medium, colors.blue.light, colors.purple.dark, colors.purple.medium, colors.purple.light, colors.red.dark, colors.red.medium, colors.red.light],
]

export function getColorScale(data, filterVar) {
	let { scaleType, numBins, customRange } = filterVar;
	let scale;

	if (!scaleType) {
		console.log("no scale type!");
		return d3.scaleQuantize().range(["#ffffff", "#ffffff"]);
	}

	if (scaleType == "categorical") {
		scale = d3.scaleOrdinal();

		// if both are not custom, get unique values
		let uniqueVals = !(filterVar.customDomain && filterVar.customRange) ? getUniqueVals(data, filterVar) : null;

		let domain = setCategoricalDomain(filterVar, uniqueVals);
		let range = setCategoricalRange(filterVar, uniqueVals);
		scale.domain(domain);
		scale.range(range);

	} else if (scaleType == "quantize") {
		scale = d3.scaleQuantize();
		let colorBins = setColorBins(numBins, customRange);
		let domain = setQuantizeDomain(filterVar, data);
		// let roundedDomain = setDomain(dataMin, dataMax, numBins);
		scale.range(colorBins);
		scale.domain(domain);
		scale.nice();
		// scale.domain(roundedDomain);
	}
	
	return scale;
}

function setCategoricalDomain(filterVar, uniqueVals) {
	if (filterVar.customDomain) {
		return filterVar.customDomain;
	} else {
		return uniqueVals.keys().sort(d3.ascending);
	}
}

function setCategoricalRange(filterVar, uniqueVals) {
	if (filterVar.customRange) {
		return filterVar.customRange;
	} else {
		let numBins = uniqueVals.keys().length;

		numBins >= ordinalRange.length ? console.log("get_color_scale: too many color bins " + filterVar.variable) : null;

		return ordinalRange[numBins];
	}
}

function getUniqueVals(data, filterVar) {
	let uniqueVals = d3.nest()
		.key((d) => { return d[filterVar.variable] })
		.map(data);

	uniqueVals.remove("null");

	return uniqueVals;
}

function setQuantizeDomain(filterVar, data) {
	let filterName = filterVar.variable;
	let dataMin = Number(d3.min(data, (d) => { return d[filterName] ? Number(d[filterName]) : null; })); 
	let dataMax = Number(d3.max(data, (d) => { return d[filterName] ? Number(d[filterName]) : null; }));
	
	return [dataMin, dataMax];
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