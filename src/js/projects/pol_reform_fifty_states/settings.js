let { colors } = require("../../helper_functions/colors.js")

let variables = {
	state_id: {"variable":"state_id", "displayName":"State Id"},
	state: {"variable":"state", "displayName":"State", "format": "string"},
	state_abbrev: {"variable":"state_abbrev", "displayName":"State", "format": "string"},
	early_voting: {"variable":"early_voting", "displayName":"Early Voting", "format": "string", "category":"Voting", "scaleType":"categorical", "customDomain":["Yes", "No"], "customRange":[colors.turquoise.light, colors.red.light]},
	no_excuse_absentee: {"variable":"no_excuse_absentee", "displayName":"No Excuse Absentee", "format": "string", "category":"Voting", "scaleType":"categorical", "customDomain":["Yes", "No"], "customRange":[colors.turquoise.light, colors.red.light]},
	online_registration: {"variable":"online_registration", "displayName":"Online Registration", "format": "string", "category":"Registration", "scaleType":"categorical", "customDomain":["Yes", "No"], "customRange":[colors.turquoise.light, colors.red.light]},
	same_day_registration: {"variable":"same_day_registration", "displayName":"Same Day Registration", "format": "string", "category":"Registration", "scaleType":"categorical", "customDomain":["Yes", "No"], "customRange":[colors.turquoise.light, colors.red.light]},
	automatic_voter_registration: {"variable":"automatic_voter_registration", "displayName":"Automatic Voter Registration", "format": "string", "category":"Registration", "scaleType":"categorical", "customDomain":["Yes", "No"], "customRange":[colors.turquoise.light, colors.red.light]},
	state_redistricting: {"variable":"state_redistricting", "displayName":"State Redistricting", "format": "string", "category":"Redistricting", "scaleType":"categorical", "canSplitCategory":true, "customDomain":["State Legislature", "Advisory Commission", "Independent Commission", "Executive Commission", "Elected Official Commission"], "customRange":[colors.turquoise.light, colors.blue.light, colors.purple.light, colors.red.medium, colors.turquoise.medium]},
	state_redistricting_more_info: {"variable":"state_redistricting_more_info", "displayName":"State Redistricting Details", "format": "string"},
	congressional_redistricting: {"variable":"congressional_redistricting", "displayName":"Congressional Redistricting", "format": "string", "category":"Redistricting", "scaleType":"categorical", "canSplitCategory":true, "customDomain":["State Legislature", "Advisory Commission", "Independent Commission", "Elected Official Commission", "N/A"], "customRange":[colors.turquoise.light, colors.blue.light, colors.purple.light, colors.turquoise.medium, colors.grey.medium]},
	congressional_redistricting_more_info: {"variable":"congressional_redistricting_more_info", "displayName":"Congressional Redistricting Details", "format": "string"},
	congressional_primary_type: {"variable":"congressional_primary_type", "displayName":"Congressional Primary Type", "format": "string", "category":"Primaries", "scaleType":"categorical", "canSplitCategory":true, "customDomain":["Closed", "Semi-closed", "Open", "Top two", "Blanket", "Two round system"], "customRange":[colors.turquoise.dark, colors.turquoise.medium, colors.turquoise.light, colors.blue.light, colors.purple.light, colors.purple.dark]},
	congressional_primary_rules: {"variable":"congressional_primary_rules", "displayName":"Congressional Primary Rules", "format": "string", "category":"Primaries"},
	presidential_primary_type: {"variable":"presidential_primary_type", "displayName":"Presidential Primary Type", "format": "price", "category":"Primaries", "scaleType":"categorical", "canSplitCategory":true, "customDomain":["Closed", "Semi-closed", "Open"], "customRange":[colors.turquoise.light, colors.blue.light, colors.purple.light]},
	presidential_primary_rules: {"variable":"presidential_primary_rules", "displayName":"Presidential Primary Rules", "format": "string", "category":"Primaries"},
	who_discloses: {"variable":"who_discloses", "displayName":"Who Discloses?", "format": "string", "scaleType":"categorical", "canSplitCategory":true, "customDomain":["Candidates", "PACs", "Parties", "Independent Expenditure Committees", "Small Donor Committees", "Political Committees", "Ballot Initiative Committees", "Candidate Committees", "Corporations", "Political Issue Committees", "Issue Committees"], "customRange":[colors.turquoise.light, colors.turquoise.medium, colors.turquoise.dark, colors.blue.light, colors.blue.medium, colors.blue.dark, colors.purple.light, colors.purple.medium, colors.purple.dark, colors.red.light, colors.red.dark]},
	what_is_disclosed: {"variable":"what_is_disclosed", "displayName":"What is Disclosed?", "format": "string", "scaleType":"categorical", "canSplitCategory":true, "customDomain":["Contributions", "Contributions (Employer)", "In-Kind Donations", "Expenditures", "Expenses", "Debts", "Loans", "Fundraising Sales", "Transfers"], "customRange":[colors.turquoise.light, colors.turquoise.medium, colors.turquoise.dark, colors.red.light, colors.red.medium, colors.red.dark, colors.purple.light, colors.blue.light, colors.blue.dark]},
	when_it_is_disclosed: {"variable":"when_it_is_disclosed", "displayName":"When is it Disclosed?", "format": "string", "canSplitCategory":true},
	electronic_filing_required: {"variable":"electronic_filing_required", "displayName":"Electronic Filing", "format": "string", "category":"Electronic Filing", "scaleType":"categorical", "customDomain":["Yes", "No"], "customRange":[colors.turquoise.light, colors.red.light]},
	public_financing: {"variable":"public_financing", "displayName":"Public Financing", "format": "string", "category":"Public Financing", "scaleType":"categorical", "customDomain":["Yes", "No"], "customRange":[colors.turquoise.light, colors.red.light]},
	public_financing_qualified: {"variable":"public_financing_qualified", "displayName":"Public Financing Qualified", "format": "string", "category":"Public Financing" },
	public_financing_amount: {"variable":"public_financing_amount", "displayName":"Public Financing Amount", "format": "string", "category":"Public Financing" },
	public_financing_contributors: {"variable":"public_financing_contributors", "displayName":"Public Financing Contributors", "format": "string", "category":"Public Financing" },
	public_financing_promise: {"variable":"public_financing_promise", "displayName":"Public Financing Promise", "format": "string", "category":"Public Financing" },
	public_financing_funding_level: {"variable":"public_financing_funding_level", "displayName":"Public Financing Funding Level", "format": "string", "scaleType":"categorical", "category":"Public Financing", "customDomain":["Full", "Partial", "None"], "customRange":[colors.turquoise.light, colors.blue.light, colors.red.light]},
	ranked_choice_voting: {"variable":"ranked_choice_voting", "displayName":"Ranked Choice Voting", "format": "string", "category":"Ranked Choice Voting", "scaleType":"categorical", "customDomain":["State level", "Cities Using RCV", "Locally Awaiting Implementation", "Military & Overseas", "Party Use", "No"], "customRange":[colors.turquoise.light, colors.blue.light, colors.blue.dark, colors.purple.light, colors.purple.dark, colors.red.light]},
	ranked_choice_voting_more_info: {"variable":"ranked_choice_voting_more_info", "displayName":"Ranked Choice Voting Details", "format": "string", "category":"Ranked Choice Voting"},
}

