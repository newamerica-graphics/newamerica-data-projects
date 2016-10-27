import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	year: {"variable":"year", "displayName":"Year", "format":"year"},
	event_category: {"variable":"event_category", "displayName":"Event Category", "format":"string", "scaleType":"categorical", "customDomain":["Drought", "Wildfire", "Flooding", "Freeze", "Winter Storm", "Severe Storm", "Tropical Cyclone"], "customRange":[colors.red.light, colors.red.medium, colors.blue.light, colors.blue.medium, colors.blue.dark, colors.purple.light, colors.turquoise.light]},
	event_name: {"variable":"event_name", "displayName":"Event Name", "format":"string"},
	begin_date: {"variable":"begin_date", "displayName":"Begin Date", "format":"string"},
	end_date: {"variable":"end_date", "displayName":"End Date", "format":"string"},
	states: {"variable":"states", "displayName":"States Affected", "format":"string"},
	info_link: {"variable":"info_link", "displayName":"Info Link", "format":"string"},
	cpi_adjusted_cost: {"variable":"cpi_adjusted_cost", "displayName":"CPI Adjusted Cost (Billions)", "format":"string", "scaleType":"logarithmic", "customRange":[colors.grey.light, colors.grey.dark], "numBins":20},

	fema_fips: {"variable":"fips", "displayName":"County Fips", "format":"number"},
	fema_county_name: {"variable":"county_name", "displayName":"County", "format":"string"},
	fema_all: {"variable":"all", "displayName":"All", "format":"number", "scaleType":"linear"},
	fema_other: {"variable":"other", "displayName":"Other", "format":"number", "scaleType":"linear"},
	fema_flood: {"variable":"flood", "displayName":"Flood", "format":"number", "scaleType":"linear"},
	fema_severe_ice_storm: {"variable":"severe_ice_storm", "displayName":"Severe Ice Storm", "format":"number", "scaleType":"linear"},
	fema_severe_storms: {"variable":"severe_storms", "displayName":"Severe Storm(s)", "format":"number", "scaleType":"linear"},
	fema_snow: {"variable":"snow", "displayName":"Snow", "format":"number", "scaleType":"linear"},
	fema_tornado: {"variable":"tornado", "displayName":"Tornado", "format":"number", "scaleType":"linear"},
	fema_fire: {"variable":"fire", "displayName":"Fire", "format":"number", "scaleType":"linear"},
	fema_hurricane: {"variable":"hurricane", "displayName":"Hurricane", "format":"number", "scaleType":"linear"},
}

let vizSettingsList = [
	// {
	// 	id: "#extreme-weather__county-by-year", 
	// 	vizType: "us_counties_map",
	// 	primaryDataSheet: "county_by_year",
	// 	secondaryDataSheet: "events",
	// 	// filterVars: [ variables.availability_total_norm ],
	// 	// tooltipVars: [ variables.state, variables.availability_total_norm]
	// },
	// {
	// 	id: "#extreme-weather__county-by-year", 
	// 	vizType: "bar_chart",
	// 	primaryDataSheet: "events",
	// 	xVars: [ variables.year ],
	// 	yScaleType: "count",
	// 	yAxisLabelText: "Number of Disasters",
	// 	// filterVars: [ variables.availability_total_norm ],
	// 	// tooltipVars: [ variables.state, variables.availability_total_norm]
	// },
	// {
	// 	id: "#extreme-weather__events-by-year", 
	// 	vizType: "dot_histogram",
	// 	primaryDataSheet: "events",
	// 	groupingVars: [ variables.year ],
	// 	filterVars: [ variables.cpi_adjusted_cost ],
	// 	tooltipVars: [ variables.event_name, variables.event_category, variables.begin_date, variables.end_date, variables.cpi_adjusted_cost, variables.states ],
	// 	labelSettings: { interval: 5 }
	// },
	// {
	// 	id: "#extreme-weather__counties_map", 
	// 	vizType: "us_counties_map",
	// 	primaryDataSheet: "county_by_year",
	// 	secondaryDataSheet: "events",
	// 	filterVars: [variables.event_category],
	// 	tooltipVars: [variables.event_name, variables.event_category, variables.begin_date, variables.end_date, variables.cpi_adjusted_cost, variables.states ],
	// },
	{
		id: "#extreme-weather__fema-declarations", 
		vizType: "us_map",
		primaryDataSheet: "fema_declarations",
		geometryType: "counties",
		hasStroke: false,
		geometryVar: variables.fema_fips,
		filterVars: [variables.fema_all, variables.fema_fire, variables.fema_flood, variables.fema_hurricane, variables.fema_severe_ice_storm, variables.fema_severe_storms, variables.fema_snow, variables.fema_tornado, variables.fema_other],
		tooltipVars: [variables.fema_county_name, variables.fema_fips, variables.fema_all, variables.fema_fire, variables.fema_flood, variables.fema_hurricane, variables.fema_severe_ice_storm, variables.fema_severe_storms, variables.fema_snow, variables.fema_tornado, variables.fema_other],
		legendSettings: {"orientation": "horizontal-center", "customTitleExpression": "<<>> Declarations"}
	},
	// {
	// 	id: "#extreme-weather__county-by-year", 
	// 	vizType: "dashboard",
	// 	chartSettingsList: [
	// 		{
	// 			vizType: "dot_histogram",
	// 			isMessagePasser: true,
	// 			primaryDataSheet: "events",
	// 			groupingVars: [ variables.year ],
	// 			filterVars: [ variables.cpi_adjusted_cost ],
	// 			tooltipVars: [ variables.event_name, variables.event_category, variables.begin_date, variables.end_date, variables.cpi_adjusted_cost, variables.states ],
	// 			labelSettings: { interval: 5 }
	// 		},
	// 		{
	// 			vizType: "us_counties_map",
	// 			primaryDataSheet: "county_by_year",
	// 			secondaryDataSheet: "events",
	// 			filterVars: [variables.event_category],
	// 			tooltipVars: [variables.event_name, variables.event_category, variables.begin_date, variables.end_date, variables.cpi_adjusted_cost, variables.states ],
	// 		}
	// 	]
	// },
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/resourcesecurity/extreme_weather.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/18WEcJVDByP5bCPACgt2s9-sYIOItweq9fI9PCMIpUjY/",
	dataSheetNames:["events", "county_by_year", "fema_declarations"],
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);

