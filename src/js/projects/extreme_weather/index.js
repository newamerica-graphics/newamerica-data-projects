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
	{
		id: "#extreme-weather__county-by-year", 
		vizType: "dashboard",
		chartSettingsList: [
			{
				vizType: "bar_chart",
				isMessagePasser: true,
				primaryDataSheet: "events",
				xVars: [ variables.year ],
				yScaleType: "count",
				yAxisLabelText: "Number of Disasters",
			},
			{
				vizType: "us_counties_map",
				primaryDataSheet: "county_by_year",
				secondaryDataSheet: "events",
				filterVars: [variables.event_category],
				tooltipVars: [variables.event_name, variables.event_category, variables.begin_date, variables.end_date, variables.states ],
			}
		]
	},
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/resourcesecurity/extreme_weather.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/18WEcJVDByP5bCPACgt2s9-sYIOItweq9fI9PCMIpUjY/",
	dataSheetNames:["events", "county_by_year"],
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);

