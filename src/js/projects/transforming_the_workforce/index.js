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
			{id: "#transforming-the-workforce__improving_the_knowledge", url: "www.newamerica.org/in-depth/transforming-early-education-workforce/blueprint-action/#improving-the-knowledge-base"},
			{id: "#transforming-the-workforce__support_for_implementation", url: "www.newamerica.org/in-depth/transforming-early-education-workforce/blueprint-action/#support-for-implementation"},
			{id: "#transforming-the-workforce__professional_learning", url: "www.newamerica.org/in-depth/transforming-early-education-workforce/blueprint-action/#professional-learning-during-ongoing-practice"},
			{id: "#transforming-the-workforce__qualification_requirements", url: "www.newamerica.org/in-depth/transforming-early-education-workforce/blueprint-action/#qualification-requirements-for-professional-practice"},
			{id: "#transforming-the-workforce__interprofessional_practice", url: "www.newamerica.org/in-depth/transforming-early-education-workforce/blueprint-action/#interprofessional-practice"},
			{id: "#transforming-the-workforce__higher_education", url: "www.newamerica.org/in-depth/transforming-early-education-workforce/blueprint-action/#higher-education"},
			{id: "#transforming-the-workforce__leadership", url: "www.newamerica.org/in-depth/transforming-early-education-workforce/blueprint-action/#leadership"},
			{id: "#transforming-the-workforce__evaluation_and_assessment", url: "www.newamerica.org/in-depth/transforming-early-education-workforce/blueprint-action/#evaluation-and-assessment"},
		]
	}
]

let projectSettings = {
	vizSettingsList: vizSettingsList,
}

setupProject(projectSettings);

	