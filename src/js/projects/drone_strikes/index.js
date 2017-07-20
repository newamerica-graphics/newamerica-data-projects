import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	country: {"variable":"country", "displayName":"Country", "format": "string"},
	date: {"variable":"date", "displayName":"Date", "format": "date"},
	year: {"variable":"year", "displayName":"Year", "format": "year"},
	village: {"variable":"village", "displayName":"Village", "format": "string"},
	region: {"variable":"region", "displayName":"Region", "format": "string"},
	total_avg: {"variable":"total_avg", "displayName":"Total Casualties", "format": "integer", "color": colors.turquoise.light, "scaleType": "linear"},
	civilians_avg: {"variable":"civilians_avg", "displayName":"Civilians", "format": "integer", "color": colors.blue.light},
	unknown_avg: {"variable":"unknown_avg", "displayName":"Unknown", "format": "integer", "color": colors.grey.medium},
	militants_avg: {"variable":"militants_avg", "displayName":"Militants", "format": "integer", "color": colors.turquoise.light},
	total_lowhigh: {"variable":"total_lowhigh", "displayName":"Total Casualties", "format": "string", "color": colors.turquoise.light, "scaleType": "linear"},
	civilians_lowhigh: {"variable":"civilians_lowhigh", "displayName":"Civilians", "format": "string", "color": colors.turquoise.light},
	unknown_lowhigh: {"variable":"unknown_lowhigh", "displayName":"Unknown", "format": "string", "color": colors.blue.light},
	militants_lowhigh: {"variable":"militants_lowhigh", "displayName":"Militants", "format": "string", "color": colors.purple.light},
	president: {"variable":"president", "displayName":"President", "format": "string", "scaleType": "categorical", "customDomain": ["Bush", "Obama", "Trump"], "customRange": [colors.red.light, colors.blue.dark, colors.red.dark]},
	president_bush: {"variable":"president_bush", "displayName":"Bush", "format": "number", "color": colors.red.light},
	president_obama: {"variable":"president_obama", "displayName":"Obama", "format": "number", "color": colors.blue.dark},
	president_trump: {"variable":"president_trump", "displayName":"Trump", "format": "number", "color": colors.red.dark},
	target_organization_name: {"variable":"target_organization_name", "displayName":"Target Organization", "format": "string", "scaleType":"categorical"},
	target_description: {"variable":"target_description", "displayName":"Target Description", "format": "long_text", "disableTableOrdering": true},
	sources_combined: {"variable":"sources_combined", "displayName":"Media Outlets", "format": "link"},
	leader_names: {"variable":"leader_names", "displayName":"Leader(s)", "format": "string"},
	leader_description: {"variable":"leader_description", "displayName":"Leader Description", "format": "string"},
	leaders_killed: {"variable":"leaders_killed", "displayName":"Leaders Killed", "format": "number", "scaleType": "linear"},

	total_strikes: {"variable":"total_strikes", "displayName":"Total Strikes", "format": "number"},
	civilians_lowhigh: {"variable":"civilians_lowhigh", "displayName":"Civilians", "format": "string", "disableTableOrdering": true},
	militants_lowhigh: {"variable":"militants_lowhigh", "displayName":"Militants", "format": "string", "disableTableOrdering": true},
	unknown_lowhigh: {"variable":"unknown_lowhigh", "displayName":"Unknown", "format": "string", "disableTableOrdering": true},
	total_lowhigh: {"variable":"total_lowhigh", "displayName":"Total", "format": "string", "disableTableOrdering": true},
	leader_percent: {"variable":"leader_percent", "displayName":"Leader Percentage", "format": "percent", "disableTableOrdering": true},
}

