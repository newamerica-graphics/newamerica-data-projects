import $ from 'jquery';

import { formatValue } from "../helper_functions/format_value.js";
import { colors } from "../helper_functions/colors.js";

let d3 = require("d3");

require('waypoints/lib/noframework.waypoints.js');

let margin = {right: 20, left: 20};

let valueDisplayWidth = 100;

// let animationButtonPaths = {pause: "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26",
// 	play: "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28"};

let animationButtonIcons = {
	showAll:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 71.55 27.34"><defs><style>.background{fill:#fff;stroke:#b3b3b3;stroke-miterlimit:10;stroke-width:0.75px;}.foreground,.cls-6,.cls-7{font-size:13px;fill:#999;font-family:SimplonBP-Medium, Simplon BP;}.foreground{letter-spacing:0.09em;}.cls-3{letter-spacing:0.08em;}.cls-4{letter-spacing:0.09em;}.cls-5{letter-spacing:0.07em;}.cls-6{letter-spacing:0.08em;}.cls-7{letter-spacing:0.1em;}.cls-8{letter-spacing:0.1em;}.cls-9{letter-spacing:0.08em;}</style></defs><title>show_all</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_2-2" data-name="Layer 2"><rect class="background" x="0.37" y="0.38" width="70.8" height="26.59" rx="13.29" ry="13.29"/><text class="foreground" transform="translate(12.32 16.96) scale(0.7)">S<tspan class="cls-3" x="8.33" y="0">H</tspan><tspan class="cls-4" x="17.87" y="0">O</tspan><tspan class="cls-5" x="26.91" y="0">W</tspan></text><text class="cls-6" transform="translate(38.61 16.96)"> </text><text class="cls-7" transform="translate(42.43 16.96) scale(0.7)">A<tspan class="cls-8" x="9.31" y="0">L</tspan><tspan class="cls-9" x="17.05" y="0">L</tspan></text></g></g></svg>',
	play: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.51 26.51"><defs><style>.background{fill:#fff;stroke:#b3b3b3;}.background,.foreground{stroke-miterlimit:10;stroke-width:0.75px;}.foreground{fill:none;stroke:#999;}</style></defs><title>play</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_2-2" data-name="Layer 2"><circle class="background" cx="13.25" cy="13.25" r="12.88"/><polygon class="foreground" points="17.69 13.25 11.04 9.41 11.04 17.09 17.69 13.25"/></g></g></svg>',
	pause: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.51 26.51"><defs><style>.background,.foreground{fill:#fff;stroke-miterlimit:10;stroke-width:0.75px;}.background{stroke:#b3b3b3;}.foreground{stroke:#999;}</style></defs><title>pause</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_2-2" data-name="Layer 2"><circle class="background" cx="13.25" cy="13.25" r="12.88"/><rect class="foreground" x="14.44" y="9.82" width="2.38" height="6.86"/><rect class="foreground" x="9.69" y="9.82" width="2.38" height="6.86"/></g></g></svg>',
}

export class Slider {
	constructor(componentSettings) {
		Object.assign(this, componentSettings);

		this.animationState = this.automated ? "playing" : "paused";

		this.h = 30;

		let buttonContainer = d3.select(this.id)
			.append("div")
			.attr("class", "slider__button-container");

		this.containerDiv = d3.select(this.id)
			.append("div")
			.attr("class", "slider-div");

		this.valueDisplay = d3.select(this.id)
			.append("div")
			.attr("class", "slider__value-display");
		
		if(this.showAllButton) {
			this.containerDiv
				.classed("has-show-all", true);

			this.showAll = buttonContainer
				.append("div")
				.attr("class", "slider__button show-all selected")
				.html(animationButtonIcons.showAll)
				.on("click", () => { 
					this.showAll.classed("selected", true); 
					this.handle.classed("hidden", true); 
					this.changeValueDisplay("All");
					this.toggleAnimation(this.scale.range()[0], "pause");
					this.filterChangeFunction("all"); 
				});
		}

		this.animationButton = buttonContainer
			.append("div")
			.attr("class", "slider__button play-pause")
			.html(this.automated ? animationButtonIcons.pause : animationButtonIcons.play)
			// .text(this.automated ? "Pause" : "Play")
			.on("click", () => { this.handle.classed("hidden", false); return this.toggleAnimation(this.currAnimationVal); });

		this.svg = this.containerDiv
			.append("svg")
			.attr("class", "slider")
			
		this.slider = this.svg.append("g")
			.attr("transform", "translate(0, 20)");

		this.scale = d3.scaleLinear()
			.clamp(true);

		this.axis = this.slider.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0, 15)")

		this.w = $(this.id).width();

		this.track = this.slider.append("line")
		    .attr("class", "slider__track")
		    .style("stroke-width", 6)
		    .attr("x1", margin.left)
		    .attr("x2", (this.w - margin.right));

		if (this.trackColors) {
			this.trackColorBars = this.slider.selectAll("line.slider__track-color-bar")
				.data(this.trackColors)
				.enter().append("line")
			    .attr("class", "slider__track-color-bar")
			    .attr("stroke", (d) => { return d.color })
			    .style("stroke-width", 6);
		}

		this.handle = this.slider.insert("circle", ".track-overlay")
		    .attr("class", "slider__handle hidden")
		    .attr("r", 9)
		    .attr("cx", margin.left);
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

		if (this.trackColorBars) {
			this.trackColorBars
				.attr("x1", (d) => { return d.domain[0] ? this.scale(d.domain[0]) : this.scale.range()[0]; })
				.attr("x2", (d) => { return d.domain[1] ? this.scale(d.domain[1]) : this.scale.range()[1]; })
		}

