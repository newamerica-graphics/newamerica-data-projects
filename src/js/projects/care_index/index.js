import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	state: {"variable":"state", "displayName":"State"},
	cost_rank: {"variable":"cost_rank", "displayName":"Cost Rank", "format":"number", "category":"Cost", "scaleType":"quantize", "customRange":[colors.red.light, colors.red.dark], "numBins":4},
	cost_in_home_yearly: {"variable":"cost_in_home_yearly", "displayName":"Cost in Home", "format":"price", "category":"Cost", "scaleType":"quantize", "customRange":[colors.red.light, colors.red.dark], "numBins":6},
	cost_in_center_yearly: {"variable":"cost_in_center_yearly", "displayName":"Cost in Center", "format":"price", "category":"Cost", "scaleType":"quantize", "customRange":[colors.red.light, colors.red.dark], "numBins":5},
	average_cost: {"variable":"average_cost", "displayName":"Average Cost", "format":"price", "category":"Cost", "scaleType":"quantize", "customRange":[colors.red.light, colors.red.dark], "numBins":5},
	cost_as_proportion_of_hhi: {"variable":"cost_as_proportion_of_hhi", "displayName":"Cost as % of Household Income", "format":"percent", "category":"Cost", "scaleType":"quantize", "customRange":[colors.red.light, colors.red.dark], "numBins":5},
	cost_as_proportion_of_min_wage: {"variable":"cost_as_proportion_of_min_wage", "displayName":"Cost as % of Minimum Wage", "format":"percent", "category":"Cost", "scaleType":"quantize", "customRange":[colors.red.light, colors.red.dark], "numBins":5},
	quality_rank: {"variable":"quality_rank", "displayName":"Quality Rank", "format":"number", "category":"Quality", "scaleType":"quantize", "customRange":[colors.purple.light, colors.purple.dark], "numBins":4},
	quality_total_norm: {"variable":"quality_total_norm", "displayName":"Quality", "format":"number", "category":"Quality", "scaleType":"quantize", "customRange":[colors.purple.light, colors.purple.dark], "numBins":5},
	availability_total_norm: {"variable":"availability_total_norm", "displayName":"Availability", "format":"number", "category":"Availability", "scaleType":"quantize", "customRange":[colors.blue.light, colors.blue.dark], "numBins":5},
	care_index_combined: {"variable":"care_index_combined", "displayName":"Care Index Score", "format":"number", "category":"Care Index Score", "scaleType":"quantize", "customRange":[colors.turquoise.light, colors.turquoise.dark], "numBins":5},
	children_5_under: {"variable":"children_5_under", "displayName":"Children 5 & Under", "format":"number", "category":"Cost", "scaleType":"quantize", "customRange":[colors.blue.light, colors.blue.dark], "numBins":5},
	in_center_pct_accred_statewide: {"variable":"in_center_pct_accred_statewide", "displayName":"Proportion of Accredited Child Care Centers", "format":"percent", "scaleType":"quantize", "customRange":[colors.turquoise.light, colors.turquoise.dark], "numBins":5},
}

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
	{
		id: "#care-index__explore-the-index", 
		vizType: "us_states_map",
		primaryDataSheet: "state_data",
		filterVars: [ variables.cost_in_home_yearly, variables.cost_in_center_yearly, variables.average_cost, variables.cost_as_proportion_of_hhi, variables.cost_as_proportion_of_min_wage, variables.quality_total_norm, variables.availability_total_norm, variables.care_index_combined ],
		tooltipVars: [ variables.state, variables.cost_in_home_yearly, variables.cost_in_center_yearly, variables.average_cost, variables.cost_as_proportion_of_hhi, variables.cost_as_proportion_of_min_wage, variables.quality_total_norm, variables.availability_total_norm, variables.care_index_combined  ]
	},
	{
		id: "#care-index__explore-the-index__availability", 
		vizType: "us_states_map",
		primaryDataSheet: "state_data",
		filterVars: [ variables.availability_total_norm ],
		tooltipVars: [ variables.state, variables.availability_total_norm]
	},
	{
		id: "#care-index__child-care-accredidation", 
		vizType: "us_states_map",
		primaryDataSheet: "state_data",
		filterVars: [ variables.in_center_pct_accred_statewide ],
		tooltipVars: [ variables.state, variables.in_center_pct_accred_statewide]
	},
	
	// {
	// 	id: "#explore-the-index", 
	// 	vizType: "table",
	// 	tableVars: [ full_name, field_age, field_gender ],
	// 	colorScaling: false
	// },
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/bll/care_index.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/18WEcJVDByP5bCPACgt2s9-sYIOItweq9fI9PCMIpUjY/",
	dataSheetNames:["state_data"],
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);

