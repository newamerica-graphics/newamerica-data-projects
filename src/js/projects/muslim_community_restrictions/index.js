import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	category: {"variable":"category", "displayName":"Category", "format": "string", "scaleType":"categorical", "customDomain":["Anti-Sharia Legislation", "Anti-Refugee Legislation and Actions", "Opposition to Mosques, Muslim Cemeteries, and Islamic Schools", "Anti-Muslim Actions by Elected or Appointed Officials", "Anti-Muslim Hate Incidents"], "customRange":[colors.brown.light, colors.purple.light, colors.orange.light, colors.red.light, colors.blue.light]},
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
	incidents_anti_sharia: {"variable":"incidents_anti_sharia", "displayName":"Anti-Sharia Legislation", "format": "number", "filterVal": "Anti-Sharia Legislation","scaleType": "quantize", "numBins":3, "customRange":[colors.white, colors.orange.light, colors.orange.dark]},
	incidents_anti_refugee: {"variable":"incidents_anti_refugee", "displayName":"Anti-Refugee Legislation and Actions", "format": "number", "filterVal": "Anti-Refugee Legislation and Actions","scaleType": "quantize", "numBins":3, "customRange":[colors.white, colors.purple.light, colors.purple.dark]},
	incidents_anti_construction: {"variable":"incidents_anti_construction", "displayName":"Opposition to Mosques, Muslim Cemeteries, and Islamic Schools", "format": "number", "filterVal": "Opposition to Mosques, Muslim Cemeteries, and Islamic Schools","scaleType": "quantize", "numBins":2, "customRange":[colors.white, colors.brown.light, colors.brown.dark]},
	incidents_elected_official: {"variable":"incidents_elected_official", "displayName":"Anti-Muslim Actions by Elected or Appointed Officials", "format": "number", "filterVal": "Anti-Muslim Actions by Elected or Appointed Officials","scaleType": "quantize", "numBins":3, "customRange":[colors.white, colors.red.light, colors.red.dark]},
	incidents_hate: {"variable":"incidents_hate", "displayName":"Anti-Muslim Hate Incidents", "format": "number", "filterVal": "Anti-Muslim Hate Incidents","scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.blue.light, colors.blue.dark]},
	per_capita_total: {"variable":"per_capita_total", "displayName":"All Incidents", "format": "number_with_decimal_2", "filterVal": null, "scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.turquoise.light, colors.turquoise.dark]},
	per_capita_anti_sharia: {"variable":"per_capita_anti_sharia", "displayName":"Anti-Sharia Legislation", "format": "number_with_decimal_2", "filterVal": "Anti-Sharia Legislation","scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.orange.light, colors.orange.dark]},
	per_capita_anti_refugee: {"variable":"per_capita_anti_refugee", "displayName":"Anti-Refugee Legislation and Actions", "format": "number_with_decimal_2", "filterVal": "Anti-Refugee Legislation and Actions","scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.purple.light, colors.purple.dark]},
	per_capita_anti_construction: {"variable":"per_capita_anti_construction", "displayName":"Opposition to Mosques, Muslim Cemeteries, and Islamic Schools", "format": "number_with_decimal_2", "filterVal": "Opposition to Mosques, Muslim Cemeteries, and Islamic Schools","scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.brown.light, colors.brown.dark]},
	per_capita_elected_official: {"variable":"per_capita_elected_official", "displayName":"Anti-Muslim Actions by Elected or Appointed Officials", "format": "number_with_decimal_2", "filterVal": "Anti-Muslim Actions by Elected or Appointed Officials","scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.red.light, colors.red.dark]},
	per_capita_hate: {"variable":"per_capita_hate", "displayName":"Anti-Muslim Hate Incidents", "format": "number_with_decimal_2", "filterVal": "Anti-Muslim Hate Incidents","scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.blue.light, colors.blue.dark]},
	per_capita_muslim_total: {"variable":"per_capita_muslim_total", "displayName":"All Incidents", "format": "number_with_decimal_2", "filterVal": null, "scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.turquoise.light, colors.turquoise.dark]},
	per_capita_muslim_anti_sharia: {"variable":"per_capita_muslim_anti_sharia", "displayName":"Anti-Sharia Legislation", "format": "number_with_decimal_2", "filterVal": "Anti-Sharia Legislation","scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.orange.light, colors.orange.dark]},
	per_capita_muslim_anti_refugee: {"variable":"per_capita_muslim_anti_refugee", "displayName":"Anti-Refugee Legislation and Actions", "format": "number_with_decimal_2", "filterVal": "Anti-Refugee Legislation and Actions","scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.purple.light, colors.purple.dark]},
	per_capita_muslim_anti_construction: {"variable":"per_capita_muslim_anti_construction", "displayName":"Opposition to Mosques, Muslim Cemeteries, and Islamic Schools", "format": "number_with_decimal_2", "filterVal": "Opposition to Mosques, Muslim Cemeteries, and Islamic Schools","scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.brown.light, colors.brown.dark]},
	per_capita_muslim_elected_official: {"variable":"per_capita_muslim_elected_official", "displayName":"Anti-Muslim Actions by Elected or Appointed Officials", "format": "number_with_decimal_2", "filterVal": "Anti-Muslim Actions by Elected or Appointed Officials","scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.red.light, colors.red.dark]},
	per_capita_muslim_hate: {"variable":"per_capita_muslim_hate", "displayName":"Anti-Muslim Hate Incidents", "format": "number_with_decimal_2", "filterVal": "Anti-Muslim Hate Incidents","scaleType": "quantize", "numBins":5, "customRange":[colors.white, colors.blue.light, colors.blue.dark]},
}


let vizSettingsList = [
	{
		id: "#muslim-community-restrictions__states-map",
		vizType: "dashboard",
		layoutRows: [
			[
				{
					vizType: "topo_json_map",
					primaryDataSheet: "states",
					width: "70%",
					filterVars: [ variables.incidents_total, variables.incidents_anti_sharia, variables.incidents_anti_refugee, variables.incidents_anti_construction, variables.incidents_elected_official, variables.incidents_hate],
					geometryType: "states",
					geometryVar: variables.state_id,
					stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "3"},
					filterGroupSettings: {"hidden": false},
					// tooltipVars: [ variables.state, variables.incidents_total, variables.incidents_anti_sharia, variables.incidents_anti_refugee, variables.incidents_anti_construction, variables.incidents_elected_official],
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
		id: "#muslim-community-restrictions__states-table",
		vizType: "table",
		primaryDataSheet: "states",
		tableVars: [ variables.state, variables.incidents_total, variables.incidents_anti_sharia, variables.incidents_anti_refugee, variables.incidents_anti_construction, variables.incidents_elected_official, variables.incidents_hate],
		defaultOrdering: [1, "desc"],
		pagination: true,
		numPerPage: 20,
		colorScaling: false
	},
	{
		id: "#muslim-community-restrictions__per-capita-states-map",
		vizType: "topo_json_map",
		primaryDataSheet: "states",
		filterVars: [ variables.per_capita_total, variables.per_capita_anti_sharia, variables.per_capita_anti_refugee, variables.per_capita_anti_construction, variables.per_capita_elected_official, variables.per_capita_hate],
		geometryType: "states",
		geometryVar: variables.state_id,
		stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "3"},
		filterGroupSettings: {"hidden": false},
		tooltipVars: [ variables.state, variables.per_capita_total, variables.per_capita_anti_sharia, variables.per_capita_anti_refugee, variables.per_capita_anti_construction, variables.per_capita_elected_official, variables.per_capita_hate],
		legendSettings: {"orientation": "horizontal-center", "showTitle": true},
		addSmallStateInsets: true,
		defaultFill: colors.grey.light,
		mouseoverOnlyIfValue: true
	},
	{
		id: "#muslim-community-restrictions__per-capita-muslim-states-map",
		vizType: "topo_json_map",
		primaryDataSheet: "states",
		filterVars: [ variables.per_capita_muslim_total, variables.per_capita_muslim_anti_sharia, variables.per_capita_muslim_anti_refugee, variables.per_capita_muslim_anti_construction, variables.per_capita_muslim_elected_official, variables.per_capita_muslim_hate],
		geometryType: "states",
		geometryVar: variables.state_id,
		stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "3"},
		filterGroupSettings: {"hidden": false},
		tooltipVars: [ variables.state, variables.per_capita_muslim_total, variables.per_capita_muslim_anti_sharia, variables.per_capita_muslim_anti_refugee, variables.per_capita_muslim_anti_construction, variables.per_capita_muslim_elected_official, variables.per_capita_muslim_hate],
		legendSettings: {"orientation": "horizontal-center", "showTitle": true},
		addSmallStateInsets: true,
		defaultFill: colors.grey.light,
		mouseoverOnlyIfValue: true
	},
]

const reactVizSettingsList = [
	{
		id: "#muslim-community-restrictions__time-dot-chart", 
		vizType: "dot_chart",
		primaryDataSheet: "incidents",
		colorSettings: { colorVar: variables.category, showLegend: true },
		tooltipTitleVar: variables.title,
		tooltipVars: [variables.state, variables.category, variables.date, variables.description],
		dotSettings: {scaleFactor: 150, maxRadius: 3.75, spacing: 1},
		interaction: "mouseover",
		layouts: [
			{
				label: "Incidents Over Time",
				layout: "histogram",
				annotationSheet:"timeline_annotations"
			},
			{
				label: "Incidents by State",
				layout: "category",
				categoryVar: variables.state,
				leftMargin: 120
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

	