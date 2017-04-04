import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	state_id: {"variable":"state_id", "displayName":"State Id", "format": "number", "scaleType":"quantize", "customRange":[colors.white, colors.blue.light, colors.blue.dark], "numBins":5},
	state: {"variable":"state", "displayName":"State", "format": "string"},
	min_ed_requirement: {"variable":"min_ed_requirement", "displayName":"Minimum Educational Requirement", "format": "string", "category":"Pre-Service", "scaleType":"categorical", "customDomain":["Bachelor's Degree", "Post-Bachelor's Degree Coursework", "Post-BA degree or coursework", "Master's Degree", "Post-MA Degree or Coursework"], "customRange": [colors.turquoise.light, colors.turquoise.medium, colors.turquoise.medium, colors.turquoise.dark, colors.blue.dark]},
	higher_ed_coursework: {"variable":"higher_ed_coursework", "displayName":"Higher Ed Coursework", "format": "string", "category":"Pre-Service", "scaleType":"categorical", "canSplitCategory":true, "customDomain":["Must Offer Early Learning Coursework","Must Offer Child Development Coursework", "No", "No data"], "customRange":[colors.turquoise.medium, colors.blue.medium, colors.red.medium, colors.grey.light]},
	clinical_experience: {"variable":"clinical_experience", "displayName":"Clinical Experience", "format": "string", "category":"Pre-Service", "scaleType":"categorical", "customDomain":["Yes", "No"], "customRange":[colors.turquoise.medium, colors.red.medium]},
	prior_teaching_experience: {"variable":"prior_teaching_experience", "displayName":"Prior Teaching Experience", "format": "string", "category":"Pre-Service", "scaleType":"categorical", "customDomain":["Yes", "No"], "customRange":[colors.turquoise.medium, colors.red.medium]},
	professional_learning: {"variable":"professional_learning", "displayName":"Professional Learning", "format": "string", "category":"In-Service", "scaleType":"categorical", "customDomain":["Yes, requires", "Yes, offers", "No", "No data"], "customRange":[colors.turquoise.dark, colors.turquoise.light, colors.red.medium, colors.grey.light]},
	joint_professional_learning: {"variable":"joint_professional_learning", "displayName":"Joint Professional Learning", "format": "string", "category":"In-Service", "scaleType":"categorical", "customDomain":["Yes", "No", "No data"], "customRange":[colors.turquoise.medium, colors.red.medium, colors.grey.light]},
	formal_evaluation: {"variable":"formal_evaluation", "displayName":"Formal Evaluation", "format": "string", "category":"In-Service", "scaleType":"categorical"},
	track_principal_turnover: {"variable":"track_principal_turnover", "displayName":"Track Principal Turnover", "format": "string", "category":"Retention/Compensation", "scaleType":"categorical", "customDomain":["Yes", "Yes (starting to)", "No", "No data"], "customRange":[colors.turquoise.medium, colors.turquoise.light, colors.red.medium, colors.grey.light]},
	avg_salary: {"variable":"avg_salary_cleaned", "displayName":"Average Salary", "format": "price", "category":"Retention/Compensation", "scaleType":"quantize", "customRange":[colors.white, colors.blue.light, colors.blue.dark], "numBins":5},
	benefits: {"variable":"benefits", "displayName":"Benefits", "format": "string", "category":"Retention/Compensation", "scaleType":"categorical", "customDomain":["Health Insurance, Pension/Retirement, Paid Sick Leave", "Health Insurance, Pension/Retirement", "Unknown/Data Not Available", "No data"], "customRange":[colors.turquoise.dark, colors.turquoise.light, colors.grey.medium, colors.grey.light]},
	diversity_incentives: {"variable":"diversity_incentives", "displayName":"Diversity Incentives", "format": "string", "category":"Retention/Compensation", "scaleType":"categorical", "customDomain":["Financial Incentives", "Supports in Place", "No", "No data"], "customRange":[colors.turquoise.medium, colors.blue.medium, colors.red.medium, colors.grey.light]},
}

let vizSettingsList = [
	{
		id: "#early-ed-leaders__map", 
		vizType: "topo_json_map",
		primaryDataSheet: "principals",
		geometryType: "states",
		geometryVar: variables.state_id,
		stroke: {"color": colors.white, "width":"1", "opacity": "1", "hoverColor": colors.white, "hoverWidth": "3"},
		filterVars: [ variables.min_ed_requirement, variables.higher_ed_coursework, variables.clinical_experience, variables.prior_teaching_experience, variables.professional_learning, variables.joint_professional_learning, variables.formal_evaluation, variables.track_principal_turnover, variables.avg_salary, variables.benefits, variables.diversity_incentives ],
		tooltipVars: [ variables.state, variables.min_ed_requirement, variables.higher_ed_coursework, variables.clinical_experience, variables.prior_teaching_experience, variables.professional_learning, variables.joint_professional_learning, variables.formal_evaluation, variables.track_principal_turnover, variables.avg_salary, variables.benefits, variables.diversity_incentives ],
		legendSettings: {"orientation": "vertical-right", "showTitle": true},
		filterGroupSettings: {"hidden": false},
	}
	
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/edpolicy/early_ed_leaders.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/1Ojj6gLytFubMwoAC95lWhqwjA1X8D-CKuf1wFWkgtQE/",
	dataSheetNames:["principals"],
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);

	