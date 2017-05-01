import $ from 'jquery';
let d3 = require("d3");


import { colors } from "../helper_functions/colors.js";

import { formatValue } from "../helper_functions/format_value.js";

import { getColorScale } from "../helper_functions/get_color_scale.js";

import { Tooltip } from "../components/tooltip.js";

const categoryYPadding = 10,
	textWidth = 200;

export class CategoryBreakdown {
	constructor(vizSettings, imageFolderId) {
		Object.assign(this, vizSettings);
	
		this.chartContainer = d3.select(this.id)
			.append("div")
			.attr("class", "category-breakdown");

		this.currFilter = this.filterVars[0];
		this.currFilterVar = this.filterVars[0].variable;

		

		// let tooltipSettings = { "id":id, "tooltipVars":tooltipVars, tooltipImageVar:"tooltipImageVar", "imageFolderId":imageFolderId, "tooltipScrollable":tooltipScrollable };
		// this.tooltip = new Tooltip(tooltipSettings);
	}

	render(data) {
		this.setScale(data[this.primaryDataSheet]);
		this.data = this.getDataNest(data[this.primaryDataSheet]);
		console.log(this.data);
		this.setDimensions();
		

		this.buildGraph();
		// this.sortData();
		

		// this.buildGraph();
		
		// if (!this.isSubComponent) {
		// 	this.setLegend();
		// }
		
	}

	getDataNest(data) {
		data = data.filter((d) => { return d[this.currFilterVar] != null });

		let finalData = [];
		if (this.currFilter.canSplitCategory) {
			data.forEach((d) => {
				let splitPieces = d[this.currFilterVar].split("; ");
				if (splitPieces.length > 1) {
					for (let key of splitPieces) {
						let dupedDataPt = Object.assign({}, d);
						dupedDataPt[this.currFilterVar] = key;
						finalData.push(dupedDataPt);
					}
				} else {
					finalData.push(d);
				}
			})
		} else {
			finalData = data;
		}

		let nestedData = d3.nest()
			.key((d) => {
				return d[this.currFilterVar];
			})
			.sortKeys((a, b) => { return this.colorScale.domain().indexOf(a) - this.colorScale.domain().indexOf(b); })
			.entries(finalData);

		return nestedData;
	}

	setScale(data) {
		this.colorScale = getColorScale(data, this.currFilter);
	}

	setDimensions() {
		this.w = $(this.id).width() - textWidth;
		this.numPerRow = Math.floor(this.w/(this.dotSettings.width + this.dotSettings.offset));

		// this.h = this.setCategoryYTransforms();
		
		// this.dotsPerCol = Math.ceil(this.dataLength/numCols);

		// this.h = this.dotsPerCol * (this.dotSettings.width + this.dotSettings.offset);		
		// this.svg
		// 	.attr("height", this.h);
		
	}

	setCategoryYTransforms() {
		this.categoryYTransforms = [];
		let currY = this.dotSettings.width/2;
		let numRows;
		for (let category of this.data) {
			this.categoryYTransforms.push(currY);
			numRows = Math.floor(category.values.length/this.numPerRow);
			currY += categoryYPadding + numRows*(this.dotSettings.width + this.dotSettings.offset);
		}

		return currY;
	}

