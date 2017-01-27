import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	country: {"variable":"country", "displayName":"Country", "format": "string"},
	year: {"variable":"year", "displayName":"Year", "format": "year"},
	total_avg: {"variable":"total_avg", "displayName":"Total Average", "format": "number", "color": colors.turquoise.light},
	civilians_avg: {"variable":"civilians_avg", "displayName":"Civilians", "format": "number", "color": colors.turquoise.light},
	unknown_avg: {"variable":"unknown_avg", "displayName":"Unknown", "format": "number", "color": colors.blue.light},
	militants_avg: {"variable":"militants_avg", "displayName":"Militants", "format": "number", "color": colors.purple.light},
	president: {"variable":"president", "displayName":"President", "format": "string"},
	president_bush: {"variable":"president_bush", "displayName":"Bush", "format": "number", "color": colors.red.light},
	president_obama: {"variable":"president_obama", "displayName":"Obama", "format": "number", "color": colors.blue.light},
	president_trump: {"variable":"president_trump", "displayName":"Trump", "format": "number", "color": colors.red.dark},
	target_organization_name: {"variable":"target_organization_name", "displayName":"Target Organization", "format": "string", "scaleType":"categorical"},
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
		showYAxis: true,
		tooltipTitleVar: variables.year,
	},
	{
		id: "#drone-strikes__strikes-by-president", 
		vizType: "stacked_bar",
		primaryDataSheet: "strike_data",
		xVar: variables.year,
		filterVars: [ variables.president_bush, variables.president_obama, variables.president_trump ],
		legendSettings: {"orientation": "horizontal-center", "showTitle": false, "disableValueToggling": false},
		xAxisLabelInterval: {"small": 10, "medium": 5, "large": 2},
		showYAxis: true,
		tooltipTitleVar: variables.year,
	},
	{
		id: "#drone-strikes__targets", 
		vizType: "percentage_stacked_bar",
		primaryDataSheet: "strike_data",
		groupingVar: variables.president,
		filterVar: variables.target_organization_name,
		// legendSettings: {"orientation": "horizontal-center", "showTitle": false, "disableValueToggling": false},
	},
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/isp/drone-strikes.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/11uMYLFFk8sEbYNIOrX3ENRdgCWxttKdYQ6b8hUW-XbI/",
	dataSheetNames:["strike_data"],
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);

