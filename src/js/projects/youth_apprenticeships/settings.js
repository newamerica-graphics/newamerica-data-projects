let { colors } = require("../../helper_functions/colors.js")

let variables = {
	state_id: {"variable":"state_id", "displayName":"State Id"},
	state: {"variable":"state", "displayName":"State", "format": "string"},
	state_abbrev: {"variable":"state_abbrev", "displayName":"State", "format": "string"},
	state_category: {"variable":"state_category", "displayName":"Category", "format": "string", "scaleType":"categorical", "customDomain":["Leader State", "Featured State"], "customRange":[colors.turquoise.light, colors.blue.light]},
	program_type: {"variable":"program_type", "displayName":"Program Type", "format": "string"},
	program_desc_1: {"variable":"program_desc_1", "displayName":"Program Description", "format": "string"},
}

let vizSettings = {
	"youth-apprenticeships__state-map": {
		vizType: "topo_json_map",
		primaryDataSheet: "states",
		geometryType: "states",
		geometryVar: variables.state_id,
		stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "1", hoverOpacity: ".6"},
		filterVars: [ variables.state_category],
		tooltipVars: [ variables.state, variables.program_type, variables.program_desc_1],
		defaultFill: colors.grey.medium_light,
		legendSettings: {"orientation": "vertical-right", "showTitle": false},
		addSmallStateInsets: false,
		filterGroupSettings: {"hidden": true},
		clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/youth-apprenticeships/state-profile/?" }
	},
}

module.exports = {
	vizSettings: vizSettings,
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/edpolicy/apprenticeships_state_scan.json",
	downloadableSheets: ["states"]
}
