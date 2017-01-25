import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	country: {"variable":"country", "displayName":"Country", "format": "string"},
	year: {"variable":"year", "displayName":"Year", "format": "year"},
	total_avg: {"variable":"total_avg", "displayName":"Total Average", "format": "number", "color": colors.turquoise.light},
	civilians_avg: {"variable":"civilians_avg", "displayName":"Civilians Average", "format": "number", "color": colors.turquoise.light},
	unknown_avg: {"variable":"unknown_avg", "displayName":"Unknown Average", "format": "number", "color": colors.blue.light},
	militants_avg: {"variable":"militants_avg", "displayName":"Militants Average", "format": "number", "color": colors.purple.light},

}

let vizSettingsList = [
	{
		id: "#drone-strikes__casualties", 
		vizType: "stacked_bar",
		primaryDataSheet: "strike_data",
		xVar: variables.year,
		filterVars: [ variables.militants_avg, variables.unknown_avg, variables.civilians_avg ],
		legendSettings: {"orientation": "horizontal-center", "showTitle": false, "disableValueToggling": false},
		xAxisLabelInterval: {"small": 10, "medium": 5, "large": 2},
		labelValues: false,
		showYAxis: true,
		hasTrendline: false,
		tooltipVars: [ variables.year, variables.militants_avg, variables.unknown_avg, variables.civilians_avg ],
		eventSettings: {
			"mouseover":{ "tooltip": true, "fill": colors.turquoise.medium, "stroke": false }
		}
	},
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/isp/drone-strikes.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/11uMYLFFk8sEbYNIOrX3ENRdgCWxttKdYQ6b8hUW-XbI/",
	dataSheetNames:["strike_data"],
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);

