import { setupProject } from "../../viz_controller.js";

let variables = {
	full_name: {"variable":"full_name", "displayName":"Name"},
	field_kids: {"variable":"field_kids", "displayName":"Kids", "format":"string", "scaleType":"categorical", "color":"blue"},
	field_age: {"variable":"field_age", "displayName":"Age", "format":"number", "scaleType":"linear", "color":"turquoise"},
	field_gender: {"variable":"field_gender", "displayName":"Gender", "format":"number", "scaleType":"categorical", "color":"red"},
	field_year_indicted: {"variable":"field_year_indicted", "displayName":"Field Indicted", "format":"year", "scaleType":"categorical", "color":"blue"},
}

let vizSettingsList = [
	{
		id: "#test0", 
		vizType: "dot_matrix",
		dotsPerRow: 5,
		orientation: "horizontal",
		filterVars: [ variables.field_kids ],
		tooltipVars: [ variables.field_kids, variables.field_age ],
	},
	{
		id: "#test1", 
		vizType: "grouped_dot_matrix",
		dotsPerRow: 5,
		distanceBetweenGroups: 20,
		groupingVars: [ variables.field_year_indicted ],
		filterVars: [ variables.field_kids ],
		tooltipVars: [ variables.field_year_indicted, variables.field_kids, variables.field_age ],
		labelSettings: { interval: 1, showNumVals: true}
	},
	{
		id: "#test2", 
		vizType: "dot_histogram",
		groupingVars: [ variables.field_year_indicted ],
		filterVars: [ variables.field_kids ],
		tooltipVars: [ variables.field_year_indicted, variables.field_kids, variables.field_age ],
		labelSettings: { interval: 5}
	},
	{
		id: "#test3", 
		vizType: "table",
		tableVars: [ variables.full_name, variables.field_age, variables.field_gender ],
		colorScaling: false
	},
	{
		id: "#test4", 
		vizType: "fact_box",
		factBoxVals: [ 
			{ variable: variables.field_age, value: "25", type:"count", text:"Jihadists are 25 years old or younger"},
			{ variable: variables.field_gender, value: "0", type:"percent", text:"Jihadists are female" },
			{ variable: variables.field_gender, value: "1", type:"percent", text:"Jihadists are male" } 
		],
	},
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/isp/homegrown.json",
	dataSheetNames:["Sheet1"],
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);