const contrLimitSources = [
	{field:"individ", displayName:"Individual Donor"},
	{field:"pac", displayName:"Political Action Committee"},
	{field:"PP", displayName:"Political Party"},
	{field:"corp", displayName:"Corporation"},
	{field:"union", displayName:"Union"}
]

const contrLimitRecipients = [
	{field:"cand_house", displayName:"House Candidate"},
	{field:"cand_senate", displayName:"Senate Candidate"},
	{field:"cand_gub", displayName:"Gubernatorial Candidate"},
	{field:"pac", displayName:"Political Action Committee"},
	{field:"PP", displayName:"Political Party"},
]

contrLimitSources.forEach(source => {
	contrLimitRecipients.forEach(recip => {
		let fieldName = source.field + "_" + recip.field
		variables[fieldName] = {"variable": fieldName, "displayName": recip.displayName, "format": "string", "category": source.displayName}
		variables[fieldName + "_bucket"] = {"variable": fieldName + "_bucket", "displayName": recip.displayName, "format": "string", "category": source.displayName, "scaleType":"categorical", "customDomain":["Prohibited", "$1,000 or Less", "$1,001-$2,500", "$2,501-$5,000", "$5,001-$10,000", "Greater than $10,000", "Unlimited"], "customRange":[colors.red.light, colors.blue.very_light, colors.blue.very_light_2, colors.blue.light, colors.blue.medium, colors.blue.dark, colors.black]}
	})
})

