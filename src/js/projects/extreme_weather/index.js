import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	state: {"variable":"state", "displayName":"State", "format": "string"},
	cost_rank: {"variable":"cost_rank", "displayName":"Cost Rank", "format":"number", "category":"Cost", "scaleType":"quantize", "customRange":[colors.red.light, colors.red.dark], "numBins":4},
	cost_in_home_yearly: {"variable":"cost_in_home_yearly", "displayName":"Cost in Home", "format":"price", "category":"Cost", "scaleType":"quantize", "customRange":[colors.red.light, colors.red.dark], "numBins":5},
	cost_in_center_yearly: {"variable":"cost_in_center_yearly", "displayName":"Cost in Center", "format":"price", "category":"Cost", "scaleType":"quantize", "customRange":[colors.red.light, colors.red.dark], "numBins":5},
	average_cost: {"variable":"average_cost", "displayName":"Average Cost", "format":"price", "category":"Cost", "scaleType":"quantize", "customRange":[colors.red.light, colors.red.dark], "numBins":5},
	cost_as_proportion_of_hhi: {"variable":"cost_as_proportion_of_hhi", "displayName":"Cost as % of Household Income", "format":"percent", "category":"Cost", "scaleType":"quantize", "customRange":[colors.red.light, colors.red.dark], "numBins":5},
	cost_as_proportion_of_min_wage: {"variable":"cost_as_proportion_of_min_wage", "displayName":"Cost as % of Min. Wage", "format":"percent", "category":"Cost", "scaleType":"quantize", "customRange":[colors.red.light, colors.red.dark], "numBins":5},
	quality_rank: {"variable":"quality_rank", "displayName":"Quality Rank", "format":"number", "category":"Quality", "scaleType":"quantize", "customRange":[colors.purple.light, colors.purple.dark], "numBins":4},
	quality_total_norm: {"variable":"quality_total_norm", "displayName":"Quality", "format":"integer", "category":"Quality", "scaleType":"quantize", "customRange":[colors.purple.light, colors.purple.dark], "numBins":5},
	availability_total_norm: {"variable":"availability_total_norm", "displayName":"Availability", "format":"integer", "category":"Availability", "scaleType":"quantize", "customRange":[colors.blue.light, colors.blue.dark], "numBins":5},
	care_index_combined: {"variable":"care_index_combined", "displayName":"Care Index Score", "format":"integer", "category":"Overall", "scaleType":"quantize", "customRange":[colors.turquoise.light, colors.turquoise.dark], "numBins":5},
	children_5_under: {"variable":"children_5_under", "displayName":"Children 5 & Under", "format":"number", "category":"Cost", "scaleType":"quantize", "customRange":[colors.blue.light, colors.blue.dark], "numBins":5},
	in_center_pct_accred_statewide: {"variable":"in_center_pct_accred_statewide", "displayName":"Proportion of Accredited Child Care Centers", "format":"percent", "scaleType":"quantize", "customRange":[colors.turquoise.light, colors.turquoise.dark], "numBins":5},

	who_pays_for_care_source: {"variable":"source", "displayName":"Who Pays For Care?", "format":"string", "scaleType": "categorical", "customDomain":["Parents", "Federal, State, and Local Government", "Philanthropy"], "customRange":[colors.turquoise.light, colors.blue.medium, colors.purple.light]},
	who_pays_for_care_value: {"variable":"value", "displayName":"Who Pays For Care?", "format":"percent", "scaleType": "categorical"},
}

let vizSettingsList = [
	{
		id: "#extreme-weather__county-by-year", 
		vizType: "us_counties_map",
		primaryDataSheet: "county_by_year",
		secondaryDataSheet: "events",
		// filterVars: [ variables.availability_total_norm ],
		// tooltipVars: [ variables.state, variables.availability_total_norm]
	},
	// {
	// 	id: "#extreme-weather__county-by-year", 
	// 	vizType: "dashboard",
	// 	primaryDataSheet: "county_by_year",
	// 	secondaryDataSheet: "events",
	// 	chartSettingsList: [
	// 		{
	// 			vizType: "bar_chart",
	// 		},
	// 		{
	// 			vizType: "us_counties_map",
	// 		}
	// 	]
	// },
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/resourcesecurity/extreme_weather.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/18WEcJVDByP5bCPACgt2s9-sYIOItweq9fI9PCMIpUjY/",
	dataSheetNames:["events", "county_by_year"],
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);

