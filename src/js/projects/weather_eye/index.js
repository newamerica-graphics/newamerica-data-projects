import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	type: {"variable":"type", "displayName":"Type", "format": "string", "scaleType":"categorical", "customDomain":["Flood", "Tornado", "Snow/ Ice Storm", "Severe Weather", "Drought"], "customRange":[colors.turquoise.light, colors.blue.light, colors.purple.light, colors.red.light, colors.orange.light]},
	fema_description: {"variable":"fema_description", "displayName":"FEMA Description", "format": "string"},
	end_date: {"variable":"end_date", "displayName":"End Date", "format": "date"},
	start_date: {"variable":"start_date", "displayName":"Start Date", "format": "date"}, 
	year: {"variable":"year", "displayName":"Year", "format": "year"}, 
	month: {"variable":"month", "displayName":"Month", "format": "number"}, 

	category: {"variable":"category", "displayName":"Category", "format": "string"}, 
}


let vizSettingsList = [

]

const reactVizSettingsList = [
	{
		id: "#weather-eye__st-louis", 
		vizType: "dot_chart",
		primaryDataSheet: "st_louis",
		colorSettings: { colorVar: variables.type, showLegend: true },
		tooltipTitleVar: variables.type,
		tooltipVars: [variables.fema_description, variables.start_date, variables.end_date],
		dotSettings: {scaleFactor: 80, maxRadius: 15, spacing: 2},
		interaction: "mouseover",
		layouts: [
			{
				label: "Storm Events by Year",
				layout: "histogram_fixed_interval",
				xVar: variables.year,
				sortingVar: variables.start_date
			},
			{
				label: "Storm Events by Month",
				layout: "histogram_fixed_interval",
				xVar: variables.month,
				sortingVar: variables.start_date
			},
			{
				label: "Storm Events by Type",
				layout: "category",
				categoryVar: variables.type,
				leftMargin: 130
			}
		]
	},
	{
		id: "#weather-eye__findings", 
		vizType: "quote_scroller",
		primaryDataSheet: "storm_quotes",
		categoryDescriptionSheet: "storm_quotes_category_descriptions",
		categoryVar: variables.category
	},			
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/resourcesecurity/weather-eye.json",
	dataSheetNames:["st_louis", "walsh", "caddo", "essex", "tulsa", "cumberland", "storm_quotes", "storm_quotes_category_descriptions"],
	vizSettingsList: vizSettingsList,
	reactVizSettingsList: reactVizSettingsList
}

setupProject(projectSettings);
	