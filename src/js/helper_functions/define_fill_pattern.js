export function defineFillPattern(values, id, colorScale, defContainer, type) {
	let color1 = colorScale(values[0].trim()),
		color2 = colorScale(values[1].trim());

	if (type == "polygon") {
		let pattern = defContainer
			.append("pattern")
				.attr("id", "pattern" + id)
				.attr("width", "10")
				.attr("height", "10")
				.attr("patternUnits", "userSpaceOnUse")
				.attr("patternTransform", type == "polygon" ? "rotate(45)" : "rotate(0)");

		pattern.append("rect")
			.attr("width", "5")
			.attr("height", "10")
			.attr("transform", "translate(0,0)")
			.attr("fill", color1)
			.attr("stroke", type == "polygon" ? "none" : "white")

		pattern.append("rect")
			.attr("width", "5")
			.attr("height", "10")
			.attr("transform", "translate(5,0)")
			.attr("fill", color2);
	} else {
		let grad = defContainer.append("linearGradient")
				.attr("id", "pattern" + id)
              	.attr("x1", "100%")
              	.attr("x2", "0%")
              	.attr("y1", "0%")
              	.attr("y2", "0%");
			
		grad.append("stop")
			.attr("offset", "40%")
			.style("stop-color", color1)

		grad.append("stop")
			.attr("offset", "50%")
			.style("stop-color", "white")

		grad.append("stop")
			.attr("offset", "40%")
			.style("stop-color", color2);
	}

	return defContainer;
}