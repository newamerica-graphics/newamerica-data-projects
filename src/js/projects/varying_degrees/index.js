import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";
import $ from 'jquery';

$.getScript('https://na-data-projects.s3.amazonaws.com/projects/varying_degrees-submodule.js', (d, err) => {
	console.log(err);
})

let variables = {
	sector: {"variable":"sector", "displayName":"Sector", "format": "string"},
	students_funding: {"variable":"students_funding", "displayName":"Funding from Students", "format": "percent", color:colors.turquoise.light},
	states_funding: {"variable":"states_funding", "displayName":"Funding from States", "format": "percent", color:colors.turquoise.light},
	feds_funding: {"variable":"feds_funding", "displayName":"Funding from Federal Govt.", "format": "percent", color:colors.blue.dark},

	avg_student_age: {"variable":"category", "displayName":"Age", "format": "string", "scaleType":"categorical", "customDomain":["18 or younger", "19-23", "24-29", "30-39", "40 or older"], "customRange": [colors.turquoise.light, colors.turquoise.medium, colors.blue.light, colors.blue.medium, colors.purple.light], "dataSheet":"avg_student_age"},
	avg_student_full_part_time: {"variable":"category", "displayName":"Enrollment", "format": "string", "scaleType":"categorical", "customDomain":["Exclusively Full-Time", "Exclusively Part-Time", "Mixed Full-Time and Part-Time"], "customRange": [colors.turquoise.light, colors.blue.light, colors.purple.light], "dataSheet":"avg_student_full_part_time"},
	avg_student_school_type: {"variable":"category", "displayName":"School Type", "format": "string", "scaleType":"categorical", "customDomain":["Public four-year","Private four-year","Public two-year","For-profit","Two or more"], "customRange": [colors.turquoise.light, colors.turquoise.medium, colors.blue.light, colors.purple.light, colors.blue.medium], "dataSheet":"avg_student_school_type"},
	avg_student_dependents: {"variable":"category", "displayName":"Dependents", "format": "string", "scaleType":"categorical", "customDomain":["Have Children", "Do Not Have Children"], "customRange": [colors.turquoise.light, colors.blue.light], "dataSheet":"avg_student_dependents"},
	avg_student_learning_environment: {"variable":"category", "displayName":"Learning Environment", "format": "string", "scaleType":"categorical", "customDomain":["Classroom Only", "Online Only", "Blend of Classroom and Online"], "customRange": [colors.turquoise.light, colors.blue.light, colors.purple.light], "dataSheet":"avg_student_learning_environment"},
	avg_student_gender: {"variable":"category", "displayName":"Gender", "format": "string", "scaleType":"categorical", "customDomain":["Female", "Male"], "customRange": [colors.turquoise.light, colors.blue.light], "dataSheet":"avg_student_gender"},
	avg_student_employment: {"variable":"category", "displayName":"Employment", "format": "string", "scaleType":"categorical", "customDomain":["Full-time", "Part-time", "Not Employed"], "customRange": [colors.turquoise.dark, colors.turquoise.light, colors.red.light], "dataSheet":"avg_student_employment"},
	avg_student_financial_aid: {"variable":"category", "displayName":"Financial Aid", "format": "string", "scaleType":"categorical", "customDomain":["Receive Pell Grants", "Do Not Receive Pell Grants"], "customRange": [colors.turquoise.light, colors.red.light], "dataSheet":"avg_student_financial_aid"},
	avg_student_housing: {"variable":"category", "displayName":"Housing", "format": "string", "scaleType":"categorical", "customDomain":["Campus Residence Hall","Fraternity or Sorority House","Other University Housing","Parent/Guardian Home","Other Off-campus Housing","Other"], "customRange": [colors.turquoise.light, colors.turquoise.medium, colors.turquoise.dark, colors.blue.light, colors.blue.dark, colors.purple.light], "dataSheet":"avg_student_housing"},

	ethnicity: {"variable":"ethnicity", "displayName":"Race/Ethnicity", "format": "string", "scaleType":"categorical", "customDomain":["White","Non-white","Black or African American","Hispanic or Latino","Asian","American Indian or Alaska Native","Native Hawaiian/other Pacific Islander","More than one race"], "customRange": [colors.turquoise.light, colors.blue.light, colors.turquoise.medium, colors.turquoise.dark, colors.blue.medium, colors.blue.dark, colors.purple.medium, colors.purple.dark]},
	percent_of_aid: {"variable":"percent_of_aid", "displayName":"Percent of Aid", "format": "percent"},
	category: {"variable":"category", "displayName":"", "format": "percent"},

	state_spending_year: {"variable":"year", "displayName":"Year", "format":"year", "scaleType":"categorical"},
	state_spending_total: {"variable":"total", "displayName":"Total Spending (Billions)", "format":"price_billions_round", "color": colors.turquoise.light, "scaleType": "linear", "customDomain": [80000000000, 100000000000]},
	state_spending_per_student: {"variable":"per_fte", "displayName":"Per Student", "format":"price", "color": colors.turquoise.dark ,"customDomain": [7000, 10000]},

	federal_spending_year: {"variable":"year", "displayName":"Year", "format":"year", "scaleType":"categorical"},
	federal_spending_total: {"variable":"total", "displayName":"Total Spending (Billions)", "format":"price_billions_round", "color": colors.turquoise.light, "scaleType": "linear", "customDomain": [100000000000, 200000000000]},
	federal_spending_per_student: {"variable":"per_student", "displayName":"Per Student", "format":"price", "color": colors.turquoise.dark ,"customDomain": [5000, 10000]},

}

