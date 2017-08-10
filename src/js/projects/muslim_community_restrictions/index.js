import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	cateogry: {"variable":"cateogry", "displayName":"Category", "format": "string"},
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
	
]

const reactVizSettingsList = [
	{
		id: "#muslim-community-restrictions__dot-chart", 
		vizType: "dot_chart",
		primaryDataSheet: "incidents",
	},
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/muslimdiaspora/muslim_community_restrictions.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/1t5lGCzrBMkvkb6zCfXQsQ9Kwqomvj_YzWRvfnS75vTs/",
	dataSheetNames:["incidents", "states"],
	vizSettingsList: vizSettingsList,
	reactVizSettingsList: reactVizSettingsList
}

setupProject(projectSettings);

	