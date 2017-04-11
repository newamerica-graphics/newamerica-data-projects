import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	state_id: {"variable":"state_id", "displayName":"State Id", "format": "number", "scaleType":"quantize", "customRange":[colors.white, colors.blue.light, colors.blue.dark], "numBins":5},
	state: {"variable":"state", "displayName":"State", "format": "string"},
	state_abbrev: {"variable":"state_abbrev", "displayName":"State", "format": "string"},
	early_voting: {"variable":"early_voting", "displayName":"Early Voting", "format": "string", "category":"Voting", "scaleType":"categorical", "customDomain":["Yes", "No"], "customRange":[colors.turquoise.medium, colors.red.medium]},
	no_excuse_absentee: {"variable":"no_excuse_absentee", "displayName":"No Excuse Absentee", "format": "string", "category":"Voting", "scaleType":"categorical", "customDomain":["Yes", "No"], "customRange":[colors.turquoise.medium, colors.red.medium]},
	online_registration: {"variable":"online_registration", "displayName":"Online Registration", "format": "string", "category":"Registration", "scaleType":"categorical", "customDomain":["Yes", "No"], "customRange":[colors.turquoise.medium, colors.red.medium]},
	same_day_registration: {"variable":"same_day_registration", "displayName":"Same Day Registration", "format": "string", "category":"Registration", "scaleType":"categorical", "customDomain":["Yes", "No"], "customRange":[colors.turquoise.medium, colors.red.medium]},
	automatic_voter_registration: {"variable":"automatic_voter_registration", "displayName":"Automatic Voter Registration", "format": "string", "category":"Registration", "scaleType":"categorical", "customDomain":["Yes", "No"], "customRange":[colors.turquoise.medium, colors.red.medium]},
	state_redistricting: {"variable":"state_redistricting", "displayName":"State Redistricting", "format": "string", "scaleType":"categorical", "canSplitCategory":true, "customDomain":["Advisory Commission", "Independent Commission", "Political Commission", "State Legislature"], "customRange":[colors.turquoise.medium, colors.blue.medium, colors.purple.medium, colors.turquoise.light]},
	state_redistricting_more_info: {"variable":"state_redistricting_more_info", "displayName":"State Redistricting Details", "format": "string"},
	congressional_redistricting: {"variable":"congressional_redistricting", "displayName":"Congressional Redistricting", "format": "string", "scaleType":"categorical", "canSplitCategory":true, "customDomain":["Advisory Commission", "Independent Commission", "Political Commission", "State Legislature", "N/A"], "customRange":[colors.turquoise.medium, colors.blue.medium, colors.purple.medium, colors.turquoise.light, colors.grey.light]},
	congressional_redistricting_more_info: {"variable":"congressional_redistricting_more_info", "displayName":"Congressional Redistricting Details", "format": "string"},
	congressional_primary_type: {"variable":"congressional_primary_type", "displayName":"Congressional Primary Type", "format": "string", "category":"Primaries", "scaleType":"categorical", "canSplitCategory":true, "customDomain":["Closed", "Semi-closed", "Open", "Top two", "Blanket", "Two round system"], "customRange":[colors.turquoise.dark, colors.turquoise.medium, colors.turquoise.light, colors.blue.medium, colors.purple.medium, colors.red.dark]},
	congressional_primary_rules: {"variable":"congressional_primary_rules", "displayName":"Congressional Primary Rules", "format": "string", "category":"Primaries"},
	presidential_primary_type: {"variable":"presidential_primary_type", "displayName":"Presidential Primary Type", "format": "price", "category":"Primaries", "scaleType":"categorical", "canSplitCategory":true, "customDomain":["Closed", "Semi-closed", "Open"], "customRange":[colors.turquoise.medium, colors.blue.medium, colors.purple.medium]},
	presidential_primary_rules: {"variable":"presidential_primary_rules", "displayName":"Presidential Primary Rules", "format": "string", "category":"Primaries"},
	who_discloses: {"variable":"who_discloses", "displayName":"Who Discloses?", "format": "string", "category":"Retention/Compensation", "scaleType":"categorical"},
	what_is_disclosed: {"variable":"what_is_disclosed", "displayName":"What is Disclosed?", "format": "string", "category":"Retention/Compensation", "scaleType":"categorical"},
	when_it_is_disclosed: {"variable":"when_it_is_disclosed", "displayName":"When is it Disclosed?", "format": "string", "category":"Retention/Compensation"},
	electronic_filing: {"variable":"electronic_filing", "displayName":"Electronic Filing", "format": "string", "category":"Retention/Compensation", "scaleType":"categorical", "customDomain":["Yes", "No"], "customRange":[colors.turquoise.medium, colors.red.medium]},
	public_financing: {"variable":"public_financing", "displayName":"Public Financing", "format": "string", "category":"Retention/Compensation", "scaleType":"categorical", "customDomain":["Yes", "No"], "customRange":[colors.turquoise.medium, colors.red.medium]},
	public_financing_qualified: {"variable":"public_financing_qualified", "displayName":"Public Financing Qualified", "format": "string", "category":"Retention/Compensation"},
	public_financing_amount: {"variable":"public_financing_amount", "displayName":"Public Financing Amount", "format": "string", "category":"Retention/Compensation"},
	public_financing_contributors: {"variable":"public_financing_contributors", "displayName":"Public Financing Contributors", "format": "string", "category":"Retention/Compensation"},
	public_financing_promise: {"variable":"public_financing_promise", "displayName":"Public Financing Promise", "format": "string", "category":"Retention/Compensation"},
	public_financing_funding_level: {"variable":"public_financing_funding_level", "displayName":"Public Financing Funding Level", "format": "string", "category":"Retention/Compensation", "scaleType":"categorical", "customDomain":["Full", "Partial", "N/A"], "customRange":[colors.turquoise.medium, colors.blue.medium, colors.grey.light]},
	ranked_choice_voting: {"variable":"ranked_choice_voting", "displayName":"Ranked Choice Voting", "format": "string", "category":"Voting"},

}

