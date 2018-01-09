let { colors } = require("../../helper_functions/colors.js")

let variables = {	
}

let vizSettings = {
	{
		id: "#transforming-the-workforce__recommendations", 
		vizType: "interactive_svg",
		svg: require("./assets/recommendations.svg"),
		linkList: [
			{id: "#transforming-the-workforce__improving_the_knowledge", url: "#improving-the-knowledge-base"},
			{id: "#transforming-the-workforce__support_for_implementation", url: "#support-for-implementation"},
			{id: "#transforming-the-workforce__professional_learning", url: "#professional-learning-during-ongoing-practice"},
			{id: "#transforming-the-workforce__qualification_requirements", url: "#qualification-requirements-for-professional-practice"},
			{id: "#transforming-the-workforce__interprofessional_practice", url: "#interprofessional-practice"},
			{id: "#transforming-the-workforce__higher_education", url: "#higher-education"},
			{id: "#transforming-the-workforce__leadership", url: "#leadership"},
			{id: "#transforming-the-workforce__evaluation_and_assessment", url: "#evaluation-and-assessment"},
		]
	}
}

module.exports = {
	vizSettings: vizSettings,
	dataUrl: null
}

	