import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";

let variables = {
	year_charged_or_deceased: {"variable":"year_charged_or_deceased", "displayName":"Year", "format":"year", "scaleType":"categorical", "color":"blue"},
	charged_or_deceased: {"variable":"charged_or_deceased", "displayName":"Charged or Deceased", "format":"string", "scaleType":"categorical", "color":"blue", "customDomain":["Charged", "Charged outside U.S.", "Deceased"], "customRange":[colors.turquoise.medium, colors.turquoise.light, colors.red.light]},
	full_name: {"variable":"full_name", "displayName":"Full Name", "format":"string"},
	date_charged: {"variable":"date_charged", "displayName":"Date Charged", "format":"string"},
	terror_plot: {"variable":"terror_plot", "displayName":"Terror Plot", "format":"string"},
	citizenship_status: {"variable":"citizenship_status", "displayName":"Citizenship Status", "format":"string", "scaleType":"categorical", "customDomain":["U.S. Born Citizen", "Naturalized Citizen", "Citizen of Unknown Status", "Permanent Resident", "Nonimmigrant Visa", "Illegal Immigrant", "Refugee", "Unknown"], "customRange":[colors.turquoise.dark, colors.turquoise.medium, colors.turquoise.light, colors.blue.dark, colors.blue.light, colors.purple.dark, colors.purple.light, colors.grey.medium_light]},
	char_awlaki: {"variable":"char_awlaki", "displayName":"Involvement with Awlaki", "format":"string", "scaleType":"categorical", "customDomain":["Ties", "Contact", "None"], "customRange":[colors.red.light, colors.purple.light, colors.grey.medium_light]},
	field_kids: {"variable":"field_kids", "displayName":"Kids", "format":"string", "scaleType":"categorical", "color":"blue"},
	age: {"variable":"age", "displayName":"Age", "format":"number", "scaleType":"categorical", "color":"turquoise"},
	marital_status: {"variable":"marital_status", "displayName":"Marital Status", "scaleType":"categorical", "format":"string", "customDomain":["Married", "Widowed", "Divorced", "Split", "Unmarried", "Unknown"], "customRange":[colors.turquoise.medium, colors.turquoise.light, colors.blue.light, colors.purple.light, colors.red.light, colors.grey.medium_light]},
	gender: {"variable":"gender", "displayName":"Gender", "format":"string", "scaleType":"categorical", "color":"red", "customDomain":["Female", "Male"], "customRange":[colors.red.light, colors.turquoise.light]},
	field_year_indicted: {"variable":"field_year_indicted", "displayName":"Field Indicted", "format":"year", "scaleType":"categorical", "color":"blue"},
	char_online_radicalization: {"variable":"char_online_radicalization", "format": "string"},
	headshot: {"variable":"headshot", "format":"image"},
	inv_informant: {"variable":"inv_informant", "format":"string"},
	inv_community_or_family_tip: {"variable":"inv_community_or_family_tip", "format":"string"},
	inv_public_tip: {"variable":"inv_public_tip", "format":"string"},
	
	deadly_attack_date: {"variable":"deadly_attack_date", "displayName":"Deadly Attack Date", "format":"date"},
	victims_killed: {"variable":"victims_killed", "displayName":"Victims Killed", "format":"number"},
	victims_wounded: {"variable": "victims_wounded", "displayName":"Victims Wounded", "format":"string"},
	ideology: {"variable":"ideology", "displayName":"Ideology", "format":"string", "scaleType":"categorical", "customDomain": ["Jihadist", "Right Wing", "Left Wing"], "customRange": [colors.red.light, colors.turquoise.light, colors.blue.light]},
	attack_name: {"variable": "name", "displayName":"Attack Name", "format":"string"},
	attack_description: {"variable": "description", "displayName":"Summary", "format":"string"},
}

