let { colors } = require("../../helper_functions/colors.js")

let variables = {
	fund_name: {"variable":"fund_name", "displayName":"Fund Name", "format":"string"},
	country: {"variable":"country", "displayName":"Country", "format":"string"},
	region: {"variable":"region", "displayName":"Region", "format":"string"},
	inception: {"variable":"inception", "displayName":"Inception", "format":"string"},
	quintile: {"variable":"quintile", "displayName":"Quintile", "format":"string"},
	aum_bn: {"variable":"aum_bn", "displayName":"AUM (Billions)", "format":"price", "scaleType":"linear", "customDomain": [], "disableTableOrdering": true},
	aum_date: {"variable":"aum_date", "displayName":"AUM Last Updated", "format":"year"},
	type: {"variable":"type", "displayName":"Type", "format":"string"},
	top_twenty: {"variable":"top_twenty", "displayName":"Asset Allocator Group", "format":"string", "category":"Top Twenty Funds", "scaleType": "categorical", "customDomain":["Leaders List", "Other Rated Funds"], "customRange":[colors.turquoise.light, colors.black]},
	cumulative_score: {"variable":"cumulative_score", "displayName":"Cumulative Score", "format":"number", "scaleType": "quantize", "numBins":5, "customDomain": [0, 100], "customRange": [colors.white, colors.turquoise.light, colors.turquoise.dark]},	

	disclosure: {"variable":"disclosure", "displayName":"1. Disclosure", "format":"number", "scaleType": "categorical", "disableTableOrdering":true, "passFailChecks": true, "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	intention: {"variable":"intention", "displayName":"2. Intention", "format":"number", "scaleType": "categorical", "disableTableOrdering":true, "passFailChecks": true, "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	clarity: {"variable":"clarity", "displayName":"3. Clarity", "format":"number", "scaleType": "categorical", "disableTableOrdering":true, "passFailChecks": true, "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	integration: {"variable":"integration", "displayName":"4. Integration", "format":"number", "scaleType": "categorical", "disableTableOrdering":true, "passFailChecks": true, "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	implementation_1: {"variable":"implementation_1", "displayName":"5a. Implementation - Strategies", "format":"number", "scaleType": "categorical", "disableTableOrdering":true, "passFailChecks": true, "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	implementation_2: {"variable":"implementation_2", "displayName":"5b. Implementation - Benchmarks", "format":"number", "scaleType": "categorical", "disableTableOrdering":true, "passFailChecks": true, "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	commitment: {"variable":"commitment", "displayName":"6. Commitment", "format":"number", "scaleType": "categorical", "disableTableOrdering":true, "passFailChecks": true, "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	accountability: {"variable":"accountability", "displayName":"7. Accountability", "format":"number", "scaleType": "categorical", "disableTableOrdering":true, "passFailChecks": true, "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	partnership: {"variable":"partnership", "displayName":"8. Partnership", "format":"number", "scaleType": "categorical", "disableTableOrdering":true, "passFailChecks": true, "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	standards: {"variable":"standards", "displayName":"9. Standards", "format":"number", "scaleType": "categorical", "disableTableOrdering":true, "passFailChecks": true, "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	development_1: {"variable":"development_1", "displayName":"10a. Development - Frontier Markets", "format":"number", "scaleType": "categorical", "disableTableOrdering":true, "passFailChecks": true, "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},
	development_2: {"variable":"development_2", "displayName":"10b. Development - Sustainability", "format":"number", "scaleType": "categorical", "disableTableOrdering":true, "passFailChecks": true, "customDomain": ["Passed", "Failed"], "customRange": [colors.turquoise.light, colors.red.light]},

	title: {"variable":"title", "displayName":"Title", "format":"string"},
	criteria: {"variable":"criteria", "displayName":"Criteria", "format":"string"},
	criteria_description: {"variable":"criteria_description", "displayName":"Description", "format":"string"},
	example: {"variable":"example", "displayName":"Example", "format":"string"},
	category: {"variable":"category", "displayName":"Category", "format":"string"},
	leaders_score_avg: {"variable":"leaders_score_avg", "displayName":" Average Score for Leaders", "format":"number", "color": colors.turquoise.light},
	rest_score_avg: {"variable":"rest_score_avg", "displayName":"Average Score for Rest of Funds", "format":"number", "color": colors.blue.light},

	fund_category: {"variable":"fund_category", "displayName":"Fund Category", "format":"string"},
	aum_tn: {"variable":"aum_tn", "displayName":"AUM (Trillions)", "format":"price", "scaleType":"linear", "color": colors.turquoise.light},
	number_of_funds: {"variable":"number_of_funds", "displayName":"Number of Funds", "format":"number", "color": colors.blue.light},

	combined_aum: {"variable":"combined_aum", "displayName":"AUM (Billions)", "format":"price"},
	percent_of_funds: {"variable":"percent_of_funds", "displayName":"Percent of Funds", "format":"percent", "color": colors.blue.light},
	percent_of_aum_bn: {"variable":"percent_of_aum_bn", "displayName":"Percent of AUM", "format":"percent", "color": colors.turquoise.light},
}

let vizSettings = {
	"asset-allocator__bar-chart": {
		vizType: "bar_chart",
		primaryDataSheet: "aggregate_scores",
		orientation: "horizontal",
		groupingVar: variables.category, 
		filterVars: [variables.leaders_score_avg, variables.rest_score_avg],
		filtersUseSameScale: true,
		tooltipVars: [variables.category, variables.leaders_score_avg, variables.rest_score_avg],
		legendSettings: {"orientation": "horizontal-center", "showTitle": false, "disableValueToggling": false},
		groupingAxisLabelInterval: {"small": 1, "medium": 1, "large": 1},
		labelValues: false,
		eventSettings: {
			"mouseover":{ "tooltip": true, "stroke": false }
		},
		customLeftMargin: 200,
		showValueAxis: true
	},
	"asset-allocator__world-map": {
		vizType: "pindrop_map",
		primaryDataSheet: "funds",
		geometryType: "world",
		stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "1", hoverOpacity: ".6"},
		pinRadius: 5,
		idVar: variables.fund_name,
		filterVars: [ variables.top_twenty ],
		radiusVar: variables.aum_bn,
		tooltipVars: [ variables.fund_name, variables.country, variables.region, variables.aum_bn, variables.aum_date, variables.quintile ],
		filterGroupSettings: {"hidden": false},
		legendSettings: {"orientation": "horizontal-center", "showTitle": true},
		zoomable: false,
		applyForce: true
		// clickToProfile: { "variable": variables.program.variable, "url": "https://www.newamerica.org/in-depth/integrating-technology-early-literacy/program-profile/?" }
	},
	"asset-allocator__table": {
		primaryDataSheet: "funds",
		vizType: "table",
		tableVars: [ variables.fund_name, variables.country, variables.aum_bn, variables.aum_date, variables.type, variables.quintile, variables.disclosure, variables.intention, variables.clarity, variables.integration, variables.implementation_1, variables.implementation_2, variables.commitment, variables.accountability, variables.partnership, variables.standards, variables.development_1, variables.development_2 ],
		defaultOrdering: [5, "asc"],
		pagination: true,
		numPerPage: 20,
		freezeColumn: {leftColumns: 1},
	},
	"asset-allocator__leaders-table": {
		primaryDataSheet: "funds",
		filterInitialDataFunction: (d) => { return d.top_twenty === "Leaders List"; },
		vizType: "table",
		tableVars: [ variables.fund_name, variables.country, variables.region, variables.inception, variables.aum_bn, variables.aum_date ],
		defaultOrdering: [0, "asc"],
		pagination: false,
		numPerPage: 25,
	},
	"asset-allocator__swf-and-gpf": {
		vizType: "bar_chart",
		primaryDataSheet: "swf_and_gpf",
		orientation: "vertical",
		groupingVar: variables.fund_category, 
		filterVars: [variables.number_of_funds, variables.aum_tn],
		filtersUseSameScale: false,
		tooltipVars: [variables.fund_category, variables.number_of_funds, variables.aum_tn],
		legendSettings: {"orientation": "horizontal-center", "showTitle": false, "disableValueToggling": false},
		groupingAxisLabelInterval: {"small": 1, "medium": 1, "large": 1},
		labelValues: false,
		eventSettings: {
			"mouseover":{ "tooltip": true, "stroke": false }
		},
		showValueAxis: true
	},
	"asset-allocator__regional-composition": {
		vizType: "bar_chart",
		primaryDataSheet: "regional_composition",
		orientation: "horizontal",
		groupingVar: variables.region, 
		filterVars: [variables.percent_of_funds, variables.percent_of_aum_bn],
		filtersUseSameScale: true,
		tooltipVars: [variables.region, variables.percent_of_funds, variables.percent_of_aum_bn],
		legendSettings: {"orientation": "horizontal-center", "showTitle": false, "disableValueToggling": false},
		groupingAxisLabelInterval: {"small": 1, "medium": 1, "large": 1},
		labelValues: false,
		eventSettings: {
			"mouseover":{ "tooltip": true, "stroke": false }
		},
		showValueAxis: true
	},
	"asset-allocator__metric-definitions": {
		isReact: true,
		vizType: "definition_explorer",
		primaryDataSheet: "metric_definitions",
		titleVar: variables.title,
		descriptionVars: [variables.criteria, variables.criteria_description],
		categoryVar: variables.category,
		sorting: "numerical",
		format: "single-column"
	},
}

module.exports = {
	vizSettings: vizSettings,
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/bw2/asset_allocator.json"
}

