let { colors } = require("../../helper_functions/colors.js")

let variables = {
	title: {"variable":"title", "displayName":"Title", "format": "string"},
	url: {"variable":"url", "displayName":"Url", "format": "string"},
	date: {"variable":"date", "displayName":"Date", "format": "date"},
	description: {"variable":"description", "displayName":"Description", "format": "string"},
	image_url: {"variable":"image_url", "displayName":"Image Url", "format": "string"},
	state_id: {"variable":"state_id", "displayName":"State ID", "format": "string"},
	show_on_map: {"variable":"show_on_map", "displayName":"Show On Map", "format": "string", "scaleType":"categorical", "customDomain":["0", "1"], "customRange":[colors.grey.light, colors.turquoise.light]},
	city: {"variable":"city", "displayName":"city", "format": "string"},
}

let vizSettings = {
	"dll-work-group__map": { 
		vizType: "dashboard",
		layoutRows: [
			[
				{
					vizType: "topo_json_map",
					primaryDataSheet: "states",
					width: "100%",
					filterVars: [ variables.show_on_map ],
					geometryType: "states",
					geometryVar: variables.state_id,
					stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "3"},
					filterGroupSettings: {"hidden": false},
					isMessagePasser: true,
					interaction: "click",
					addSmallStateInsets: true,
					defaultFill: colors.grey.light
				}
			],
			[
				{
					vizType: "content_stream",
					primaryDataSheet: "dll_work",
					defaultText: "Since its founding in 2014, the Dual Language Learners National Work Group has conducted a significant amount of research in — and on — diverse communities across the country. This sort of place-based reporting is critical. It allows us to highlight new policy reforms as well as promising teaching practices for supporting DLLs' linguistic and academic development.",
					width: "100%",
					isMessagePasser: false,
					messageHandlerType: "change_value",
					linkVar: variables.url,
					dateVar: variables.date,
					hasColorOutline: false
				}
			],
		]
	}
}

module.exports = {
	vizSettings: vizSettings,
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/edpolicy/dll_work_group.json"
}
