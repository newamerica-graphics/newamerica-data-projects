export var colors = {
	"turquoise":{ "light": "#2EBCB3", "dark": "#005753"},
	"blue": { "light": "#5BA4DA","dark": "#234A67"},
	"red": { "light": "#E75C64","dark": "#692025"},
	"purple": { "light": "#A076AC","dark": "#48304F"}
}

export function getDefaultColor(code) {
	return colors[code].light;
}