let vizSettings = {
	"pol-reform-50-states__elections-map": {
		vizType: "topo_json_map",
		primaryDataSheet: "live_data",
		geometryType: "states",
		geometryVar: variables.state_id,
		stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "1", hoverOpacity: ".6"},
		filterVars: [ variables.online_registration, variables.same_day_registration, variables.automatic_voter_registration, variables.early_voting, variables.no_excuse_absentee],
		tooltipVars: [ variables.state, variables.online_registration, variables.same_day_registration, variables.automatic_voter_registration, variables.early_voting, variables.no_excuse_absentee],
		varDescriptionSheet: "states_variables",
		legendSettings: {"orientation": "vertical-right", "showTitle": true, "showValueDescriptions": true},
		tooltipShowOnly: "same category",
		addSmallStateInsets: true,
		filterGroupSettings: {"hidden": false},
		clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/fifty-state-solution/state-profile/?" }
	},
	"pol-reform-50-states__redistricting-map": {
		vizType: "topo_json_map",
		primaryDataSheet: "live_data",
		geometryType: "states",
		geometryVar: variables.state_id,
		stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "1", hoverOpacity: ".6"},
		filterVars: [ variables.congressional_primary_type, variables.presidential_primary_type, variables.ranked_choice_voting, variables.state_redistricting, variables.congressional_redistricting],
		tooltipVars: [ variables.state, variables.congressional_primary_type, variables.congressional_primary_rules, variables.presidential_primary_type, variables.presidential_primary_rules, variables.ranked_choice_voting, variables.ranked_choice_voting_more_info, variables.state_redistricting, variables.state_redistricting_more_info, variables.congressional_redistricting, variables.congressional_redistricting_more_info],
		tooltipShowOnly: "same category",
		addSmallStateInsets: true,
		varDescriptionSheet: "states_variables",
		legendSettings: {"orientation": "vertical-right", "showTitle": true},
		filterGroupSettings: {"hidden": false},
		clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/fifty-state-solution/state-profile/?" }
	},
	"pol-reform-50-states__financing-map": {
		vizType: "topo_json_map",
		primaryDataSheet: "live_data",
		geometryType: "states",
		geometryVar: variables.state_id,
		stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "1", hoverOpacity: ".6"},
		filterVars: [ variables.electronic_filing_required, variables.public_financing_funding_level],
		varDescriptionSheet: "states_variables",
		tooltipVars: [ variables.state, variables.electronic_filing_required, variables.public_financing_funding_level, variables.public_financing_qualified, variables.public_financing_amount, variables.public_financing_contributors, variables.public_financing_promise],
		tooltipShowOnly: "same category",
		addSmallStateInsets: true,
		legendSettings: {"orientation": "vertical-right", "showTitle": true},
		filterGroupSettings: {"hidden": false},
		clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/fifty-state-solution/state-profile/?" }
	},
	"pol-reform-50-states__contribution-limits-map": {
		vizType: "topo_json_map",
		primaryDataSheet: "live_data",
		geometryType: "states",
		geometryVar: variables.state_id,
		stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "1", hoverOpacity: ".6"},
		filterVars: [
			variables.individ_cand_house_bucket, variables.individ_cand_senate_bucket, variables.individ_cand_gub_bucket, variables.individ_PP_bucket, variables.individ_pac_bucket, variables.pac_cand_house_bucket, variables.pac_cand_senate_bucket, variables.pac_cand_gub_bucket, variables.pac_PP_bucket, variables.pac_pac_bucket, variables.PP_cand_house_bucket, variables.PP_cand_senate_bucket, variables.PP_cand_gub_bucket, variables.PP_PP_bucket, variables.PP_pac_bucket, variables.corp_cand_house_bucket, variables.corp_cand_senate_bucket, variables.corp_cand_gub_bucket, variables.corp_PP_bucket, variables.corp_pac_bucket, variables.union_cand_house_bucket, variables.union_cand_senate_bucket, variables.union_cand_gub_bucket, variables.union_PP_bucket, variables.union_pac_bucket
		],
		tooltipVars: [ variables.state,
			variables.individ_cand_house, variables.individ_cand_senate, variables.individ_cand_gub, variables.individ_PP, variables.individ_pac, variables.pac_cand_house, variables.pac_cand_senate, variables.pac_cand_gub, variables.pac_PP, variables.pac_pac, variables.PP_cand_house, variables.PP_cand_senate, variables.PP_cand_gub, variables.PP_PP, variables.PP_pac, variables.corp_cand_house, variables.corp_cand_senate, variables.corp_cand_gub, variables.corp_PP, variables.corp_pac, variables.union_cand_house, variables.union_cand_senate, variables.union_cand_gub, variables.union_PP, variables.union_pac
		],
		varDescriptionSheet: "states_variables",
		legendSettings: {"orientation": "vertical-right", "showTitle": true, "showValueDescriptions": true},
		tooltipShowOnly: "same category",
		addSmallStateInsets: true,
		filterGroupSettings: {"hidden": false},
		clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/fifty-state-solution/state-profile/?" }
	},
	"pol-reform-50-states__congressional-primaries": {
		vizType: "category_breakdown",
		primaryDataSheet: "live_data",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.congressional_primary_type ],
		labelVar: variables.state_abbrev,
		clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/fifty-state-solution/state-profile/?" },
		idVar: variables.state_id,
		quantityLabel: "states",
	},
	"pol-reform-50-states__presidential-primaries": {
		vizType: "category_breakdown",
		primaryDataSheet: "live_data",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.presidential_primary_type ],
		labelVar: variables.state_abbrev,
		clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/fifty-state-solution/state-profile/?" },
		idVar: variables.state_id,
		quantityLabel: "states",
	},
	"pol-reform-50-states__ranked-choice-voting": {
		vizType: "category_breakdown",
		primaryDataSheet: "live_data",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.ranked_choice_voting ],
		labelVar: variables.state_abbrev,
		clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/fifty-state-solution/state-profile/?" },
		idVar: variables.state_id,
		quantityLabel: "states",
	},
	"pol-reform-50-states__early-voting": {
		vizType: "category_breakdown",
		primaryDataSheet: "live_data",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.early_voting ],
		labelVar: variables.state_abbrev,
		clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/fifty-state-solution/state-profile/?" },
		idVar: variables.state_id,
		quantityLabel: "states",
	},
	"pol-reform-50-states__same-day-registration": {
		vizType: "category_breakdown",
		primaryDataSheet: "live_data",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.same_day_registration ],
		labelVar: variables.state_abbrev,
		clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/fifty-state-solution/state-profile/?" },
		idVar: variables.state_id,
		quantityLabel: "states",
	},
	"pol-reform-50-states__automatic-voter-registration": {
		vizType: "category_breakdown",
		primaryDataSheet: "live_data",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.automatic_voter_registration ],
		labelVar: variables.state_abbrev,
		clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/fifty-state-solution/state-profile/?" },
		idVar: variables.state_id,
		quantityLabel: "states",
	},
	"pol-reform-50-states__online-registration": {
		vizType: "category_breakdown",
		primaryDataSheet: "live_data",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.online_registration ],
		labelVar: variables.state_abbrev,
		clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/fifty-state-solution/state-profile/?" },
		idVar: variables.state_id,
		quantityLabel: "states",
	},
	"pol-reform-50-states__state-redistricting": {
		vizType: "category_breakdown",
		primaryDataSheet: "live_data",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.state_redistricting ],
		labelVar: variables.state_abbrev,
		clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/fifty-state-solution/state-profile/?" },
		idVar: variables.state_id,
		quantityLabel: "states",
	},
	"pol-reform-50-states__congressional-redistricting": {
		vizType: "category_breakdown",
		primaryDataSheet: "live_data",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.congressional_redistricting ],
		labelVar: variables.state_abbrev,
		clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/fifty-state-solution/state-profile/?" },
		idVar: variables.state_id,
		quantityLabel: "states",
	},
	"pol-reform-50-states__no-excuse-absentee": {
		vizType: "category_breakdown",
		primaryDataSheet: "live_data",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.no_excuse_absentee ],
		labelVar: variables.state_abbrev,
		clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/fifty-state-solution/state-profile/?" },
		idVar: variables.state_id,
		quantityLabel: "states",
	},
	"pol-reform-50-states__electronic-filing": {
		vizType: "category_breakdown",
		primaryDataSheet: "live_data",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.electronic_filing_required ],
		labelVar: variables.state_abbrev,
		clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/fifty-state-solution/state-profile/?" },
		idVar: variables.state_id,
		quantityLabel: "states",
	},
	"pol-reform-50-states__public-financing": {
		vizType: "category_breakdown",
		primaryDataSheet: "live_data",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.public_financing_funding_level ],
		labelVar: variables.state_abbrev,
		clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/fifty-state-solution/state-profile/?" },
		idVar: variables.state_id,
		quantityLabel: "states",
	},
	"pol-reform-50-states__who-discloses": {
		vizType: "category_breakdown",
		primaryDataSheet: "live_data",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.who_discloses ],
		labelVar: variables.state_abbrev,
		clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/fifty-state-solution/state-profile/?" },
		idVar: variables.state_id,
		quantityLabel: "states",
	},
	"pol-reform-50-states__what-is-disclosed": {
		vizType: "category_breakdown",
		primaryDataSheet: "live_data",
		dotSettings: { "width": 30, "offset": 5},
		filterVars: [ variables.what_is_disclosed ],
		labelVar: variables.state_abbrev,
		clickToProfile: { "variable": variables.state.variable, "url": "https://www.newamerica.org/in-depth/fifty-state-solution/state-profile/?" },
		idVar: variables.state_id,
		quantityLabel: "states",
	},
}


