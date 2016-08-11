import $ from 'jquery';
import Tabletop from 'tabletop';

import {usStates} from '../../geography/us-states.js';

let d3 = require("d3");

let colorScale;


export class usStatesMap {
	constructor(id, w) {
		this.id = id;

		this.svg = d3.select(id)
					.append("svg");

		this.setDimensions(w);
	}

	setDimensions(w) {
		console.log(w);
		this.w = w;
		this.h = w/2;

		this.svg
			.attr("width", this.w)
			.attr("height", this.h);

		//Define map projection
		let projection = d3.geoAlbersUsa()
				.scale(this.w)
				.translate([this.w/2, this.h/2]);

		//Define path generator
		this.pathGenerator = d3.geoPath()
						 .projection(projection);
	}

	initialRender() {
		console.log("in initial render");
		let self = this;
		
		d3.json("https://na-data-projects.s3.amazonaws.com/data/test/ag.json", function(d) {
			console.log(d);
			self.buildGraph(d.Sheet1);
		});
	}

	buildGraph(data) {
		console.log("rendering");

		//Define quantize scale to sort data values into buckets of color
		colorScale = d3.scaleQuantize()
			.domain([
				d3.min(data, function(d) { return d.value; }), 
				d3.max(data, function(d) { return d.value; })
			])
			.range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);

		for (var i = 0; i < data.length; i++) {
			//Grab state name
			var dataState = data[i].state;
			//Grab data value, and convert from string to float
			var dataValue = parseFloat(data[i].value);
			//Find the corresponding state inside the GeoJSON
			for (var j = 0; j < usStates.features.length; j++) {
				var jsonState = usStates.features[j].properties.name;
				if (dataState == jsonState) {
					//Copy the data value into the JSON
					usStates.features[j].properties.value = dataValue;
					//Stop looking through the JSON
					break;
				}
			}		
		}
		// Bind data and create one path per GeoJSON feature
		this.paths = this.svg.selectAll("path")
		   .data(usStates.features)
		   .enter()
		   .append("path");

		this.paths.attr("d", this.pathGenerator)
		    .style("fill", function(d) {
		   		var value = d.properties.value;
		   		return value ? colorScale(value) : "#ccc";
		    }.bind(this))
		    .on("mouseover", this.mouseover)
		    .on("mouseout", this.mouseout);
	}

	updateDimensions(w) {
		this.setDimensions(w);
		this.paths.attr("d", this.pathGenerator);
	}

	mouseover() {
		d3.select(this).style("fill", "orange");
	}

	mouseout() {
		d3.select(this).style("fill", function(d) {
	   		var value = d.properties.value;
	   		return value ? colorScale(value) : "#ccc";
	    });
	}
			
}