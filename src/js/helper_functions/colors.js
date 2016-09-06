export var colors = {
	"turquoise":{ "light": "#2EBCB3", "medium": "#1A8A84", "dark": "#005753"},
	"blue": { "light": "#5BA4DA", "medium": "#4378A0","dark": "#234A67"},
	"red": { "light": "#E75C64", "medium": "#74557E","dark": "#692025"},
	"purple": { "light": "#A076AC", "medium": "#A64046","dark": "#48304F"},
	"grey": { "light": "#EAEAEB", "medium_light":"#CBCBCD" ,"medium": "#ABACAE","dark": "#2C2F35"}
}

export function getDefaultColor(code) {
	return colors[code].light;
}