import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";

let variables = {
	name: {"variable": "name", "displayName":"Country", "format":"string"},
	exports_to: {"variable": "exports_to", "displayName":"Exports to", "format":"string"},
	imports_from: {"variable": "imports_from", "displayName":"Imports from", "format":"string"},
}

let vizSettingsList = [
	{
		id: "#world-of-drones__import-export", 
		vizType: "bipartite",
		primaryDataSheet: "countries",
		keyVar: variables.name,
		leftVar: variables.exports_to,
		rightVar: variables.imports_from,

		// dotSettings: { "width": 10, "offset": 3, "dotsPerRow": 5},
		// distanceBetweenGroups: 15,
		// groupingVars: [ variables.year_charged_or_deceased ],
		// filterVars: [ variables.charged_or_deceased ],
		// tooltipVars: [ variables.full_name, variables.charged_or_deceased, variables.date_charged, variables.terror_plot],
		// tooltipImageVar: variables.headshot,
		// labelSettings: { interval: 1, showNumVals: true},
		// legendSettings: {"orientation": "horizontal-center"},
		// eventSettings: {
		// 	"mouseover":{ "tooltip": true, "fill": false, "stroke": "white", "strokeWidth": 3},
		// }
	}
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/isp/wod-military.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/1RptooWTfZbDEtlqNUb_GiqI6ihQubWUHffE9hbfht9k/",
	dataSheetNames:["countries"],
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);