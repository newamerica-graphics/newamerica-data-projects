export var colors = {
	"turquoise":{ "very_light": "#97DED9", "light": "#2EBCB3", "medium": "#1A8A84", "dark": "#005753"},
	"blue": { "very_light":"#ADD2ED", "light": "#5BA4DA", "medium": "#4378A0","dark": "#234A67"},
	"red": { "light": "#E75C64", "medium": "#A64046","dark": "#692025"},
	"purple": { "very_light": "#bd9fc6","light": "#A076AC", "medium": "#74557E","dark": "#48304F"},
	"grey": { "light": "#EAEAEB", "medium_light":"#CBCBCD" ,"medium": "#ABACAE","dark": "#2C2F35"},
	"white": "#FFFFFF",
	"black": "#2c2f35"
}

export function getDefaultColor(code) {
	return colors[code].light;
}