	buildGraph() {

		this.categoryContainers = this.chartContainer.selectAll("div")
			.data(this.data)
			.enter().append("div")
			.attr("class", "category-breakdown__category-container");
			// .attr("transform", (d, i) => { return "translate(0," + this.categoryYTransforms[i] + ")"; })

		this.textContainers = this.categoryContainers.append("div")
			.attr("class", "category-breakdown__text")
			
		this.textContainers.append("h3")
			.attr("class", "category-breakdown__text__heading")
			.text((d) => { return d.key; });
		
		this.textContainers.append("h5")
			.attr("class", "category-breakdown__text__subheading")
			// .attr("transform", "translate(0,30)")
			.text((d) => { return d.values.length + " states"; });


		this.dataContainers = this.categoryContainers
			.append("div")
			.attr("class", "category-breakdown__data-container")
			.append("svg")
			.attr("class", "category-breakdown__data")
			.attr("width", "100%")
			.attr("height", (d) => {
				let numRows = Math.ceil(d.values.length/this.numPerRow);
				return numRows*(this.dotSettings.width + this.dotSettings.offset) + categoryYPadding;
			})
			// .attr("transform", "translate(" + (textWidth + this.dotSettings.width/2) + ")")

		this.dataG = this.dataContainers.selectAll("g")
			.data((d) => { return d.values; })
			.enter().append("g")
			.attr("transform", (d, i) => { return "translate(" + this.calcX(i) + "," + this.calcY(i) + ")"; })
			.on("mouseover", (d) => { return this.mouseover(d); })
		    .on("mouseout", () => { return this.mouseout(); })
		    .on("click", (d) => { return this.eventSettings.click && this.eventSettings.click.handlerFunc ? this.eventSettings.click.handlerFunc(d.id) : null; });

		this.dataCircles = this.dataG.append("circle")
			.attr("class", "category-breakdown__data__circle")
			.attr("id", (d, i) => { return i; })
			.attr("cx", this.dotSettings.width/2)
			.attr("cy", this.dotSettings.width/2)
			.attr("r", this.dotSettings.width/2)
			.attr("fill", "white")
			.attr("stroke", (d) => { return this.colorScale(d[this.currFilterVar]); })

		this.dataCircleText = this.dataG.append("text")
			.attr("class", "category-breakdown__data__label")
			.attr("id", (d, i) => { return i; })
			.attr("x", this.dotSettings.width/2)
			.attr("y", this.dotSettings.width/2)
			.attr("fill", (d) => { return this.colorScale(d[this.currFilterVar]); })
			.text((d) => { return d[this.labelVar.variable]; });

		// this.cells = this.svg.selectAll("rect")
		// 	.data(data)
		// 	.enter().append("rect")
		// 	.attr("width", this.dotSettings.width)
		//     .attr("height", this.dotSettings.width)
		//     .attr("x", (d, i) => { return this.calcX(d, i); })
		//     .attr("y", (d, i) => { return this.calcY(i); })
		//     .attr("fill", (d) => {
		//     	return this.colorScale(d[this.currFilterVar]);
		//     })
		//     .style("cursor", this.eventSettings.click ? "pointer" : "auto")
		//     .attr("class", (d) => { return d[this.currFilterVar]; })
		//     .on("mouseover", (d, index, paths) => { return this.mouseover(d, paths[index], d3.event); })
		//     .on("mouseout", (d, index, paths) => { return this.mouseout(paths[index]); })
		//     .on("click", (d) => { return this.eventSettings.click && this.eventSettings.click.handlerFunc ? this.eventSettings.click.handlerFunc(d.id) : null; });
	}

	calcX(i) {
		return (i%this.numPerRow)*(this.dotSettings.width + this.dotSettings.offset) + 2;
	}

	calcY(i) {
		return Math.floor(i/this.numPerRow)*(this.dotSettings.width + this.dotSettings.offset) + 2; 
	}

	sortData() {
		if (this.currFilter.scaleType === "linear" || this.currFilter.scaleType === "logarithmic" || this.currFilter.scaleType === "quantize") {
			this.data.sort((a, b) => { return Number(b[this.currFilterVar]) - Number(a[this.currFilterVar]);});
		} else if (this.currFilter.scaleType === "categorical") {
			if (this.currFilter.customDomain) {
				this.data.sort((a, b) => {
					let elem1 = this.currFilter.customDomain.indexOf(a[this.currFilterVar]);
					let elem2 = this.currFilter.customDomain.indexOf(b[this.currFilterVar]);

					if (elem1 == -1) {
						return 1;
					}
					if (elem2 == -1) {
						return -1;
					}

					if (elem1 < elem2) {
					    return -1;
					} else if (elem1 > elem2) {
						return 1;
					} else {
						return 0;
					}
				});
			} else {
				this.data.sort((a, b) => { 
					let elem1 = a[this.currFilterVar];
					let elem2 = b[this.currFilterVar];

					if (!elem1) {
						return 1;
					}

					if (!elem2) {
						return -1;
					}

					if (elem1 < elem2) {
					    return -1;
					} else if (elem1 > elem2) {
						return 1;
					} else {
						return 0;
					}
				});
			}
		}
	}

	resize() {
		this.setDimensions();

		this.dataContainers
			.attr("height", (d) => {
				let numRows = Math.ceil(d.values.length/this.numPerRow);
				return numRows*(this.dotSettings.width + this.dotSettings.offset) + categoryYPadding;
			})

		this.dataG
			.attr("transform", (d, i) => { return "translate(" + this.calcX(i) + "," + this.calcY(i) + ")"; })
	}

	mouseover(hovered) {
		this.dataCircles
			.attr("fill", (d) => {
				if (d.state_id == hovered.state_id) {
					return this.colorScale(d[this.currFilterVar]);
				} else {
					return "white";
				}
		    });

		this.dataCircleText
			.attr("fill", (d) => {
				if (d.state_id == hovered.state_id) {
					return "white";
				} else {
					return this.colorScale(d[this.currFilterVar]);
				}
		    });
	}

	mouseout() {
		this.dataCircles
			.attr("fill", "white");

		this.dataCircleText
			.attr("fill", (d) => { return this.colorScale(d[this.currFilterVar]); });
	}

}