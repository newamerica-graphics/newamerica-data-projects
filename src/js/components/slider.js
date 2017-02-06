import $ from 'jquery';

import { formatValue } from "../helper_functions/format_value.js";

let d3 = require("d3");

require('waypoints/lib/noframework.waypoints.js');

let margin = {right: 50, left: 50};

let animationButtonPaths = {pause: "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26",
	play: "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28"};

export class Slider {
	constructor(componentSettings) {
		let { id, filterChangeFunction, primaryDataSheet, variable, automated, showAllButton, startStopFunction } = componentSettings;
		this.id = id;
		this.primaryDataSheet = primaryDataSheet;
		this.variable = variable.variable;
		this.filterChangeFunction = filterChangeFunction;
		this.startStopFunction = startStopFunction;

		this.animationState = automated ? "playing" : "paused";

		this.h = 30;

		this.containerDiv = d3.select(this.id)
			.append("div")
			.attr("class", "slider-div");

		this.svg = this.containerDiv
			.append("svg");

		this.animationButton = this.svg.append("path")
			.style("fill", "grey")
			.style("cursor", "pointer")
			.attr("d", automated ? animationButtonPaths.pause : animationButtonPaths.play)
			.on("click", () => { return this.toggleAnimation(this.currAnimationVal); });

		this.slider = this.svg.append("g")
		    .attr("class", "slider")
		    .attr("transform", "translate(0," + this.h / 2 + ")");

		this.scale = d3.scaleLinear()
			.clamp(true);

		this.axis = this.slider.append("g")
			.attr("class", "x axis")

		this.w = $(this.id).width();

		this.track = this.slider.append("line")
		    .attr("class", "slider__track")
		    .attr("x1", margin.left)
		    .attr("x2", (this.w - margin.right));

		this.handle = this.slider.insert("circle", ".track-overlay")
		    .attr("class", "slider__handle")
		    .attr("r", 9)
		    .attr("cx", margin.left);

		if(showAllButton) {
			this.containerDiv
				.classed("has-show-all", true);

			this.showAll = d3.select(this.id)
				.append("div")
				.attr("class", "button show-all-button")
				.text("Show All")
				.on("click", () => { filterChangeFunction("all"); });
		}
	}

	setDimensions() {
		this.w = $(this.id + " > .slider-div").width();
		
		this.svg
			.attr("width", "100%")
			.attr("height", this.h + 30);

		this.scale
			.range([margin.left, this.w - margin.right]);

		this.track
			.attr("x1", this.scale.range()[0])
		    .attr("x2", this.scale.range()[1])

		let numTicks = this.w > 500 ? 10 : 5;

		let axis = d3.axisBottom(this.scale)
			.ticks(numTicks, "f")
			.tickPadding(10)
			.tickSize(10);

		this.axis.call(axis);

		this.handle.attr("cx", this.scale(this.sliderVal));
		this.currAnimationVal = this.scale(this.sliderVal);
	}

	render(data) {
		this.data = data[this.primaryDataSheet];
		let dataExtents = d3.extent(this.data, (d) => { return Number(d[this.variable]) != 0 ? Number(d[this.variable]) : null; });
		this.scale.domain([dataExtents[0], dataExtents[1]]);
		this.sliderVal = dataExtents[0];

		console.log(this.data);
		console.log(dataExtents);
		this.setDimensions();
		this.currAnimationVal = this.scale.range()[0];
 
		this.track.call(d3.drag()
	        .on("start.interrupt", () => { this.slider.interrupt(); })
	        .on("start drag", () => { this.animationState == "playing" ? this.toggleAnimation(d3.event.x) : null; this.dragEvent(d3.event.x); }));
	    	// .on("end", () => { this.endEvent(d3.event.x); }));

		this.handle.call(d3.drag()
	        .on("start.interrupt", () => { this.slider.interrupt(); })
	        .on("start drag",() => { this.dragEvent(d3.event.x); }));
	        // .on("end", () => { this.endEvent(d3.event.x); }));
		
		console.log(d3.selectAll(".tick > text"));
		d3.selectAll(".slider .tick > text")
			.style("cursor", "pointer")
			.on("click", (d) => {
				this.sliderVal = d;
				this.handle.attr("cx", this.scale(d));
				this.filterChangeFunction(this.sliderVal);
			})
	}

	dragEvent(newX) {
		newX = newX < this.scale.range()[0] ? this.scale.range()[0] : newX;
		newX = newX > this.scale.range()[1] ? this.scale.range()[1] : newX;
		this.handle.attr("cx", newX);
		this.sliderVal = Math.floor(this.scale.invert(newX));
		this.filterChangeFunction(this.sliderVal, this);
		this.currAnimationVal = newX;
	}

	endEvent(newX) {
		this.sliderVal = Math.round(this.scale.invert(newX));
		this.handle.attr("cx", this.scale(this.sliderVal));
		this.filterChangeFunction(this.sliderVal, this);
		this.currAnimationVal = newX;
	}

	toggleAnimation(newAnimationVal) {
		console.log("toggling animation " + this.animationState + " " + this.currAnimationVal);

		if (this.animationState == "playing") {
			this.animationState = "paused";
			this.currAnimationVal = newAnimationVal;
			console.log("stopping animation " + this.animationState + " " + this.currAnimationVal);
			window.clearInterval(this.intervalFunction);
			
			this.animationButton
				.transition()
				.duration(75)
				.attr("d", animationButtonPaths.play);
			console.log("resting state " + this.animationState + " " + this.currAnimationVal);
		} else {
			this.animationState = "playing";
			this.currAnimationVal = newAnimationVal;
			console.log("starting animation " + this.animationState + " " + this.currAnimationVal);
			let interval = 7000/this.w;
			this.intervalFunction = window.setInterval(() => {
				if (this.currAnimationVal >= this.scale.range()[1]) {
					this.toggleAnimation(this.scale.range()[0]);
					return;
				}
				this.dragEvent(this.currAnimationVal);
				this.currAnimationVal++;
			}, interval);

			this.animationButton
				.transition()
				.duration(75)
				.attr("d", animationButtonPaths.pause);
		}

		console.log("done toggling animation " + this.animationState + " " + this.currAnimationVal);
		this.startStopFunction(this.animationState);
	}

	addAnimationTrigger() {
		// let id = this.id.replace("#", "");
		// let waypoint = new Waypoint({
		//   element: document.getElementById(id),
		//   offset: '50%',
		//   handler: () => {
		//     console.log(this);
		//     this.animationState = "paused";
		// 	this.toggleAnimation(this.scale.range()[0])
		// 	waypoint.destroy();
		//   }
		// });
	}
	
	resize() {
		this.setDimensions();
		// halts animation when resized
		this.animationState == "playing" ? this.toggleAnimation(this.currAnimationVal) : null;
	}

}