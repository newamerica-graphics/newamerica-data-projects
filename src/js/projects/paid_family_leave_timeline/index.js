import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	week: {"variable":"week", "displayName":"Week", "format": "string"},
	category: {"variable":"category", "displayName":"Category", "format": "string"},
	description: {"variable":"description", "displayName":"Description", "format": "string"},
}

let vizSettingsList = [
	{
		id: "#paid-family-leave-timeline__timeline", 
		vizType: "vertical_timeline",
		primaryDataSheet: "timeline",
		timeVar: variables.week,
		categoryVar: variables.category,
		descriptionVar: variables.description
	},
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
	// 	filterVars: [ variables.program_affiliation, variables.program_type, variables.languages_summarized, variables.number_served, variables.age_served ],
	// 	tooltipVars: [ variables.name, variables.program_affiliation, variables.program_type, variables.languages_summarized, variables.number_served, variables.age_served ],
	// 	filterGroupSettings: {"hidden": false},
	// 	legendSettings: {"orientation": "vertical-right", "showTitle": true},
	// },
]



let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/bll/paid_family_leave.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/1LNeGat4tkirj4IqpXUEa4DhD3nO39saOmjWRMyU-a1I",
	dataSheetNames:["timeline"],
	vizSettingsList: vizSettingsList,
}

setupProject(projectSettings);

	