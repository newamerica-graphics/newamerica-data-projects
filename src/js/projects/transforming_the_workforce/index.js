import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";

let variables = {	
}

let vizSettingsList = [
	{
		id: "#transforming-the-workforce__recommendations", 
		vizType: "interactive_svg",
		svg: require("./assets/recommendations.svg"),
		linkList: [
			{id: "#transforming-the-workforce__improving_the_knowledge", url: "https://na-staging.herokuapp.com/in-depth/transforming-workforce/recommendations/#improving-the-knowledge-base"},
			{id: "#transforming-the-workforce__support_for_implementation", url: "https://na-staging.herokuapp.com/in-depth/transforming-workforce/recommendations/#support-for-implementation"},
			{id: "#transforming-the-workforce__professional_learning", url: "https://na-staging.herokuapp.com/in-depth/transforming-workforce/recommendations/#professional-learning-during-ongoing-practice"},
			{id: "#transforming-the-workforce__qualification_requirements", url: "https://na-staging.herokuapp.com/in-depth/transforming-workforce/recommendations/#qualification-requirements-for-better-practice"},
			{id: "#transforming-the-workforce__interprofessional_practice", url: "https://na-staging.herokuapp.com/in-depth/transforming-workforce/recommendations/#interprofessional-practice"},
			{id: "#transforming-the-workforce__higher_education", url: "https://na-staging.herokuapp.com/in-depth/transforming-workforce/recommendations/#higher-education"},
			{id: "#transforming-the-workforce__leadership", url: "https://na-staging.herokuapp.com/in-depth/transforming-workforce/recommendations/#leadership"},
			{id: "#transforming-the-workforce__evaluation_and_assessment", url: "https://na-staging.herokuapp.com/in-depth/transforming-workforce/recommendations/#evaluation-assessment"},
		]
	}
]

let projectSettings = {
	vizSettingsList: vizSettingsList,
}

setupProject(projectSettings);

	