import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	name: {"variable":"name", "displayName":"Program", "format": "string"},
	primary_technological_tool: {"variable":"primary_technological_tool", "displayName":"Primary Tech Tool", "format": "string", "scaleType":"categorical", "canSplitCategory":true, "customDomain":["Video", "Video Conference", "Video Recorder", "Touchscreen Tablet", "Web App/ Website", "Mobile: Text Message", "Mobile: App", "Other"], "customRange":[colors.turquoise.light, colors.turquoise.medium, colors.turquoise.dark, colors.purple.light, colors.purple.dark, colors.blue.light, colors.blue.medium, colors.grey.medium]},
	start_year: {"variable":"start_year", "displayName":"Year", "format": "year", "color": colors.turquoise.light},
	program_affiliation: {"variable":"program_affiliation", "displayName":"Program Affiliation", "format": "string", "canSplitCategory":true, "scaleType": "categorical", "customDomain":["The Campaign for Grade-Level Reading", "Ready to Learn", "Neither"], "customRange":[colors.turquoise.light, colors.blue.light, colors.grey.medium]},
	languages_summarized: {"variable":"languages_summarized", "displayName":"Languages", "format": "string", "canSplitCategory":true, "scaleType": "categorical", "customDomain":["English", "English and Spanish", "English, Spanish, and Other", "English and L3 is multi-lingual"], "customRange": [colors.turquoise.light, colors.turquoise.medium, colors.turquoise.dark, colors.blue.light]},
	program_type: {"variable":"program_type", "displayName":"Program Type", "format": "string", "canSplitCategory":true, "scaleType": "categorical", "customDomain":["Center/ School Initiative", "Professional Learning", "Home Visiting/ Family Engagement", "Library/ Museum", "Public Media Partnership"], "customRange":[colors.turquoise.light, colors.blue.light, colors.purple.light, colors.turquoise.medium, colors.blue.medium]},
	number_served: {"variable":"number_served", "displayName":"Number Served", "format": "string", "canSplitCategory":true, "scaleType": "categorical", "customDomain":["0-100", "100-500", "500-1000", "1000-5000", "5000-10000", "10000+", "Not directly serving children"], "customRange":[colors.turquoise.very_light, colors.turquoise.light, colors.turquoise.medium, colors.turquoise.dark, colors.blue.dark, colors.purple.dark, colors.red.light]},
	age_served: {"variable":"age_served", "displayName":"Ages Served", "format": "string", "canSplitCategory":true, "scaleType": "categorical", "customDomain":["0-3 years", "4-5 years", "6-8 years", "All 3 Age Groups"], "customRange":[colors.turquoise.light, colors.blue.light, colors.purple.light, colors.turquoise.dark]},
	tech_tool: {"variable":"tech_tool", "displayName":"Other Tech Tools", "format": "string"},

	evidence_of_impact_rating: {"variable":"evidence_of_impact_rating", "displayName":"Evidence of Impact Rating", "format": "string", "canSplitCategory":true, "scaleType": "categorical", "customDomain":["Developing", "Emerging", "Promising", "Strong"], "customRange":[colors.turquoise.light, colors.blue.light, colors.purple.light, colors.turquoise.dark]},
	location: {"variable":"Location", "displayName":"Location", "format": "string"},
	program: {"variable":"Program", "displayName":"Program", "format": "string"},


}


let vizSettingsList = [
	// {
	// 	id: "#intel__primary-tech-tool", 
	// 	vizType: "category_breakdown",
	// 	primaryDataSheet: "programs",
	// 	dotSettings: { "width": 20, "offset": 5},
	// 	filterVars: [ variables.primary_technological_tool ],
	// 	tooltipVars: [ variables.name, variables.primary_technological_tool, variables.tech_tool],
	// 	quantityLabel: "programs",
	// 	idVar: variables.name
	// 	// clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/fifty-state-solution/state-profile/?" }	
	// },
	// {
	// 	id: "#intel__start-year",
	// 	primaryDataSheet: "programs",
	// 	vizType: "comparative_dot_histogram",
	// 	groupingVars: [ variables.start_year ],
	// 	titleVar: variables.name,
	// 	legendSettings: {"orientation": "horizontal-center", "showTitle": false},
	// 	annotationSplits: [ {"value": "2011", "textSpans": ["Tablet invented and", "first introduced to schools"] }],
	// 	// clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/pre-k-leaders/state-profile/?" }
	// },
	// {
	// 	id: "#intel__start-year1",
	// 	primaryDataSheet: "programs",
	// 	vizType: "dot_histogram",
	// 	groupingVars: [ variables.start_year ],
	// 	filterVars: [ variables.primary_technological_tool ],
	// 	tooltipVars: [ variables.name, variables.start_year ],
	// 	labelSettings: { interval: 2 },
	// 	dotSettings: { "width": 20, "offset": 10 },
	// 	legendSettings: {"orientation": "horizontal-center"},
	// 	eventSettings: {
	// 		"mouseover":{ "tooltip": true, "fill": false, "stroke": "white", "strokeWidth": 3},
	// 	}
	// },
	// {
	// 	id: "#intel__national-initiatives", 
	// 	vizType: "pindrop_map",
	// 	primaryDataSheet: "programs",
	// 	geometryType: "states",
	// 	stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "1", hoverOpacity: ".6"},
	// 	pinRadius: 5.5,
	//	filterVars: [ variables.program_affiliation, variables.program_type, variables.languages_summarized, variables.number_served, variables.age_served ],
	// 	tooltipVars: [ variables.name, variables.program_affiliation, variables.program_type, variables.languages_summarized, variables.number_served, variables.age_served ],
	// 	filterGroupSettings: {"hidden": false},
	// 	legendSettings: {"orientation": "vertical-right", "showTitle": true},
	// },
	{
		id: "#intel__locations",
		vizType: "dashboard",
		defaultValue: null,
		layoutRows: [
			[
				{
					vizType: "select_box",
					primaryDataSheet: "program_locations",
					variable: variables.program,
					passValueName: true,
					isMessagePasser: true,
					messageHandlerType: "change_value",
					placeholder: "Select a Program",
					hasShowAllButton: true,
					sortVals: true
				}
			],
			[
				{ 
					vizType: "pindrop_map",
					primaryDataSheet: "program_locations",
					isMessagePasser: true,
					messageHandlerType: "change_value",
					geometryType: "states",
					stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "1", hoverOpacity: ".6"},
					pinRadius: 4,
					idVar: variables.program,
					filterVars: [ variables.evidence_of_impact_rating ],
					tooltipVars: [ variables.program, variables.location, variables.evidence_of_impact_rating ],
					filterGroupSettings: {"hidden": false},
					legendSettings: {"orientation": "vertical-right", "showTitle": true},
					zoomable: true
				}
			]
		]
	},
]

const reactVizSettingsList = [
	{
		id: "#intel__resource-toolkit", 
		vizType: "resource_toolkit",
		primaryDataSheet: "toolkit_resources",
	},
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/edpolicy/intel.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/1eUKKUR-tAv_BbjD243xRyG2348I125QUgHDJUxVoO78",
	dataSheetNames:["programs"],
	vizSettingsList: vizSettingsList,
	reactVizSettingsList: reactVizSettingsList
}

setupProject(projectSettings);

	