let vizSettingsList = [
	// {
	// 	id: "#drone-strikes__casualties", 
	// 	vizType: "stacked_bar",
	// 	primaryDataSheet: "strike_data",
	// 	// filterInitialDataBy: { field: "country", value:"Pakistan"},
	// 	xVar: variables.year,
	// 	filterVars: [ variables.militants_avg, variables.civilians_avg, variables.unknown_avg],
	// 	legendSettings: {"orientation": "horizontal-center", "showTitle": false, "disableValueToggling": false},
	// 	xAxisLabelInterval: {"small": 5, "medium": 2, "large": 1},
	// 	yAxisLabelText: "Casualties",
	// 	showYAxis: true,
	// 	tooltipTitleVar: variables.year,
	// },
	// {
	// 	id: "#drone-strikes__strikes-by-president", 
	// 	vizType: "stacked_bar",
	// 	primaryDataSheet: "strike_data",
	// 	// filterInitialDataBy: { field: "country", value:"Pakistan"},
	// 	xVar: variables.year,
	// 	barVars: [ variables.president_bush, variables.president_obama, variables.president_trump ],
	// 	legendSettings: {"orientation": "horizontal-center", "showTitle": false, "disableValueToggling": false},
	// 	xAxisLabelInterval: {"small": 5, "medium": 2, "large": 1},
	// 	yAxisLabelText: "Strikes",
	// 	showYAxis: true,
	// 	tooltipTitleVar: variables.year,
	// },
	{
		id: "#drone-strikes__targets", 
		vizType: "percentage_stacked_bar",
		// filterInitialDataBy: { field: "country", value:"Pakistan"},
		primaryDataSheet: "strike_data",
		groupingVar: variables.president,
		filterVar: variables.target_organization_name,
	},
	// {
	// 	id: "#drone-strikes__strike-totals-by-president", 
	// 	primaryDataSheet: "strikes_by_president",
	// 	vizType: "table",
	// 	tableVars: [ variables.president, variables.total_strikes, variables.civilians_lowhigh, variables.militants_lowhigh, variables.unknown_lowhigh, variables.total_lowhigh],
	// 	defaultOrdering: [0, "asc"],
	// 	pagination: false,
	// 	numPerPage: 25,
	// 	colorScaling: false,
	// 	disableSearching: true,
	//  	disableOrdering: true
	// },
	// {
	// 	id: "#drone-strikes__strike-map",
	// 	vizType: "tabbed_chart_layout",
	// 	primaryDataSheet: "strike_data",
	// 	chartSettingsList: [
	// 		{
	// 			vizType: "mapbox_map",
	// 			// filterInitialDataBy: { field: "country", value:"Pakistan"},
	// 	        mapboxSettings: {
	// 	        	style: "mapbox://styles/newamericamapbox/ciynaplyx001k2sqepxshx05u",
	// 	        	center: [69.3451, 32.3753],
	// 	        	zoom: 5,
	// 	        	maxBounds: [
	// 	        		[55.00301398655583, 21.96600122382982],
	// 	        		[83.30379523654886, 39.012806004755106]
	// 	        	],
	// 	        },
	// 	        colorVar: variables.president,
	// 	        radiusVar: variables.total_avg,
	// 	        sliderSettings: {
	// 				variable: variables.year,
	// 				showAllButton: true,
	// 				automated: false,
	// 	        },
	// 	        dataBoxVars: {
	// 	        	title: variables.date,
	// 	        	subtitle: [variables.village, variables.region],
	// 	        	categories: [
	// 		        	{ 
	// 		        		label: "Target",
	// 		        		fields: [variables.target_organization_name, variables.target_description] 
	// 		        	},
	// 		        	{ 
	// 		        		label: "Casualties",
	// 		        		fields: [variables.civilians_lowhigh, variables.militants_lowhigh, variables.unknown_lowhigh, variables.total_lowhigh]
	// 		        	},
	// 		        	{ 
	// 		        		label: "Leaders Killed",
	// 		        		fields: [variables.leader_names, variables.leader_description]
	// 		        	},
	// 		        	{
	// 		        		label: "Sources",
	// 		        		fields: [variables.sources_combined]
	// 		        	}
	// 	        	],
	// 	        }
	// 	    },
	// 	    {
	// 			vizType: "table",
	// 			tableVars: [ variables.date, variables.president, variables.village, variables.region, variables.target_organization_name, variables.target_description, variables.civilians_avg, variables.militants_avg, variables.unknown_avg, variables.total_avg, variables.sources_combined],
	// 			defaultOrdering: [0, "desc"],
	// 			pagination: true,
	// 			numPerPage: 25,
	// 			colorScaling: false
	// 		}
	// 	]
	// },
	// {
	// 	id: "#drone-strikes__leaders-map",
	// 	vizType: "tabbed_chart_layout",
	// 	primaryDataSheet: "strike_data",
	// 	chartSettingsList: [
	// 		{
	// 			vizType: "mapbox_map",
	// 			// filterInitialDataBy: { field: "country", value:"Pakistan" },
	// 	        mapboxSettings: {
	// 	        	style: "mapbox://styles/newamericamapbox/ciynaplyx001k2sqepxshx05u",
	// 	        	center: [69.3451, 32.3753],
	// 	        	zoom: 5,
	// 	        	maxBounds: [
	// 	        		[55.00301398655583, 21.96600122382982],
	// 	        		[83.30379523654886, 39.012806004755106]
	// 	        	],
	// 	        },
	// 	        colorVar: variables.president,
	// 	        radiusVar: variables.leaders_killed,
	// 	        sliderSettings: {
	// 				variable: variables.year,
	// 				showAllButton: true,
	// 				automated: false,
	// 	        },
	// 	        dataBoxVars: {
	// 	        	title: variables.date,
	// 	        	subtitle: [variables.village, variables.region],
	// 	        	categories: [
	// 	        		{ 
	// 		        		label: "Leaders Killed",
	// 		        		fields: [variables.leader_names, variables.leader_description]
	// 		        	},
	// 		        	// { 
	// 		        	// 	label: "Target",
	// 		        	// 	fields: [variables.target_organization_name, variables.target_description] 
	// 		        	// },
	// 		        	// { 
	// 		        	// 	label: "Casualties",
	// 		        	// 	fields: [variables.civilians_lowhigh, variables.militants_lowhigh, variables.unknown_lowhigh, variables.total_lowhigh]
	// 		        	// },
	// 		        	{
	// 		        		label: "Sources",
	// 		        		fields: [variables.sources_combined]
	// 		        	}
	// 	        	],
	// 	        }
	// 	    },
	// 	    {
	// 			vizType: "table",
	// 			tableVars: [ variables.date, variables.leader_names, variables.leader_description, variables.village, variables.region, variables.sources_combined],
	// 			defaultOrdering: [0, "desc"],
	// 			pagination: true,
	// 			numPerPage: 25,
	// 			colorScaling: false
	// 		}
	// 	]
	// },
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/isp/drone-strikes.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/11uMYLFFk8sEbYNIOrX3ENRdgCWxttKdYQ6b8hUW-XbI/",
	dataSheetNames:["strike_data", "strikes_by_president"],
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);