let vizSettingsList = [
	{
		id: "#homegrown__outcome-for-extremist", 
		vizType: "grouped_dot_matrix",
		primaryDataSheet: "people_protected",
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
		primaryDataSheet: "people_protected",
		dotsPerRow: 5,
		distanceBetweenGroups: 15,
		groupingVars: [ variables.year_charged_or_deceased ],
		dividingLine: { value: "2011", title: "Post al-Awlaki", descriptionLines: ["Anwar al-Awlaki killed in drone strike on", "September 30, 2011"]},
		filterVars: [ variables.char_awlaki ],
		tooltipVars: [ variables.full_name, variables.char_awlaki, variables.terror_plot],
		tooltipImageVar: variables.headshot,
		labelSettings: { interval: 1, showNumVals: true},
		legendShowVals: true
	},
	{
		id: "#homegrown__gender-of-extremists", 
		vizType: "chart_with_fact_box",
		primaryDataSheet: "people_protected",
		chartSettings: {
			vizType: "grouped_dot_matrix",
			dotsPerRow: 5,
			distanceBetweenGroups: 15,
			groupingVars: [ variables.year_charged_or_deceased ],
			filterVars: [ variables.gender ],
			tooltipVars: [ variables.full_name, variables.charged_or_deceased, variables.gender, variables.date_charged, variables.terror_plot],
			tooltipImageVar: variables.headshot,
			labelSettings: { interval: 1, showNumVals: true}
		},
		factBoxSettings: {
			alignment: "left-aligned",
			factBoxVals: [ 
				{ variable: variables.gender, value: "Male", type:"percent", text: "Male"},
				{ variable: variables.gender, value: "Female", type:"percent", text:"Female"},
			],
		},
	},
	{
		id: "#homegrown__citizenship-status", 
		vizType: "dot_matrix",
		primaryDataSheet: "people_protected",
		orientation: "horizontal",
		filterVars: [ variables.citizenship_status ],
		tooltipVars: [ variables.full_name, variables.citizenship_status ],
		tooltipImageVar: variables.headshot,
		split: { splitFilterVar:variables.citizenship_status, splitVal: "Permanent Resident", leftLabel: "Citizens and Permanent Residents", rightLabel: "Non-residents and Unknown", splitAggregate: "percent"}
	},
	{
		id: "#homegrown__age-of-extremists",
		vizType: "chart_with_fact_box",
		primaryDataSheet: "people_protected",
		chartSettings: {
			vizType: "dot_histogram",
			groupingVars: [ variables.age ],
			filterVars: [ variables.marital_status ],
			tooltipVars: [ variables.full_name, variables.age, variables.marital_status, variables.terror_plot ],
			tooltipImageVar: variables.headshot,
			labelSettings: { interval: 5 }
		},
		factBoxSettings: {
			alignment: "right-aligned",
			factBoxVals: [ 
				{ variable: variables.age, type:"average", text: "Average Age"},
				{ variable: variables.marital_status, value: "Married", type:"percent", text:"Married"},
			],
		},
	},
	// {
	// 	id: "#homegrown__extremist-data-table", 
	// 	vizType: "table",
	// 	tableVars: [ variables.full_name, variables.gender, variables.age],
	// 	defaultOrdering: [0, "asc"],
	// 	pagination: true,
	// 	numPerPage: 25,
	// 	primaryDataSheet: "people_protected",
	// 	colorScaling: false
	// },
	{
		id: "#homegrown__fact-box__method-of-radicalization", 
		vizType: "fact_box",
		primaryDataSheet: "people_protected",
		factBoxType: "colored_boxes",
		factBoxVals: [ 
			{ variable: variables.char_online_radicalization, value: "Yes", type:"percent", color:colors.turquoise.light, text:"Maintained a social media profile with jihadist material or utilized encryption for plotting"},
		],
	},
	{
		id: "#homegrown__deadly-attacks",
		vizType: "line_chart",
		interpolation: "step",
		yScaleType: "cumulative",
		primaryDataSheet: "terror_plots",
		xVars: [ variables.deadly_attack_date ],
		yVars: [ variables.victims_killed ],
		colorVars: [ variables.ideology ],
		tooltipVars: [ variables.attack_name, variables.ideology, variables.victims_wounded, variables.victims_killed, variables.attack_description ],
		tooltipScrollable: true,
	},
	{
		id: "#homegrown__fact-box__prevention-method", 
		vizType: "fact_box",
		primaryDataSheet: "people_protected",
	 factBoxType: "colored_boxes",
		factBoxVals: [ 
			{ variable: variables.inv_informant, value: "Yes", type:"percent", color:colors.turquoise.light, text:"Percent of jihadists monitored by an informant"},
			{ variable: variables.inv_community_or_family_tip, value: "Yes", type:"percent", color:colors.blue.light, text:"Percent of jihadists implicated by a tip from family members or the community"},
			{ variable: variables.inv_public_tip, value: "Yes", type:"percent", color:colors.purple.light, text:"Percent of jihadists implicated by a tip from the general public"},
		],
	},
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/isp/homegrown_extremism.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/1UHVsknlx8sWPNg6nYBg2_WdXTp2RwnWwe7BdInWncdg/",
	dataSheetNames:["people_protected", "people_variables", "terror_plots", "terror_plots_variables"],
	imageFolderId: "0B2KbJlQb9jlgeG5hOXZqbURpRUE",
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);