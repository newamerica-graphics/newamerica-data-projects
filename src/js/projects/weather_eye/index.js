import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";

let variables = {
	type: {"variable":"type", "displayName":"Type", "format": "string", "scaleType":"categorical", "customDomain":["Tropical Storm", "Flood", "Snow/ Ice Storm", "Severe Weather", "Drought",  "Wildfire", "Tornado", "Hurricane"], "customRange":[colors.turquoise.light, colors.blue.light, colors.blue.dark, colors.purple.light, colors.red.light, colors.red.dark, colors.orange.light, colors.orange.dark]},
	fema_description: {"variable":"fema_description", "displayName":"FEMA Description", "format": "string"},
	end_date: {"variable":"end_date", "displayName":"End Date", "format": "date"},
	start_date: {"variable":"start_date", "displayName":"Start Date", "format": "date"}, 
	year: {"variable":"year", "displayName":"Year", "format": "year"}, 
	month: {"variable":"month", "displayName":"Month", "format": "number"}, 

	category: {"variable":"category", "displayName":"Category", "format": "string"}, 
}

const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


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
		dotScaleRange: [2, 6],
		interaction: "mouseover",
		layouts: [
			{
				label: "Storm Events by Year",
				layout: "histogram_fixed_interval",
				xVar: variables.year,
				sortingVar: variables.start_date,
				fixedStartVal: 1965
			},
			{
				label: "Storm Events by Month",
				layout: "histogram_fixed_interval",
				xVar: variables.month,
				sortingVar: variables.start_date,
				maxWidth: 600,
				axisLabelOverrideFunc: d => months[+d]
			},
			{
				label: "Storm Events by Type",
				layout: "category",
				categoryVar: variables.type,
				leftMargin: 130,
				catRowHeight: 25
			}
		]
	},
	{
		id: "#weather-eye__caddo", 
		vizType: "dot_chart",
		primaryDataSheet: "caddo",
		colorSettings: { colorVar: variables.type, showLegend: true },
		tooltipTitleVar: variables.type,
		tooltipVars: [variables.fema_description, variables.start_date, variables.end_date],
		dotScaleRange: [2, 5],
		interaction: "mouseover",
		layouts: [
			{
				label: "Storm Events by Year",
				layout: "histogram_fixed_interval",
				xVar: variables.year,
				sortingVar: variables.start_date,
				fixedStartVal: 1965
			},
			{
				label: "Storm Events by Month",
				layout: "histogram_fixed_interval",
				xVar: variables.month,
				sortingVar: variables.start_date,
				maxWidth: 600,
				axisLabelOverrideFunc: d => months[+d]
			},
			{
				label: "Storm Events by Type",
				layout: "category",
				categoryVar: variables.type,
				leftMargin: 130,
				catRowHeight: 25
			}
		]
	},
	{
		id: "#weather-eye__walsh", 
		vizType: "dot_chart",
		primaryDataSheet: "walsh",
		colorSettings: { colorVar: variables.type, showLegend: true },
		tooltipTitleVar: variables.type,
		tooltipVars: [variables.fema_description, variables.start_date, variables.end_date],
		dotScaleRange: [2, 6],
		interaction: "mouseover",
		layouts: [
			{
				label: "Storm Events by Year",
				layout: "histogram_fixed_interval",
				xVar: variables.year,
				sortingVar: variables.start_date,
				fixedStartVal: 1965
			},
			{
				label: "Storm Events by Month",
				layout: "histogram_fixed_interval",
				xVar: variables.month,
				sortingVar: variables.start_date,
				maxWidth: 600,
				axisLabelOverrideFunc: d => months[+d]
			},
			{
				label: "Storm Events by Type",
				layout: "category",
				categoryVar: variables.type,
				leftMargin: 130,
				catRowHeight: 25
			}
		]
	},
	{
		id: "#weather-eye__essex", 
		vizType: "dot_chart",
		primaryDataSheet: "essex",
		colorSettings: { colorVar: variables.type, showLegend: true },
		tooltipTitleVar: variables.type,
		tooltipVars: [variables.fema_description, variables.start_date, variables.end_date],
		dotScaleRange: [2, 6],
		interaction: "mouseover",
		layouts: [
			{
				label: "Storm Events by Year",
				layout: "histogram_fixed_interval",
				xVar: variables.year,
				sortingVar: variables.start_date,
				fixedStartVal: 1965
			},
			{
				label: "Storm Events by Month",
				layout: "histogram_fixed_interval",
				xVar: variables.month,
				sortingVar: variables.start_date,
				maxWidth: 600,
				axisLabelOverrideFunc: d => months[+d]
			},
			{
				label: "Storm Events by Type",
				layout: "category",
				categoryVar: variables.type,
				leftMargin: 130,
				catRowHeight: 25
			}
		]
	},
	{
		id: "#weather-eye__tulsa", 
		vizType: "dot_chart",
		primaryDataSheet: "tulsa",
		colorSettings: { colorVar: variables.type, showLegend: true },
		tooltipTitleVar: variables.type,
		tooltipVars: [variables.fema_description, variables.start_date, variables.end_date],
		dotScaleRange: [2, 6],
		interaction: "mouseover",
		layouts: [
			{
				label: "Storm Events by Year",
				layout: "histogram_fixed_interval",
				xVar: variables.year,
				sortingVar: variables.start_date,
				fixedStartVal: 1965
			},
			{
				label: "Storm Events by Month",
				layout: "histogram_fixed_interval",
				xVar: variables.month,
				sortingVar: variables.start_date,
				maxWidth: 600,
				axisLabelOverrideFunc: d => months[+d]
			},
			{
				label: "Storm Events by Type",
				layout: "category",
				categoryVar: variables.type,
				leftMargin: 130,
				catRowHeight: 25
			}
		]
	},
	{
		id: "#weather-eye__cumberland", 
		vizType: "dot_chart",
		primaryDataSheet: "cumberland",
		colorSettings: { colorVar: variables.type, showLegend: true },
		tooltipTitleVar: variables.type,
		tooltipVars: [variables.fema_description, variables.start_date, variables.end_date],
		dotScaleRange: [2, 6],
		interaction: "mouseover",
		layouts: [
			{
				label: "Storm Events by Year",
				layout: "histogram_fixed_interval",
				xVar: variables.year,
				sortingVar: variables.start_date,
				fixedStartVal: 1965
			},
			{
				label: "Storm Events by Month",
				layout: "histogram_fixed_interval",
				xVar: variables.month,
				sortingVar: variables.start_date,
				maxWidth: 600,
				axisLabelOverrideFunc: d => months[+d]
			},
			{
				label: "Storm Events by Type",
				layout: "category",
				categoryVar: variables.type,
				leftMargin: 130,
				catRowHeight: 25
			}
		]
	},
	// {
	// 	id: "#weather-eye__findings__complacency", 
	// 	vizType: "quote_scroller",
	// 	primaryDataSheet: "storm_quotes",
	// 	filterInitialDataFunction: d => d.category === "Complacency and fatigue are two major barriers to resilience",
	// 	categoryDescriptionSheet: "storm_quotes_category_descriptions",
	// 	categoryVar: variables.category,
	// 	showCategoryTitle: false
	// },
	// {
	// 	id: "#weather-eye__findings__press", 
	// 	vizType: "quote_scroller",
	// 	primaryDataSheet: "storm_quotes",
	// 	filterInitialDataFunction: d => d.category === "The local press serves an important role in resilience, and it’s not one that can be replaced by social media",
	// 	categoryVar: variables.category,
	// 	showCategoryTitle: false
	// },
	// {
	// 	id: "#weather-eye__findings__emergency", 
	// 	vizType: "quote_scroller",
	// 	primaryDataSheet: "storm_quotes",
	// 	filterInitialDataFunction: d => d.category === "Emergency management is changing, and it is trying to become a profession",
	// 	categoryDescriptionSheet: "storm_quotes_category_descriptions",
	// 	categoryVar: variables.category,
	// 	showCategoryTitle: false
	// },
	// {
	// 	id: "#weather-eye__findings__relationships", 
	// 	vizType: "quote_scroller",
	// 	primaryDataSheet: "storm_quotes",
	// 	filterInitialDataFunction: d => d.category === "Relationships are key to good emergency management",
	// 	categoryDescriptionSheet: "storm_quotes_category_descriptions",
	// 	categoryVar: variables.category,
	// 	showCategoryTitle: false
	// },
	// {
	// 	id: "#weather-eye__findings__rural", 
	// 	vizType: "quote_scroller",
	// 	primaryDataSheet: "storm_quotes",
	// 	filterInitialDataFunction: d => d.category === "Rural areas have a different type of do-it-yourself resilience",
	// 	categoryDescriptionSheet: "storm_quotes_category_descriptions",
	// 	categoryVar: variables.category,
	// 	showCategoryTitle: false
	// },
	// {
	// 	id: "#weather-eye__findings__systemic", 
	// 	vizType: "quote_scroller",
	// 	primaryDataSheet: "storm_quotes",
	// 	filterInitialDataFunction: d => d.category === "Systemic social issues can inhibit action on weather resiliency",
	// 	categoryDescriptionSheet: "storm_quotes_category_descriptions",
	// 	categoryVar: variables.category,
	// 	showCategoryTitle: false
	// },
	// {
	// 	id: "#weather-eye__findings__vulnerable", 
	// 	vizType: "quote_scroller",
	// 	primaryDataSheet: "storm_quotes",
	// 	filterInitialDataFunction: d => d.category === "Many vulnerable and low-income populations do not know the resources available to them after a storm",
	// 	categoryDescriptionSheet: "storm_quotes_category_descriptions",
	// 	categoryVar: variables.category,
	// 	showCategoryTitle: false
	// },		
	// {
	// 	id: "#weather-eye__findings__flooding", 
	// 	vizType: "quote_scroller",
	// 	primaryDataSheet: "storm_quotes",
	// 	filterInitialDataFunction: d => d.category === "Flooding is a problem in every location we visited",
	// 	categoryDescriptionSheet: "storm_quotes_category_descriptions",
	// 	categoryVar: variables.category,
	// 	showCategoryTitle: false
	// },
	// {
	// 	id: "#weather-eye__findings__resilience", 
	// 	vizType: "quote_scroller",
	// 	primaryDataSheet: "storm_quotes",
	// 	filterInitialDataFunction: d => d.category === "Resilience can prepare a community for multiple kinds of disasters",
	// 	categoryDescriptionSheet: "storm_quotes_category_descriptions",
	// 	categoryVar: variables.category,
	// 	showCategoryTitle: false
	// },
	// {
	// 	id: "#weather-eye__findings__low-income", 
	// 	vizType: "quote_scroller",
	// 	primaryDataSheet: "storm_quotes",
	// 	filterInitialDataFunction: d => d.category === "Low-income populations can’t bounce back as easily",
	// 	categoryDescriptionSheet: "storm_quotes_category_descriptions",
	// 	categoryVar: variables.category,
	// 	showCategoryTitle: false
	// },
	{
		id: "#weather-eye__findings__all", 
		vizType: "quote_scroller",
		primaryDataSheet: "storm_quotes",
		categoryDescriptionSheet: "storm_quotes_category_descriptions",
		categoryVar: variables.category,
		showCategoryTitle: true,
		expandable: true
	},
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/resourcesecurity/weather-eye.json",
	dataSheetNames:["st_louis", "walsh", "caddo", "essex", "tulsa", "cumberland", "storm_quotes", "storm_quotes_category_descriptions"],
	vizSettingsList: vizSettingsList,
	reactVizSettingsList: reactVizSettingsList
}

setupProject(projectSettings);
	