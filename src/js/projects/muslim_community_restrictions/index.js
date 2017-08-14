import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	category: {"variable":"category", "displayName":"Category", "format": "string", "scaleType":"categorical"},
	state: {"variable":"state", "displayName":"State", "format": "string"},
	state_id: {"variable":"state_id", "displayName":"State id", "format": "string"},
	description: {"variable":"description", "displayName":"Description", "format": "string"},
	date: {"variable":"date", "displayName":"Date", "format": "date"},
	incidents_total: {"variable":"incidents_total", "displayName":"All Incidents", "format": "number", "scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.turquoise.light, colors.turquoise.dark]},
	incidents_anti_sharia: {"variable":"incidents_anti_sharia", "displayName":"Anti-Sharia Incidents", "format": "number", "scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.blue.light, colors.blue.dark]},
	incidents_anti_refugee: {"variable":"incidents_anti_refugee", "displayName":"Anti-Refugee Incidents", "format": "number", "scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.purple.light, colors.purple.dark]},
	incidents_anti_construction: {"variable":"incidents_anti_construction", "displayName":"Anti-Construction Incidents", "format": "number", "scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.red.light, colors.red.dark]},
	incidents_elected_official: {"variable":"incidents_elected_official", "displayName":"Elected Official Incidents", "format": "number", "scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.turquoise.light, colors.turquoise.dark]},
	incidents_other: {"variable":"incidents_other", "displayName":"Other Incidents", "format": "number", "scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.turquoise.light, colors.turquoise.dark]},

}


let vizSettingsList = [
	// {
	// 	id: "#muslim-community-restrictions__states-map", 
	// 	vizType: "topo_json_map",
	// 	primaryDataSheet: "states",
	// 	filterVars: [ variables.incidents_total, variables.incidents_anti_sharia, variables.incidents_anti_refugee, variables.incidents_anti_construction, variables.incidents_elected_official, variables.incidents_other],
	// 	geometryType: "states",
	// 	geometryVar: variables.state_id,
	// 	stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "3"},
	// 	filterGroupSettings: {"hidden": false},
	// 	tooltipVars: [ variables.state, variables.incidents_total, variables.incidents_anti_sharia, variables.incidents_anti_refugee, variables.incidents_anti_construction, variables.incidents_elected_official, variables.incidents_other],
	// 	legendSettings: {"orientation": "vertical-right", "showTitle": true},
	// 	addSmallStateInsets: true
	// },
	{
		id: "#muslim-community-restrictions__states-map", 
		vizType: "dashboard",
		layoutRows: [
			[
				{
					vizType: "topo_json_map",
					primaryDataSheet: "states",
					width: "70%",
					filterVars: [ variables.incidents_total, variables.incidents_anti_sharia, variables.incidents_anti_refugee, variables.incidents_anti_construction, variables.incidents_elected_official, variables.incidents_other],
					geometryType: "states",
					geometryVar: variables.state_id,
					stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "3"},
					filterGroupSettings: {"hidden": false},
					// tooltipVars: [ variables.state, variables.incidents_total, variables.incidents_anti_sharia, variables.incidents_anti_refugee, variables.incidents_anti_construction, variables.incidents_elected_official, variables.incidents_other],
					legendSettings: {"orientation": "horizontal-center", "showTitle": true},
					addSmallStateInsets: true,
					isMessagePasser: true,
					interaction: "click",
				},
				{
					vizType: "content_stream",
					primaryDataSheet: "incidents",
					defaultText: "Click on a state to view incidents for that state.",
					width: "30%",
					isMessagePasser: false,
					messageHandlerType: "change_value",
					idVar: variables.state,
					showCurrFilterVal: true
				}
			],
		]
	}
]

const reactVizSettingsList = [
	// {
	// 	id: "#muslim-community-restrictions__dot-chart", 
	// 	vizType: "dot_chart",
	// 	primaryDataSheet: "incidents",
	// 	filterVar: variables.category,
	// 	colorVar: variables.category,
	// 	tooltipVars: [variables.category, variables.state, variables.description, variables.date]
	// },
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/muslimdiaspora/muslim_community_restrictions.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/1t5lGCzrBMkvkb6zCfXQsQ9Kwqomvj_YzWRvfnS75vTs/",
	dataSheetNames:["incidents", "states"],
	vizSettingsList: vizSettingsList,
	reactVizSettingsList: reactVizSettingsList
}

setupProject(projectSettings);

	