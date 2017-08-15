import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	fund_name: {"variable":"fund_name", "displayName":"Fund Name", "format":"string", "category": "Basic Info"},
	country: {"variable":"country", "displayName":"Country", "format":"string", "category":"Basic Info"},
	aum_billions: {"variable":"aum_billions", "displayName":"AUM (Billions)", "format":"price", "category": "Basic Info", "scaleType":"linear", "customDomain": []},
	type: {"variable":"type", "displayName":"Type", "format":"string", "category": "Basic Info"},
	top_twenty: {"variable":"top_twenty", "displayName":"Fund Type", "format":"string", "category":"Top Twenty Funds", "scaleType": "categorical", "customDomain":["Top Twenty Fund", "Other Fund"], "customRange":[colors.turquoise.light, colors.black]},
	cumulative_score: {"variable":"cumulative_score", "displayName":"Cumulative Score", "format":"number", "scaleType": "quantize", "numBins":5, "customDomain": [0, 100], "customRange": [colors.white, colors.turquoise.light, colors.turquoise.dark]},	
	disclosure: {"variable":"disclosure", "displayName":"Disclosure", "format":"number", "scaleType": "categorical", "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	intention: {"variable":"intention", "displayName":"Intention", "format":"number", "scaleType": "categorical", "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	clarity: {"variable":"clarity", "displayName":"Clarity", "format":"number", "scaleType": "categorical", "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	integration: {"variable":"integration", "displayName":"Integration", "format":"number", "scaleType": "categorical", "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	implementation: {"variable":"implementation", "displayName":"Implementation", "format":"number", "scaleType": "categorical", "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	implementation_2: {"variable":"implementation_2", "displayName":"Implementation 2", "format":"number", "scaleType": "categorical", "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	commitment: {"variable":"commitment", "displayName":"Commitment", "format":"number", "scaleType": "categorical", "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	accountability: {"variable":"accountability", "displayName":"Accountability", "format":"number", "scaleType": "categorical", "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	partnership: {"variable":"partnership", "displayName":"Partnership", "format":"number", "scaleType": "categorical", "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	standards: {"variable":"standards", "displayName":"Standards", "format":"number", "scaleType": "categorical", "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	development: {"variable":"development", "displayName":"Development", "format":"number", "scaleType": "categorical", "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	development_2: {"variable":"development_2", "displayName":"Development 2", "format":"number", "scaleType": "categorical", "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},


	

	title: {"variable":"title", "displayName":"Title", "format":"string"},
	description: {"variable":"description", "displayName":"Description", "format":"string"},
	category: {"variable":"category", "displayName":"Cateogry", "format":"string"},
}

let vizSettingsList = [
	{
		id: "#asset-allocator__world-map",
		vizType: "pindrop_map",
		primaryDataSheet: "top_twenty",
		// isMessagePasser: true,
		// messageHandlerType: "change_value",
		geometryType: "world",
		stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "1", hoverOpacity: ".6"},
		pinRadius: 5,
		idVar: variables.fund_name,
		filterVars: [ variables.top_twenty],
		radiusVar: variables.aum_billions,
		tooltipVars: [ variables.fund_name, variables.country, variables.aum_billions, variables.type, variables.cumulative_score, variables.disclosure, variables.intention, variables.clarity, variables.integration, variables.implementation, variables.implementation_2, variables.commitment, variables.accountability, variables.partnership, variables.standards, variables.development, variables.development_2 ],
		filterGroupSettings: {"hidden": false},
		legendSettings: {"orientation": "horizontal-center", "showTitle": true},
		zoomable: true,
		// clickToProfile: { "variable": variables.program.variable, "url": "https://www.newamerica.org/in-depth/integrating-technology-early-literacy/program-profile/?" }
	},
	{
		id: "#asset-allocator__world-map-all",
		vizType: "pindrop_map",
		primaryDataSheet: "funds",
		// isMessagePasser: true,
		// messageHandlerType: "change_value",
		geometryType: "world",
		stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "1", hoverOpacity: ".6"},
		pinRadius: 5,
		idVar: variables.fund_name,
		filterVars: [ variables.cumulative_score, variables.disclosure, variables.intention, variables.clarity, variables.integration, variables.implementation, variables.implementation_2, variables.commitment, variables.accountability, variables.partnership, variables.standards, variables.development, variables.development_2  ],
		radiusVar: variables.aum_billions,
		tooltipVars: [ variables.fund_name, variables.country, variables.aum_billions, variables.type, variables.cumulative_score, variables.disclosure, variables.intention, variables.clarity, variables.integration, variables.implementation, variables.implementation_2, variables.commitment, variables.accountability, variables.partnership, variables.standards, variables.development, variables.development_2 ],
		filterGroupSettings: {"hidden": false},
		legendSettings: {"orientation": "horizontal-center", "showTitle": true},
		zoomable: true,
		// clickToProfile: { "variable": variables.program.variable, "url": "https://www.newamerica.org/in-depth/integrating-technology-early-literacy/program-profile/?" }
	},
	{
		id: "#asset-allocator__top-twenty-list",
		primaryDataSheet: "top_twenty",
		vizType: "table",
		filterInitialDataFunction: (d) => {
			console.log(d)
			return d.top_twenty == "Top Twenty Fund";
		},
		tableVars: [ variables.fund_name, variables.country, variables.aum_billions, variables.type, variables.disclosure, variables.intention, variables.clarity, variables.integration, variables.implementation, variables.implementation_2, variables.commitment, variables.accountability, variables.partnership, variables.standards, variables.development, variables.development_2, variables.cumulative_score ],
		defaultOrdering: [16, "desc"],
		pagination: false,
		numPerPage: 20,
		freezeColumn: {leftColumns: 1, rightColumns: 1},
		colorScaleColumns: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
	},
	{
		id: "#asset-allocator__disclosure", 
		vizType: "category_breakdown",
		primaryDataSheet: "funds",
		dotSettings: { "width": 12, "offset": 3},
		filterVars: [ variables.disclosure ],
		tooltipVars: [ variables.fund_name, variables.country, variables.aum_billions, variables.type, variables.cumulative_score, variables.disclosure],
		quantityLabel: "funds",
		idVar: variables.fund_name,
	},
	
]

let reactVizSettingsList = [
	{
		id: "#asset-allocator__metric-definitions",
		vizType: "definition_explorer",
		primaryDataSheet: "metric_definitions",
		titleVar: variables.title,
		descriptionVar: variables.description,
		categoryVar: variables.category,
	},
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/bw2/asset_allocator.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/13kxwNQPWpvjnBrw788YNa28Fwf5Yaa_0lwtxz3_cK3s/",
	dataSheetNames:["funds", "top_twenty", "metric_definitions"],
	vizSettingsList: vizSettingsList,
	reactVizSettingsList: reactVizSettingsList
}

setupProject(projectSettings);