let vizSettingsList = [
	{
		id: "#pol-reform-50-states__elections-map", 
		vizType: "topo_json_map",
		primaryDataSheet: "states",
		geometryType: "states",
		geometryVar: variables.state_id,
		stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "3"},
		filterVars: [ variables.congressional_primary_type, variables.presidential_primary_type, variables.online_registration, variables.same_day_registration, variables.automatic_voter_registration, variables.early_voting, variables.no_excuse_absentee],
		tooltipVars: [ variables.state, variables.congressional_primary_type, variables.congressional_primary_rules, variables.presidential_primary_type, variables.presidential_primary_rules, variables.online_registration, variables.same_day_registration, variables.automatic_voter_registration, variables.early_voting, variables.no_excuse_absentee, variables.ranked_choice_voting],
		legendSettings: {"orientation": "vertical-right", "showTitle": true},
		filterGroupSettings: {"hidden": false},
	},
	{
		id: "#pol-reform-50-states__redistricting-map", 
		vizType: "topo_json_map",
		primaryDataSheet: "states",
		geometryType: "states",
		geometryVar: variables.state_id,
		stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "3"},
		filterVars: [ variables.state_redistricting, variables.congressional_redistricting],
		tooltipVars: [ variables.state, variables.state_redistricting, variables.state_redistricting_more_info, variables.congressional_redistricting, variables.congressional_redistricting_more_info],
		legendSettings: {"orientation": "vertical-right", "showTitle": true},
		filterGroupSettings: {"hidden": false},
	},
	{
		id: "#pol-reform-50-states__congressional-primaries", 
		vizType: "category_breakdown",
		primaryDataSheet: "states",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.congressional_primary_type ],
		labelVar: variables.state_abbrev,
		tooltipVars: [ variables.state ],
	},
	{
		id: "#pol-reform-50-states__presidential-primaries", 
		vizType: "category_breakdown",
		primaryDataSheet: "states",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.presidential_primary_type ],
		labelVar: variables.state_abbrev,
		tooltipVars: [ variables.state ],
	},
	{
		id: "#pol-reform-50-states__early-voting", 
		vizType: "category_breakdown",
		primaryDataSheet: "states",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.early_voting ],
		labelVar: variables.state_abbrev,
		tooltipVars: [ variables.state ],
	},
	{
		id: "#pol-reform-50-states__same-day-registration", 
		vizType: "category_breakdown",
		primaryDataSheet: "states",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.same_day_registration ],
		labelVar: variables.state_abbrev,
		tooltipVars: [ variables.state ],
	},
	{
		id: "#pol-reform-50-states__automatic-voter-registration", 
		vizType: "category_breakdown",
		primaryDataSheet: "states",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.automatic_voter_registration ],
		labelVar: variables.state_abbrev,
		tooltipVars: [ variables.state ],
	},
	{
		id: "#pol-reform-50-states__online-registration", 
		vizType: "category_breakdown",
		primaryDataSheet: "states",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.online_registration ],
		labelVar: variables.state_abbrev,
		tooltipVars: [ variables.state ],
	},
	{
		id: "#pol-reform-50-states__state-redistricting", 
		vizType: "category_breakdown",
		primaryDataSheet: "states",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.state_redistricting ],
		labelVar: variables.state_abbrev,
		tooltipVars: [ variables.state ],
	},
	{
		id: "#pol-reform-50-states__congressional-redistricting", 
		vizType: "category_breakdown",
		primaryDataSheet: "states",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.congressional_redistricting ],
		labelVar: variables.state_abbrev,
		tooltipVars: [ variables.state ],
	},
	{
		id: "#pol-reform-50-states__no-excuse-absentee", 
		vizType: "category_breakdown",
		primaryDataSheet: "states",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.no_excuse_absentee ],
		labelVar: variables.state_abbrev,
		tooltipVars: [ variables.state ],
	},

]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/polreform/political-reform-fifty-states.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/1_ji_GJZRBMcSiW35vF8PvXzsYIu8z8tjqESDAxKxEm4/",
	dataSheetNames:["states"],
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);

	