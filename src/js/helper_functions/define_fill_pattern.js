

export function defineFillPattern(values, id, colorScale, defContainer) {
	let color1 = colorScale(values[0]),
		color2 = colorScale(values[1]);

	let pattern = defContainer
		.append("pattern")
			.attr("id", "pattern" + id)
			.attr("width", "10")
			.attr("height", "10")
			.attr("patternUnits", "userSpaceOnUse")
			.attr("patternTransform", "rotate(45)");

	pattern.append("rect")
		.attr("width", "5")
		.attr("height", "10")
		.attr("transform", "translate(0,0)")
		.attr("fill", color1);
	pattern.append("rect")
		.attr("width", "5")
		.attr("height", "10")
		.attr("transform", "translate(5,0)")
		.attr("fill", color2);

	return defContainer;
}