		let numTicks = this.w > 600 ? 15 : 5;

		let axis = d3.axisBottom(this.scale)
			.ticks(numTicks, "f")
			.tickPadding(3)
			.tickSizeInner(5)
			.tickSizeOuter(0);

		this.axis.call(axis);

		this.handle.attr("cx", this.scale(this.sliderVal));
		this.currAnimationVal = this.scale(this.sliderVal);
	}

	render(data) {
		if ($.isArray(data)) {
			this.data = data
		} else {
			this.data = data[this.primaryDataSheet];
		}
		
		let dataExtents = d3.extent(this.data, (d) => { return Number(d[this.sliderVar.variable]) != 0 ? Number(d[this.sliderVar.variable]) : null; });
		this.scale.domain([dataExtents[0], dataExtents[1]]);
		this.sliderVal = dataExtents[0];

		this.setDimensions();
		this.currAnimationVal = this.scale.range()[0];

		this.changeValueDisplay("All");
 
		this.track.call(d3.drag()
	        .on("start.interrupt", () => { this.slider.interrupt(); })
	        .on("start drag", () => { this.showAll ? this.showAll.classed("selected", false) : null; this.handle.classed("hidden", false); this.animationState == "playing" ? this.toggleAnimation(d3.event.x) : null; this.dragEvent(d3.event.x); }));
	    	// .on("end", () => { this.endEvent(d3.event.x); }));

		this.handle.call(d3.drag()
	        .on("start.interrupt", () => { this.slider.interrupt(); })
	        .on("start drag",() => { this.showAll ? this.showAll.classed("selected", false) : null; this.handle.classed("hidden", false); this.dragEvent(d3.event.x); }));
	        // .on("end", () => { this.endEvent(d3.event.x); }));
		
		this.containerDiv.selectAll(".slider .tick > text")
			.style("cursor", "pointer")
			.on("click", (d) => {
				let newXVal = this.scale(d);
				this.showAll ? this.showAll.classed("selected", false) : null;
				this.handle.classed("hidden", false);
				this.sliderVal = d;
				this.changeValueDisplay(this.sliderVal);
				this.handle.attr("cx", newXVal);
				this.currAnimationVal = newXVal;
				this.filterChangeFunction(this.sliderVal, this);
				this.animationState == "playing" ? this.toggleAnimation(newXVal, "pause") : null;
			})
	}

	dragEvent(newX) {
		newX = newX < this.scale.range()[0] ? this.scale.range()[0] : newX;
		newX = newX > this.scale.range()[1] ? this.scale.range()[1] : newX;
		this.handle.attr("cx", newX);
		this.sliderVal = Math.floor(this.scale.invert(newX + 1));
		this.changeValueDisplay(this.sliderVal);
		this.filterChangeFunction(this.sliderVal, this);
		this.currAnimationVal = newX;
	}

	endEvent(newX) {
		this.sliderVal = Math.round(this.scale.invert(newX + 1));
		this.changeValueDisplay(this.sliderVal);
		this.handle.attr("cx", this.scale(this.sliderVal));
		this.filterChangeFunction(this.sliderVal, this);
		this.currAnimationVal = newX;
	}

	toggleAnimation(newAnimationVal, forceState) {
		if (this.animationState == "playing" || forceState == "pause") {
			this.animationState = "paused";
			this.currAnimationVal = newAnimationVal;
			window.clearInterval(this.intervalFunction);
			
			this.animationButton
				.html(animationButtonIcons.play)
		} else {
			this.animationState = "playing";
			this.currAnimationVal = newAnimationVal;
			if (this.currAnimationVal >= this.scale.range()[1]) {
				this.currAnimationVal = this.scale.range()[0];
			}
			let interval = 7000/this.w;

			this.intervalFunction = window.setInterval(() => {
				if (this.currAnimationVal >= this.scale.range()[1]) {
					if (this.automated) {
						this.toggleAnimation(this.scale.range()[1], "pause");
					} else {
						this.showAll ? this.showAll.classed("selected", true) : null;
						this.filterChangeFunction("all", this);
						this.handle.classed("hidden", true);
						this.changeValueDisplay("All");
						this.toggleAnimation(this.scale.range()[0]);
					}
					
					return;
				}
				this.dragEvent(this.currAnimationVal);
				this.currAnimationVal++;
			}, interval);

			this.animationButton
				.html(animationButtonIcons.pause)

			this.showAll ? this.showAll.classed("selected", false) : null;
			this.handle.classed("hidden", false);
		}
	}

	addAnimationTrigger() {
		let id = this.id.replace("#", "");
		let waypoint = new Waypoint({
		  element: document.getElementById(id),
		  offset: '50%',
		  handler: () => {
		    this.animationState = "paused";
			this.toggleAnimation(this.scale.range()[0])
			waypoint.destroy();
		  }
		});
	}

	changeValueDisplay(value) {
		if (this.trackColors && value != "All") {
			let currColor = colors.grey.medium;
			this.trackColors.forEach((d) => {
				if ((!d.domain[0] || value >= d.domain[0]) && (!d.domain[1] || value <= d.domain[1])) {
					currColor = d.color;
				}
			})
			this.valueDisplay.style("color", currColor);
		} else {
			this.valueDisplay.style("color", colors.grey.medium);
		}
		this.valueDisplay.text(value);
	}
	
	resize() {
		this.setDimensions();
		// halts animation when resized
		this.animationState == "playing" ? this.toggleAnimation(this.currAnimationVal) : null;
	}

}