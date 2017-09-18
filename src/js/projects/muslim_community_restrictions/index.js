import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	category: {"variable":"category", "displayName":"Category", "format": "string", "scaleType":"categorical", "customDomain":["Anti-Sharia Legislation", "Anti-Refugee Legislation", "Opposition to mosque, cemetery, and Islamic school construction", "Anti-Muslim actions by elected or appointed officials", "Anti-Muslim hate crimes", "Other"], "customRange":[colors.brown.light, colors.purple.light, colors.orange.light, colors.red.light, colors.blue.light, colors.yellow.light]},
	state: {"variable":"state", "displayName":"State", "format": "string"},
	title: {"variable":"title", "displayName":"Title", "format": "string"},
	description: {"variable":"description", "displayName":"Description", "format": "string"},
	date: {"variable":"date", "displayName":"Date", "format": "date"},
	processed_date: {"variable":"processed_date", "displayName":"Date", "format": "date_simple"},
	sources_combined: {"variable":"sources_combined", "displayName":"Sources", "format": "link"},

	state_id: {"variable":"state_id", "displayName":"State id", "format": "string"},
	population_total: {"variable":"population_total", "displayName":"Total Population", "format": "number"},
	population_muslim: {"variable":"population_muslim", "displayName":"Estimated Muslim Population", "format": "number"},
	incidents_total: {"variable":"incidents_total", "displayName":"All Incidents", "format": "number", "filterVal": null, "scaleType": "quantize", "numBins":4, "customRange":[colors.white, colors.turquoise.light, colors.turquoise.dark]},
	incidents_anti_sharia: {"variable":"incidents_anti_sharia", "displayName":"Anti-Sharia Incidents", "format": "number", "filterVal": "Anti-Sharia Legislation","scaleType": "quantize", "numBins":3, "customRange":[colors.white, colors.orange.light, colors.orange.dark]},
	incidents_anti_refugee: {"variable":"incidents_anti_refugee", "displayName":"Anti-Refugee Incidents", "format": "number", "filterVal": "Anti-Refugee Legislation","scaleType": "quantize", "numBins":3, "customRange":[colors.white, colors.purple.light, colors.purple.dark]},
	incidents_anti_construction: {"variable":"incidents_anti_construction", "displayName":"Anti-Construction Incidents", "format": "number", "filterVal": "Opposition to mosque, cemetery, and Islamic school construction","scaleType": "quantize", "numBins":3, "customRange":[colors.white, colors.brown.light, colors.brown.dark]},
	incidents_elected_official: {"variable":"incidents_elected_official", "displayName":"Elected Official Incidents", "format": "number", "filterVal": "Anti-Muslim actions by elected or appointed officials","scaleType": "quantize", "numBins":3, "customRange":[colors.white, colors.red.light, colors.red.dark]},
	incidents_other: {"variable":"incidents_other", "displayName":"Other Incidents", "format": "number", "filterVal": "Other","scaleType": "quantize", "numBins":2, "customRange":[colors.white, colors.yellow.light, colors.yellow.dark]},
	incidents_hate: {"variable":"incidents_hate", "displayName":"Hate Incidents", "format": "number", "filterVal": "Anti-Muslim hate crimes","scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.blue.light, colors.blue.dark]},

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
		vizType: "tabbed_chart_layout",
		tabIcons: ["globe", "table"],
		chartSettingsList: [
			{
				vizType: "dashboard",
				layoutRows: [
					[
						{
							vizType: "topo_json_map",
							primaryDataSheet: "states",
							width: "70%",
							filterVars: [ variables.incidents_total, variables.incidents_anti_sharia, variables.incidents_anti_refugee, variables.incidents_anti_construction, variables.incidents_elected_official, variables.incidents_hate, variables.incidents_other],
							geometryType: "states",
							geometryVar: variables.state_id,
							stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "3"},
							filterGroupSettings: {"hidden": false},
							// tooltipVars: [ variables.state, variables.incidents_total, variables.incidents_anti_sharia, variables.incidents_anti_refugee, variables.incidents_anti_construction, variables.incidents_elected_official, variables.incidents_other],
							legendSettings: {"orientation": "horizontal-center", "showTitle": true},
							addSmallStateInsets: true,
							isMessagePasser: true,
							interaction: "click",
							defaultFill: colors.grey.light,
							mouseoverOnlyIfValue: true
						},
						{
							vizType: "content_stream",
							primaryDataSheet: "incidents",
							clickable: false,
							defaultFilter: variables.incidents_total,
							width: "30%",
							isMessagePasser: false,
							messageHandlerType: "change_value",
							idVar: variables.state,
							showCurrFilterVal: true, 
							filterVar: variables.category,
							additionalDataVars: [variables.population_total, variables.population_muslim]
						}
					],
				]
			},
			{
				vizType: "table",
				primaryDataSheet: "states",
				tableVars: [ variables.state, variables.incidents_total, variables.incidents_anti_sharia, variables.incidents_anti_refugee, variables.incidents_anti_construction, variables.incidents_elected_official, variables.incidents_hate, variables.incidents_other],
				defaultOrdering: [1, "desc"],
				pagination: true,
				numPerPage: 10,
				colorScaling: false
			}
		]
	}
]

const reactVizSettingsList = [
	{
		id: "#muslim-community-restrictions__time-dot-chart", 
		vizType: "dot_chart",
		primaryDataSheet: "incidents",
		colorVar: variables.category,
		tooltipTitleVar: variables.title,
		tooltipVars: [variables.state, variables.category, variables.date, variables.description],
		layouts: [
			{
				label: "Incidents Over Time",
				layout: "histogram",
				annotationSheet:"timeline_annotations"
			},
			{
				label: "Incidents by State",
				layout: "category"
			}
		]
	},		
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/muslimdiaspora/muslim_community_restrictions.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/1t5lGCzrBMkvkb6zCfXQsQ9Kwqomvj_YzWRvfnS75vTs/",
	dataSheetNames:["incidents", "states"],
	vizSettingsList: vizSettingsList,
	reactVizSettingsList: reactVizSettingsList
}

setupProject(projectSettings);

	