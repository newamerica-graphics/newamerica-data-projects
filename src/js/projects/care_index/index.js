import { setupProject } from "../../viz_controller.js";

let state = {"variable":"state", "displayName":"State"};
let cost_rank = {"variable":"cost_rank", "displayName":"Cost Rank", "format":"number", "category":"Cost", "scaleType":"quantize", "color":"blue", "numBins":4};
let cost_in_home = {"variable":"cost_in_home", "displayName":"Cost in Home", "format":"price", "category":"Cost", "scaleType":"quantize", "color":"blue", "numBins":6};
let cost_in_center = {"variable":"cost_in_center", "displayName":"Cost in Center", "format":"price", "category":"Cost", "scaleType":"quantize", "color":"blue", "numBins":5};
let quality_rank = {"variable":"quality_rank", "displayName":"Quality Rank", "format":"number", "category":"Quality", "scaleType":"quantize", "color":"red", "numBins":4};
let children_5_under = {"variable":"children_5_under", "displayName":"Children 5 & Under", "format":"number", "category":"Cost", "scaleType":"quantize", "color":"blue", "numBins":5};

let full_name = {"variable":"full_name", "displayName":"Name"};
let field_kids = {"variable":"field_kids", "displayName":"Kids", "format":"string", "scaleType":"categorical", "color":"blue"};
let field_age = {"variable":"field_age", "displayName":"Age", "format":"number", "scaleType":"linear", "color":"turquoise"};
let field_gender = {"variable":"field_gender", "displayName":"Gender", "format":"number", "scaleType":"categorical", "color":"red"};
let field_year_indicted = {"variable":"field_year_indicted", "displayName":"Field Indicted", "format":"year", "scaleType":"categorical", "color":"blue"};

let vizSettingsList = [
	// {
	// 	id: "#explore-the-index", 
	// 	vizType: "chart_table_layout",
	// 	layoutComponents: ["us_states_map", "table"],
	// 	filterVars: [ children_5_under, quality_rank, cost_rank, cost_in_home ],
	// 	tooltipVars: [ children_5_under, cost_rank, cost_in_home ],
	// 	tableVars: [ state, children_5_under, cost_rank, cost_in_home ]
	// },
	// {
	// 	id: "#explore-the-index", 
	// 	vizType: "dot_matrix",
	// 	dotsPerRow: 5,
	// 	orientation: "horizontal",
	// 	filterVars: [ field_kids ],
	// 	tooltipVars: [ field_kids, field_age ],
	// },
	// {
	// 	id: "#test0", 
	// 	vizType: "grouped_dot_matrix",
	// 	dotsPerRow: 5,
	// 	distanceBetweenGroups: 20,
	// 	groupingVars: [ field_year_indicted ],
	// 	filterVars: [ field_kids ],
	// 	tooltipVars: [ field_year_indicted, field_kids, field_age ],
	// 	labelSettings: { interval: 1, showNumVals: true}
	// },
	// {
	// 	id: "#test1", 
	// 	vizType: "dot_histogram",
	// 	groupingVars: [ field_year_indicted ],
	// 	filterVars: [ field_kids ],
	// 	tooltipVars: [ field_year_indicted, field_kids, field_age ],
	// 	labelSettings: { interval: 5}
	// }
	// {
	// 	id: "#test1", 
	// 	vizType: "us_states_map",
	// 	filterVars: [ quality_rank, cost_rank, cost_in_home ],
	// 	tooltipVars: [ children_5_under, cost_rank, cost_in_home ]
	// },
	// {
	// 	id: "#explore-the-index", 
	// 	vizType: "table",
	// 	tableVars: [ full_name, field_age, field_gender ],
	// 	colorScaling: false
	// },
	{
		id: "#test1", 
		vizType: "fact_box",
		factBoxVals: [ 
			{ variable: field_age, value: "25", type:"count", text:"Jihadists are 25 years old or younger"},
			{ variable: field_gender, value: "0", type:"percent", text:"Jihadists are female" },
			{ variable: field_gender, value: "1", type:"percent", text:"Jihadists are male" } 
		],
	}
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/isp/homegrown.json",
	dataSheetNames:["Sheet1"],
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);

