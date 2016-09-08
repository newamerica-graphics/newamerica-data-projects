import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";

let variables = {
	year_charged_or_deceased: {"variable":"year_charged_or_deceased", "displayName":"Year", "format":"year", "scaleType":"categorical", "color":"blue"},
	charged_or_deceased: {"variable":"charged_or_deceased", "displayName":"Charged or Deceased", "format":"string", "scaleType":"categorical", "color":"blue", "customDomain":["Charged", "Charged outside U.S.", "Deceased"], "customRange":[colors.turquoise.medium, colors.turquoise.light, colors.red.light]},
	full_name: {"variable":"full_name", "displayName":"Full Name", "format":"string"},
	date_charged: {"variable":"date_charged", "displayName":"Date Charged", "format":"string"},
	terror_plot: {"variable":"terror_plot", "displayName":"Terror Plot", "format":"string"},
	citizenship_status: {"variable":"citizenship_status", "displayName":"Citizenship Status", "format":"string", "scaleType":"categorical", "customDomain":["U.S. Born Citizen", "Naturalized Citizen", "Citizen of Unknown Status", "Permanent Resident", "Immigrant Visa", "Nonimmigrant Visa", "Illegal Immigrant", "Refugee", "Unknown"], "customRange":[colors.turquoise.dark, colors.turquoise.medium, colors.turquoise.light, colors.blue.dark, colors.blue.medium, colors.blue.light, colors.purple.dark, colors.purple.light, colors.grey.light]},
	char_awlaki: {"variable":"char_awlaki", "displayName":"Involvement with Awlaki", "format":"string", "scaleType":"categorical", "customDomain":["Ties", "Contact", "None"], "customRange":[colors.red.light, colors.purple.light, colors.grey.medium_light]},
	field_kids: {"variable":"field_kids", "displayName":"Kids", "format":"string", "scaleType":"categorical", "color":"blue"},
	age: {"variable":"age", "displayName":"Age", "format":"number", "scaleType":"categorical", "color":"turquoise"},
	marital_status: {"variable":"marital_status", "displayName":"Marital Status", "scaleType":"categorical", "format":"string"},
	gender: {"variable":"gender", "displayName":"Gender", "format":"string", "scaleType":"categorical", "color":"red", "customDomain":["Female", "Male"], "customRange":[colors.red.light, colors.turquoise.light]},
	field_year_indicted: {"variable":"field_year_indicted", "displayName":"Field Indicted", "format":"year", "scaleType":"categorical", "color":"blue"},
	char_online_radicalization: {"variable":"char_online_radicalization", "format": "string"},
	headshot: {"variable":"headshot", "format":"image"}
}

let vizSettingsList = [
	{
		id: "#homegrown__outcome-for-extremist", 
		vizType: "grouped_dot_matrix",
		dotsPerRow: 5,
		distanceBetweenGroups: 15,
		groupingVars: [ variables.year_charged_or_deceased ],
		filterVars: [ variables.charged_or_deceased ],
		tooltipVars: [ variables.full_name, variables.charged_or_deceased, variables.date_charged, variables.terror_plot],
		tooltipImageVar: variables.headshot,
		labelSettings: { interval: 1, showNumVals: true}
	},
	{
		id: "#homegrown__awlaki-over-time", 
		vizType: "grouped_dot_matrix",
		dotsPerRow: 5,
		distanceBetweenGroups: 15,
		groupingVars: [ variables.year_charged_or_deceased ],
		dividingLine: { value: "2011", title: "Post al-Awlaki", descriptionLines: ["Anwar al-Awlaki killed in drone strike on", "September 30, 2011"]},
		filterVars: [ variables.char_awlaki ],
		tooltipVars: [ variables.full_name, variables.char_awlaki, variables.terror_plot],
		tooltipImageVar: variables.headshot,
		labelSettings: { interval: 1, showNumVals: true}
	},
	{
		id: "#homegrown__gender-of-extremists", 
		vizType: "grouped_dot_matrix",
		dotsPerRow: 5,
		distanceBetweenGroups: 15,
		groupingVars: [ variables.year_charged_or_deceased ],
		filterVars: [ variables.gender ],
		tooltipVars: [ variables.full_name, variables.charged_or_deceased, variables.gender, variables.date_charged, variables.terror_plot],
		tooltipImageVar: variables.headshot,
		labelSettings: { interval: 1, showNumVals: true}
	},
	{
		id: "#homegrown__citizenship-status", 
		vizType: "dot_matrix",
		orientation: "horizontal",
		filterVars: [ variables.citizenship_status ],
		tooltipVars: [ variables.full_name, variables.citizenship_status ],
		tooltipImageVar: variables.headshot,
	},
	{
		id: "#homegrown__age-of-extremists", 
		vizType: "dot_histogram",
		groupingVars: [ variables.age ],
		filterVars: [ variables.marital_status ],
		tooltipVars: [ variables.full_name, variables.age, variables.marital_status, variables.terror_plot ],
		tooltipImageVar: variables.headshot,
		labelSettings: { interval: 5 }
	},
	{
		id: "#homegrown__extremist-data-table", 
		vizType: "table",
		tableVars: [ variables.full_name, variables.age, variables.gender ],
		colorScaling: false
	},
	{
		id: "#homegrown__fact-box__method-of-radicalization", 
		vizType: "fact_box",
		factBoxVals: [ 
			{ variable: variables.char_online_radicalization, value: "Yes", type:"percent", color:colors.turquoise.light, text:"Radicalized Online"},
			{ variable: variables.char_online_radicalization, value: "No", type:"percent", color:colors.blue.light, text:"Not Radicalized Online"},
		],
	},
	// {
	// 	id: "#homegrown__fact-box__method-of-radicalization", 
	// 	vizType: "fact_box",
	// 	factBoxVals: [ 
	// 		{ variable: variables.char_online_radicalization, value: "Yes", type:"percent", color:colors.turquoise.light, text:"Radicalized Online"},
	// 		{ variable: variables.char_online_radicalization, value: "No", type:"percent", color:colors.blue.light, text:"Not Radicalized Online"},
	// 	],
	// },
	// {
	// 	id: "#homegrown__fact-box__association-with-awlaki", 
	// 	vizType: "fact_box",
	// 	factBoxVals: [ 
	// 		{ variable: variables.char_awlaki, value: "Ties", type:"percent", color:colors.turquoise.light, text:"Ties with Awlaki"},
	// 		{ variable: variables.char_awlaki, value: "Contact", type:"percent", color:colors.blue.light, text:"Direct contact with Awlaki"},
	// 	],
	// },
	// {
	// 	id: "#homegrown__fact-box__gender-of-extremists", 
	// 	vizType: "fact_box",
	// 	factBoxVals: [ 
	// 		{ variable: variables.gender, value: "Male", type:"percent", color:colors.turquoise.light, text:"Male"},
	// 		{ variable: variables.gender, value: "Female", type:"percent", color:colors.blue.light, text:"Female"},

	// 	],
	// },
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/isp/troubleshoot.json",
	dataSheetNames:["people"],
	imageFolderId: "0B2KbJlQb9jlgeG5hOXZqbURpRUE",
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);