let vizSettingsList = [
	{
		id: "#varying-degrees__students-funding", 
		vizType: "percentage_stacked_bar",
		primaryDataSheet: "funding",
		groupingVar: variables.sector,
		filterVars: [ variables.students_funding ],
		aggregateData: false,
	},
	{
		id: "#varying-degrees__government-funding", 
		vizType: "percentage_stacked_bar",
		primaryDataSheet: "funding",
		groupingVar: variables.sector,
		filterVars: [ variables.states_funding, variables.feds_funding ],
		aggregateData: false,
		showLegend: true
	},
	{
		id: "#varying-degrees__avg-student-age", 
		vizType: "dot_matrix",
		primaryDataSheet: "avg_student_age",
		orientation: "horizontal",
		dotSettings: { "width": 9, "offset": 3},
		filterVars: [ variables.avg_student_age ],
		legendSettings: {"orientation": "horizontal-center", "showValCounts": true },
		simpleDataVals: true,
		eventSettings: {
			"mouseover":{ "tooltip": false, "fill": false, "stroke": "white", "strokeWidth": 3},
		}
	},
	{
		id: "#varying-degrees__avg-student-full-part-time", 
		vizType: "dot_matrix",
		primaryDataSheet: "avg_student_full_part_time",
		orientation: "horizontal",
		dotSettings: { "width": 9, "offset": 3},
		filterVars: [ variables.avg_student_full_part_time ],
		legendSettings: {"orientation": "horizontal-center", "showValCounts": true },
		simpleDataVals: true,
		eventSettings: {
			"mouseover":{ "tooltip": false, "fill": false, "stroke": "white", "strokeWidth": 3},
		}
	},
	{
		id: "#varying-degrees__avg-student-school-type", 
		vizType: "dot_matrix",
		primaryDataSheet: "avg_student_school_type",
		orientation: "horizontal",
		dotSettings: { "width": 9, "offset": 3},
		filterVars: [ variables.avg_student_school_type ],
		legendSettings: {"orientation": "horizontal-center", "showValCounts": true },
		simpleDataVals: true,
		eventSettings: {
			"mouseover":{ "tooltip": false, "fill": false, "stroke": "white", "strokeWidth": 3},
		}
	},
	{
		id: "#varying-degrees__percent-fin-aid", 
		vizType: "pie_chart",
		primaryDataSheet: "percent_fin_aid",
		labelVar: variables.ethnicity,
		dataVar: variables.percent_of_aid,
		categoryVar: variables.category,
		legendShowVals: true,
	},
	{
		id: "#varying-degrees__state-spending", 
		vizType: "bar_line_combo",
		primaryDataSheet: "state_spending",
		xVar: variables.state_spending_year,
		barVar: variables.state_spending_total,
		lineVar: variables.state_spending_per_student,
		
	},
	{
		id: "#varying-degrees__federal-spending", 
		vizType: "bar_line_combo",
		primaryDataSheet: "fed_spending",
		xVar: variables.federal_spending_year,
		barVar: variables.federal_spending_total,
		lineVar: variables.federal_spending_per_student,
	},
	{
		id: "#varying-degrees__avg-student-aggregate", 
		vizType: "filterable_dot_matrix",
		filterVars: [ variables.avg_student_age, variables.avg_student_full_part_time, variables.avg_student_school_type, variables.avg_student_dependents, variables.avg_student_learning_environment, variables.avg_student_gender, variables.avg_student_employment, variables.avg_student_financial_aid, variables.avg_student_housing ],
		orientation: "horizontal",
		dotSettings: { "width": 9, "offset": 3},
		legendSettings: {"orientation": "horizontal-center", "showValCounts": true },
		simpleDataVals: true,
		eventSettings: {
			"mouseover":{ "tooltip": false, "fill": false, "stroke": "white", "strokeWidth": 3},
		}
	},
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/edpolicy/varying_degrees.json",
	customDataDownloadSource: "https://na-data-projects.s3.amazonaws.com/data/edpolicy/NA_VaryingDegrees_Data.zip",
	dataSheetNames:["funding", "percent_fin_aid"],
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);

	