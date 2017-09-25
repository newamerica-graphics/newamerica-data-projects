import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";

let d3 = require("d3");

let variables = {
	id: {"variable": "id", "displayName":"ID", "format":"number"},
	macro_category: {"variable": "macro_category", "displayName":"Macro Category", "format":"string", "scaleType":"categorical", "customDomain":["Collection Violation", "Communications Access and Retention Violation", "Other Minimization and Unknown Violation"], "customRange":[colors.blue.light, colors.turquoise.light, colors.purple.light]},
	primary_category_all: {"variable": "primary_category", "displayName":"Category", "format":"string", "scaleType":"categorical", "customDomain": ["Tasking Violation", "Reverse Targeting Violation", "Post-Tasking Review Violation", "Detasking Violation", "Overcollection Violation", "Unauthorized Access Violation", "Attorney-Client Privilege Violation", "Query Violation", "Dissemination Violation", "Data Retention Violation", "Documentation Violation", "Notification Violation", "General Minimization Violation", "Unknown Violation"], "customRange": [colors.blue.very_light, colors.blue.very_light_2, colors.blue.light, colors.blue.medium, colors.blue.dark, colors.turquoise.very_light, colors.turquoise.very_light_2, colors.turquoise.light, colors.turquoise.medium, colors.turquoise.dark, colors.purple.very_light, colors.purple.light, colors.purple.medium, colors.purple.dark]},
	primary_category__collection: {"variable": "primary_category", "displayName":"Category", "format":"string", "scaleType":"categorical", "customDomain":["Tasking Violation", "Reverse Targeting Violation", "Post-Tasking Review Violation", "Detasking Violation", "Overcollection Violation"], "customRange":[colors.blue.very_light, colors.blue.very_light_2, colors.blue.light, colors.blue.medium, colors.blue.dark]},
	primary_category__communications_access: {"variable": "primary_category", "displayName":"Category", "format":"string", "scaleType":"categorical", "customDomain":["Unauthorized Access Violation", "Attorney-Client Privilege Violation", "Query Violation", "Dissemination Violation", "Data Retention Violation"], "customRange":[colors.turquoise.very_light, colors.turquoise.very_light_2, colors.turquoise.light, colors.turquoise.medium, colors.turquoise.dark]},
	primary_category__other: {"variable": "primary_category", "displayName":"Category", "format":"string", "scaleType":"categorical", "customDomain":["Documentation Violation", "Notification Violation", "General Minimization Violation", "Unknown Violation"], "customRange":[colors.purple.very_light, colors.purple.light, colors.purple.medium, colors.purple.dark]},
	description: {"variable":"description", "displayName":"Description", "format": "string", "disableTableOrdering": true},
	remedy: {"variable":"remedy", "displayName":"Remedy", "format": "string", "disableTableOrdering": true},
	date: {"variable":"date", "displayName":"Date", "format": "date"},
	year: {"variable":"year", "displayName":"Year", "format": "year"},
	sources_combined: {"variable":"sources_combined", "displayName":"Source(s)", "format": "link", "disableTableOrdering": true},

	title: {"variable":"title", "displayName":"Title", "format":"string"},
	category: {"variable":"category", "displayName":"Cateogry", "format":"string"},
}

const getDataFilterFunction = (filterVar) => {
	let varDomain = filterVar.customDomain;
	return (d) => { return varDomain.indexOf(d.primary_category) > -1; }
}

let vizSettingsList = [
	{
		id: "#compliance-violations__list",
		vizType: "table",
		primaryDataSheet: "violations",
		tableVars: [ variables.primary_category__collection, variables.year, variables.description, variables.remedy, variables.sources_combined],
		defaultOrdering: [1, "desc"],
		pagination: true,
		numPerPage: 15,
		colorScaling: false
	}
]

const reactVizSettingsList = [
	{
		id: "#compliance-violations__all",
		vizType: "dot_chart",
		primaryDataSheet: "violations",
		colorSettings: {colorVar: null, defaultColor: colors.grey.medium },
		tooltipTitleVar: variables.primary_category__collection,
		tooltipVars: [variables.year, variables.description, variables.remedy, variables.sources_combined],
		dotSettings: {scaleFactor: 150, maxRadius: 5, spacing: 1},
		interaction: "click",
		layouts: [
			{
				label: "Violations Over Time",
				layout: "histogram",
			},
			{
				label: "Violations by Type",
				layout: "category",
				categoryVar: variables.primary_category_all,
				overrideColorVar: variables.primary_category_all,
				leftMargin: 220
			}
		]
	},
	{
		id: "#compliance-violations__collection",
		vizType: "dot_chart",
		primaryDataSheet: "violations",
		filterInitialDataFunction: getDataFilterFunction(variables.primary_category__collection),
		colorSettings: { colorVar: variables.primary_category__collection },
		tooltipTitleVar: variables.primary_category__collection,
		tooltipVars: [variables.year, variables.description, variables.remedy, variables.sources_combined],
		dotSettings: {scaleFactor: 150, maxRadius: 5, spacing: 1},
		interaction: "click",
		layouts: [
			{
				label: "Violations Over Time",
				layout: "histogram",
			}
		]
	},
	{
		id: "#compliance-violations__communications-access",
		vizType: "dot_chart",
		primaryDataSheet: "violations",
		filterInitialDataFunction: getDataFilterFunction(variables.primary_category__communications_access),
		colorSettings: { colorVar: variables.primary_category__communications_access },
		tooltipTitleVar: variables.primary_category__communications_access,
		tooltipVars: [variables.year, variables.description, variables.remedy, variables.sources_combined],
		dotSettings: {scaleFactor: 150, maxRadius: 5, spacing: 1},
		interaction: "click",
		layouts: [
			{
				label: "Violations Over Time",
				layout: "histogram",
			}
		]
	},
	{
		id: "#compliance-violations__other",
		vizType: "dot_chart",
		primaryDataSheet: "violations",
		filterInitialDataFunction: getDataFilterFunction(variables.primary_category__other),
		colorSettings: { colorVar: variables.primary_category__other },
		tooltipTitleVar: variables.primary_category__other,
		tooltipVars: [variables.year, variables.description, variables.remedy, variables.sources_combined],
		dotSettings: {scaleFactor: 150, maxRadius: 5, spacing: 1},
		interaction: "click",
		layouts: [
			{
				label: "Violations Over Time",
				layout: "histogram",
			}
		]
	},
	// {
	// 	id: "#compliance-violations__glossary",
	// 	vizType: "definition_explorer",
	// 	primaryDataSheet: "glossary",
	// 	titleVar: variables.title,
	// 	descriptionVar: variables.description,
	// 	categoryVar: variables.category,
	// },
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/oti/compliance-violations.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/1keuLHJGjXaLAwsZSEMwAv_XhdxkbF0X1w2--aEHlt0U/",
	dataSheetNames:["violations"],
	vizSettingsList: vizSettingsList,
	reactVizSettingsList: reactVizSettingsList
}

setupProject(projectSettings);