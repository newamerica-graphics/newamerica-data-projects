import $ from 'jquery';

let d3 = require("d3");

let margin = {top: 20, right: 20, bottom: 30, left: 50};
    // width = 960 - margin.left - margin.right,
    // height = 500 - margin.top - margin.bottom;

export class StepChart {
	constructor(vizSettings) {
		let {id, tooltipVars, filterVars, primaryDataSheet} = vizSettings;
		console.log(id);
		this.id = id;
		this.svg = d3.select(id).append("svg");

		this.renderingArea = this.svg.append("g");

		this.setDimensions();

		this.xScale = d3.scaleTime();
		this.yScale = d3.scaleLinear();

		this.setScales();
		this.setLineScaleFunction();
		
	}

	render() {
		var parseTime = d3.timeParse("%d-%b-%y");



		d3.tsv("./src/js/chart_types/sampleData.tsv", type, (error, data) => {
		  if (error) throw error;
		  
		  this.xScale.domain(d3.extent(data, function(d) { return d.date; }));
		  this.yScale.domain(d3.extent(data, function(d) { return d.close; }));


		  console.log(this.xScale.domain());

		  this.xAxis = this.renderingArea.append("g")
		      .attr("class", "axis axis--x")
		      .attr("transform", "translate(0," + this.h + ")")
		      .call(d3.axisBottom(this.xScale));

		 this.yAxis = this.renderingArea.append("g")
		      .attr("class", "axis axis--y")
		      .call(d3.axisLeft(this.yScale));

		    this.yAxis.append("text")
		      .attr("class", "axis-title")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("Price ($)");

		  var dataNest = d3.nest()
	        .key(function(d) {return d.color;})
	        .entries(data);

	        this.dataLines = [];

	        dataNest.forEach((d) => {
	       		let dataLine = this.renderingArea.append("path")
					.datum(d.values)
					.attr("class", "line")
					.attr("d", this.line);

			    this.dataLines.push(dataLine);
		    })

		  	console.log(this.dataLines);
		});

		function type(d) {
		  d.date = parseTime(d.date);
		  d.close = +d.close;
		  return d;
		}
	}

	setDimensions() {
		this.w = $(this.id).width() - margin.left - margin.right;
		this.h = this.w/2 - margin.top - margin.bottom;

		this.svg
			.attr("width", this.w + margin.left + margin.right)
		    .attr("height", this.h + margin.top + margin.bottom);

		this.renderingArea
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	}

	setScales() {
		this.xScale.range([0, this.w]);

		this.yScale.range([this.h, 0]);

	}

	setLineScaleFunction() {
		console.log(this.xScale.domain());
		this.line = d3.line()
		    .x((d) => { return this.xScale(d.date); })
		    .y((d) => { return this.yScale(d.close); });

		this.line.curve(d3.curveStepAfter);
	}

	resize() {
		this.setDimensions();
		this.setScales();
		this.setLineScaleFunction();

		this.xAxis
			.attr("transform", "translate(0," + this.h + ")")
			.call(d3.axisBottom(this.xScale));
		this.yAxis.call(d3.axisLeft(this.yScale));


		for (let dataLine of this.dataLines) {
			// console.log(this.line);
			dataLine.attr("d", this.line);

		}
	}


}