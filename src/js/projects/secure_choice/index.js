import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	state_id: {"variable":"state_id", "displayName":"State Id", "format": "number", "scaleType":"quantize", "customRange":[colors.white, colors.blue.light, colors.blue.dark], "numBins":5},
	state: {"variable":"state", "displayName":"State", "format": "string"},
	state_abbrev: {"variable":"state_abbrev", "displayName":"State", "format": "string"},
	access_percent: {"variable":"access_percent", "displayName":"Access (%)", "format": "percent", "category":"Access", "scaleType":"quantize", "customRange":[colors.white, colors.turquoise.light, colors.turquoise.dark], "numBins":5},
	access_rank: {"variable":"access_rank", "displayName":"Access Rank", "format": "rank", "category":"Access", "scaleType":"quantize", "customRange":[colors.white, colors.blue.light, colors.blue.dark], "numBins":5},
	participation_percent: {"variable":"participation_percent", "displayName":"Participation (%)", "format": "percent", "category":"Participation", "scaleType":"quantize", "customRange":[colors.white, colors.blue.light, colors.blue.dark], "numBins":5},
	participation_rank: {"variable":"participation_rank", "displayName":"Participation Rank", "format": "rank", "category":"Participation", "scaleType":"quantize", "customRange":[colors.white, colors.black.light, colors.black.dark], "numBins":5},
	uncovered_workers: {"variable":"uncovered_workers", "displayName":"Uncovered Full-Time, Full-Year, Private-Sector Wage and Salary Workers", "format": "number", "category":"Uncovered Workers", "scaleType":"quantize", "customRange":[colors.white, colors.red.light, colors.red.dark], "numBins":5},
	state_medicaid_savings_millions: {"variable":"state_medicaid_savings_millions", "displayName":"State Medicaid Savings (Millions)", "format": "price", "category":"Medicaid Savings", "scaleType":"quantize", "customRange":[colors.white, colors.purple.light, colors.purple.dark], "numBins":5},
}

let vizSettingsList = [
	{
		id: "#secure-choice__map", 
		vizType: "tabbed_chart_layout",
		primaryDataSheet: "rankings",
		chartSettingsList: [
			{
				vizType: "topo_json_map",
				geometryType: "states",
				geometryVar: variables.state_id,
				stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "3"},
				filterVars: [ variables.access_percent, variables.participation_percent, variables.uncovered_workers, variables.state_medicaid_savings_millions],
				tooltipVars: [ variables.state, variables.access_percent, variables.access_rank, variables.participation_percent, variables.participation_rank, variables.uncovered_workers, variables.state_medicaid_savings_millions],
				legendSettings: {"orientation": "vertical-right", "showTitle": true},
				filterGroupSettings: {"hidden": false},
				defaultFill: colors.grey.medium_light,
				addSmallStateInsets: false,
			},
			{
				vizType: "table",
				tableVars: [ variables.state, variables.access_percent, variables.participation_percent, variables.uncovered_workers, variables.state_medicaid_savings_millions],
				defaultOrdering: [0, "asc"],
				pagination: true,
				numPerPage: 25,
				colorScaling: false
			}
		]
	}
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/fcsp/secure_choice.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/1Jrydxi2YogGtj8QlQUu6q-48YOJXz0WArany2-goC_M/",
	dataSheetNames:["rankings"],
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);

	