const preProcessData = (data) => {
	data["live_data"].map(d => {
		contrLimitSources.forEach(source => {
			contrLimitRecipients.forEach(recip => {
				let fieldName = source.field + "_" + recip.field
				d[fieldName + "_bucket"] = setBucketValue(d[fieldName])
			})
		})

		return d;
	})

	return data;
}

const setBucketValue = (value) => {
  if (!value || value == "" || value == "Unlimited" || value == "Prohibited") {
    return value;
  }

  let processedValue = value;

  if (isNaN(value)) {
    processedValue = processedValue.match(/\d{1,3}(?:[.,]\d{3})*/)
		processedValue = processedValue ? processedValue.toString().replace(",","") : null
  }

  if (isNaN(processedValue)) {
    return processedValue;
  } else {
    if (processedValue <= 1000) {
      return "$1,000 or Less";
    } else if (processedValue <= 2500) {
      return "$1,001-$2,500";
    } else if (processedValue <= 5000) {
      return "$2,501-$5,000";
    } else if (processedValue <= 10000) {
      return "$5,001-$10,000";
    } else {
      return "Greater than $10,000";
    }
  }
}

module.exports = {
	vizSettings: vizSettings,
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/polreform/political-reform-fifty-states.json",
	preProcessData: preProcessData
}
