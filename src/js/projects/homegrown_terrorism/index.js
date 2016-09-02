import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";

let variables = {
	year_charged_or_deceased: {"variable":"year_charged_or_deceased", "displayName":"Year", "format":"year", "scaleType":"categorical", "color":"blue"},
	charged_or_deceased: {"variable":"charged_or_deceased", "displayName":"Charged or Deceased", "format":"string", "scaleType":"categorical", "color":"blue", "customDomain":["Charged", "Charged outside U.S.", "Deceased"], "customRange":[colors.turquoise.medium, colors.turquoise.light, colors.red.light]},
	full_name: {"variable":"full_name", "displayName":"Full Name", "format":"string"},
	date_charged: {"variable":"date_charged", "displayName":"Date Charged", "format":"string"},
	terror_plot: {"variable":"terror_plot", "displayName":"Terror Plot", "format":"string"},
	citizenship_status: {"variable":"citizenship_status", "displayName":"Citizenship Status", "format":"string", "scaleType":"categorical"},
	char_awlaki: {"variable":"char_awlaki", "displayName":"Involvement with Awlaki", "format":"string", "scaleType":"categorical", "customDomain":["Ties", "Contact", "None"], "customRange":[colors.red.light, colors.purple.light, colors.grey.light]},
	field_kids: {"variable":"field_kids", "displayName":"Kids", "format":"string", "scaleType":"categorical", "color":"blue"},
	age: {"variable":"age", "displayName":"Age", "format":"number", "scaleType":"categorical", "color":"turquoise"},
	marital_status: {"variable":"marital_status", "displayName":"Marital Status", "scaleType":"categorical", "format":"string"},
	gender: {"variable":"gender", "displayName":"Gender", "format":"number", "scaleType":"categorical", "color":"red"},
	field_year_indicted: {"variable":"field_year_indicted", "displayName":"Field Indicted", "format":"year", "scaleType":"categorical", "color":"blue"},
	headshot: {"variable":"headshot", "format":"image"}
}

let vizSettingsList = [
	// {
	// 	id: "#homegrown__outcome-for-extremist", 
	// 	vizType: "grouped_dot_matrix",
	// 	dotsPerRow: 5,
	// 	distanceBetweenGroups: 15,
	// 	groupingVars: [ variables.year_charged_or_deceased ],
	// 	filterVars: [ variables.charged_or_deceased ],
	// 	tooltipVars: [ variables.full_name, variables.charged_or_deceased, variables.date_charged, variables.terror_plot],
	// 	tooltipImageVar: variables.headshot,
	// 	labelSettings: { interval: 1, showNumVals: true}
	// },
	// {
	// 	id: "#homegrown__awlaki-over-time", 
	// 	vizType: "grouped_dot_matrix",
	// 	dotsPerRow: 5,
	// 	distanceBetweenGroups: 15,
	// 	groupingVars: [ variables.year_charged_or_deceased ],
	// 	dividingLine: { value: "2011", title: "Post al-Awlaki", descriptionLines: ["Anwar al-Awlaki killed in drone strike on", "September 30, 2011"]},
	// 	filterVars: [ variables.char_awlaki ],
	// 	tooltipVars: [ variables.full_name, variables.char_awlaki, variables.terror_plot],
	// 	tooltipImageVar: variables.headshot,
	// 	labelSettings: { interval: 1, showNumVals: true}
	// },
	// {
	// 	id: "#homegrown__citizenship-status", 
	// 	vizType: "dot_matrix",
	// 	orientation: "horizontal",
	// 	filterVars: [ variables.citizenship_status ],
	// 	tooltipVars: [ variables.full_name, variables.citizenship_status ],
	// 	tooltipImageVar: variables.headshot,
	// },
	{
		id: "#homegrown__age-of-extremists", 
		vizType: "dot_histogram",
		groupingVars: [ variables.age ],
		filterVars: [ variables.marital_status ],
		tooltipVars: [ variables.full_name, variables.age, variables.marital_status, variables.terror_plot ],
		tooltipImageVar: variables.headshot,
		labelSettings: { interval: 5 }
	},
	// {
	// 	id: "#test2", 
	// 	vizType: "dot_histogram",
	// 	groupingVars: [ variables.field_year_indicted ],
	// 	filterVars: [ variables.field_kids ],
	// 	tooltipVars: [ variables.field_year_indicted, variables.field_kids, variables.field_age ],
	// 	labelSettings: { interval: 5}
	// },
	// {
	// 	id: "#test3", 
	// 	vizType: "table",
	// 	tableVars: [ variables.full_name, variables.field_age, variables.field_gender ],
	// 	colorScaling: false
	// },
	// {
	// 	id: "#test4", 
	// 	vizType: "fact_box",
	// 	factBoxVals: [ 
	// 		{ variable: variables.field_age, value: "25", type:"count", text:"Jihadists are 25 years old or younger"},
	// 		{ variable: variables.field_gender, value: "0", type:"percent", text:"Jihadists are female" },
	// 		{ variable: variables.field_gender, value: "1", type:"percent", text:"Jihadists are male" } 
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