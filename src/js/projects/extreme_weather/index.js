import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	year: {"variable":"year", "displayName":"Year", "format":"year"},

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
	{
		id: "#extreme-weather__county-by-year", 
		vizType: "bar_chart",
		primaryDataSheet: "events",
		xVars: [ variables.year ],
		yScaleType: "count",
		yAxisLabelText: "Number of Disasters",
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

