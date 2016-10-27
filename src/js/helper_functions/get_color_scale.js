import $ from 'jquery';

let d3 = require("d3");

import { colors } from "./colors.js";

let colorOptions = {
	"turquoise":["#2EBCB3","#005753"],
	"blue":["#5BA4DA","#234A67"],
	"red":["#E75C64","#692025"],
	"purple":["#A076AC","#48304F"],
	"black":["#EAEAEB", "#2C2F35"]
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
	let { scaleType, numBins, customRange, customDomain } = filterVar;
	let scale, domain, range;

	if (!scaleType) {
		console.log("no scale type!");
		return d3.scaleQuantize().range(["#ffffff", "#ffffff"]);
	}

	if (scaleType == "categorical") {
		scale = d3.scaleOrdinal();

		// if both are not custom, get unique values
		let uniqueVals = !(filterVar.customDomain && filterVar.customRange) ? getUniqueVals(data, filterVar) : null;
		domain = setCategoricalDomain(filterVar, uniqueVals);
		range = setCategoricalRange(filterVar, uniqueVals);
		

	} else if (scaleType == "quantize") {
		scale = d3.scaleQuantize();
		range = setColorBins(numBins, customRange);
		domain = customDomain ? customDomain : setQuantizeDomain(filterVar, data);
		
	} else if (scaleType == "linear") {
		scale = d3.scaleLinear();
		domain = customDomain ? customDomain : setLinearDomain(filterVar, data);
		range = customRange ? customRange : setLinearRange(filterVar, data);

	} else if (scaleType == "logarithmic") {
		scale = d3.scaleLog().base(20);
		domain = customDomain ? customDomain : setLinearDomain(filterVar, data);
		range = customRange ? customRange : setLinearRange(filterVar, data);
	}

	scale.domain(domain)
		.range(range);

	if (scaleType != "categorical") {
		scale.nice();
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

function setLinearDomain(filterVar, data) {
	let filterName = filterVar.variable;
	let dataMin = Number(d3.min(data, (d) => { return d[filterName] ? Number(d[filterName]) : null; })); 
	let dataMax = Number(d3.max(data, (d) => { return d[filterName] ? Number(d[filterName]) : null; }));

	return [dataMin, dataMax];
}

function setLinearRange(filterVar, data) {
	return [colors.white, colors.turquoise.dark];
}

function setColorBins(numBins, customRange) {
	let colorBins = [];

	let linearColorScale = d3.scaleLinear()
		.domain([0, numBins/2, numBins])
		.range(["#ffffff", customRange[0], customRange[1]]);

	for (let i = 0; i < numBins; i++) {
		colorBins[i] = linearColorScale(i+1);
	}

	return colorBins;
}