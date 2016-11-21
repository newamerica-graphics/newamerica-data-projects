import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";

let variables = {
	id: {"variable": "id", "displayName":"ID", "format":"number"},
	name: {"variable": "name", "displayName":"Country", "format":"string"},
	exports_to: {"variable": "exports_to", "displayName":"Exports to", "format":"string"},
	imports_from: {"variable": "imports_from", "displayName":"Imports from", "format":"string"},
	domestic_production: {"variable": "domestic_production", "displayName":"Domestic Production", "format":"string", "scaleType":"categorical", "customRange":[colors.grey.light, colors.turquoise.light]},
}

let vizSettingsList = [
	// {
	// 	id: "#world-of-drones__import-export", 
	// 	vizType: "bipartite",
	// 	primaryDataSheet: "countries",
	// 	keyVar: variables.name,
	// 	leftVar: variables.exports_to,
	// 	rightVar: variables.imports_from,
	// },
	{
		id: "#world-of-drones__domestic-production", 
		vizType: "us_map",
		primaryDataSheet: "countries",
		geometryType: "world",
		stroke: {"color": "white", "width":"1", "opacity": "1", "hoverColor": colors.black, "hoverWidth": "2"},
		defaultFill: colors.grey.light,
		geometryVar: variables.id,
		filterVars: [variables.domestic_production],
		tooltipVars: [variables.name, variables.domestic_production],
		legendSettings: {"orientation": "horizontal-center", "showTitle": true, "disableValueToggling": true},
		zoomable: false,
	},
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/isp/wod-military.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/1RptooWTfZbDEtlqNUb_GiqI6ihQubWUHffE9hbfht9k/",
	dataSheetNames:["countries"],
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);