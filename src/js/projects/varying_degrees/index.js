import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	sector: {"variable":"sector", "displayName":"Sector", "format": "string"},
	students_funding: {"variable":"students_funding", "displayName":"Funding from Students", "format": "percent", color:colors.turquoise.light},
	states_funding: {"variable":"states_funding", "displayName":"Funding from States", "format": "percent", color:colors.turquoise.light},
	feds_funding: {"variable":"feds_funding", "displayName":"Funding from Federal Govt.", "format": "percent", color:colors.blue.dark},

	age_group: {"variable":"age_group", "displayName":"Age Group", "format": "string", "scaleType":"categorical", "customDomain":["18 or younger", "19-23", "24-29", "30-39", "40 or older"], "customRange": [colors.turquoise.light, colors.turquoise.medium, colors.blue.light, colors.blue.medium, colors.purple.light]},

	full_part_time: {"variable":"full_part_time", "displayName":"", "format": "string", "scaleType":"categorical", "customDomain":["Exclusively Full-Time", "Exclusively Part-Time", "Mixed Full-Time and Part-Time"], "customRange": [colors.turquoise.light, colors.blue.light, colors.purple.light]},

	school_type: {"variable":"school_type", "displayName":"", "format": "string", "scaleType":"categorical", "customDomain":["Public four-year","Private four-year","Public two-year","For-profit","Two or more"], "customRange": [colors.turquoise.light, colors.turquoise.medium, colors.blue.light, colors.blue.medium, colors.purple.light]},

	ethnicity: {"variable":"ethnicity", "displayName":"Race/Ethnicity", "format": "string", "scaleType":"categorical", "customDomain":["White","Non-white","Black or African American","Hispanic or Latino","Asian","American Indian or Alaska Native","Native Hawaiian/other Pacific Islander","More than one race"], "customRange": [colors.turquoise.light, colors.blue.light, colors.turquoise.medium, colors.turquoise.dark, colors.blue.medium, colors.blue.dark, colors.purple.medium, colors.purple.dark]},
	percent_of_aid: {"variable":"percent_of_aid", "displayName":"Percent of Aid", "format": "percent"},
	category: {"variable":"category", "displayName":"", "format": "percent"},
}

let vizSettingsList = [
	// {
	// 	id: "#varying-degrees__students-funding", 
	// 	vizType: "percentage_stacked_bar",
	// 	primaryDataSheet: "funding",
	// 	groupingVar: variables.sector,
	// 	filterVars: [ variables.students_funding ],
	// 	aggregateData: false,
	// },
	// {
	// 	id: "#varying-degrees__government-funding", 
	// 	vizType: "percentage_stacked_bar",
	// 	primaryDataSheet: "funding",
	// 	groupingVar: variables.sector,
	// 	filterVars: [ variables.states_funding, variables.feds_funding ],
	// 	aggregateData: false,
	// 	showLegend: true
	// },
	// {
	// 	id: "#varying-degrees__avg-student-age", 
	// 	vizType: "dot_matrix",
	// 	primaryDataSheet: "avg_student_age",
	// 	orientation: "horizontal",
	// 	dotSettings: { "width": 9, "offset": 3},
	// 	filterVars: [ variables.age_group ],
	// 	legendSettings: {"orientation": "horizontal-center", "showValCounts": true, "valCountCustomFormattingFunc": (d) => { return d/10 + "%"; }  },
	// 	simpleDataVals: true,
	// 	eventSettings: {
	// 		"mouseover":{ "tooltip": false, "fill": false, "stroke": "white", "strokeWidth": 3},
	// 	}
	// },
	// {
	// 	id: "#varying-degrees__avg-student-full-part-time", 
	// 	vizType: "dot_matrix",
	// 	primaryDataSheet: "avg_student_full_part_time",
	// 	orientation: "horizontal",
	// 	dotSettings: { "width": 9, "offset": 3},
	// 	filterVars: [ variables.full_part_time ],
	// 	legendSettings: {"orientation": "horizontal-center", "showValCounts": true, "valCountCustomFormattingFunc": (d) => { return d/10 + "%"; } },
	// 	simpleDataVals: true,
	// 	eventSettings: {
	// 		"mouseover":{ "tooltip": false, "fill": false, "stroke": "white", "strokeWidth": 3},
	// 	}
	// },
	// {
	// 	id: "#varying-degrees__avg-student-school-type", 
	// 	vizType: "dot_matrix",
	// 	primaryDataSheet: "avg_student_school_type",
	// 	orientation: "horizontal",
	// 	dotSettings: { "width": 9, "offset": 3},
	// 	filterVars: [ variables.school_type ],
	// 	legendSettings: {"orientation": "horizontal-center", "showValCounts": true, "valCountCustomFormattingFunc": (d) => { return d/10 + "%"; }  },
	// 	simpleDataVals: true,
	// 	eventSettings: {
	// 		"mouseover":{ "tooltip": false, "fill": false, "stroke": "white", "strokeWidth": 3},
	// 	}
	// },
	{
		id: "#varying-degrees__percent-fin-aid", 
		vizType: "pie_chart",
		primaryDataSheet: "percent_fin_aid",
		labelVar: variables.ethnicity,
		dataVar: variables.percent_of_aid,
		categoryVar: variables.category,
		legendShowVals: true,
	}
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/edpolicy/varying_degrees.json",
	dataSheetNames:["funding", "percent_fin_aid"],
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);

	