this.slider = this.renderingArea.append("g")
		    .attr("class", "slider")
		    .attr("transform", "translate(0," + this.h + ")")

		this.sliderLine = this.slider.append("line")
		    .attr("class", "track")
		    .attr("x1", this.xScale.range()[0])
		    .attr("x2", this.xScale.range()[1])
		  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
		    .attr("class", "track-inset")
		  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
		    .attr("class", "track-overlay")
		    .attr("pointer-events", "stroke");

		this.handle = this.slider.insert("rect", ".track-overlay")
		    .attr("width", this.xScale.bandwidth())
			.attr("height", 20)
			.attr("fill", "green")
			.attr("y", -10)
			.attr("x", this.xScale(this.currSelected))
			.style("cursor", "pointer")
			.call(d3.drag()
		        .on("start.interrupt", () => { this.slider.interrupt(); })
		        .on("start drag", () => {
					var index = Math.floor(d3.event.x / this.xScale.step());
					if (index >= this.xScale.domain().length) {
						index = this.xScale.domain().length - 1;
					} else if (index < 0) {
						index = 0;
					}
					var val = this.xScale.domain()[index];
		        	this.handle.attr("x", this.xScale(val));
		        	this.setCurrSelected(val);
		        	this.filterChangeFunction(val);
		        }));;