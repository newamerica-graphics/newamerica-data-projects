let { colors } = require("../../helper_functions/colors.js")

let variables = {
	week: {"variable":"week", "displayName":"Week", "format": "string"},
	category: {"variable":"category", "displayName":"Category", "format": "string", "scaleType":"categorical", "customDomain":["Paid Family Leave Milestones", "Maternal Health Milestones", "Infant Health Milestones"], "customRange":[colors.turquoise.light, colors.blue.light, colors.purple.light], "categoryImagePaths": ["paid-leave.svg", "maternal-health.svg", "infant-health.svg"]},
	description: {"variable":"description", "displayName":"Description", "format": "string"},
}

let vizSettings = {
	"paid-family-leave-timeline__timeline": {
		vizType: "vertical_timeline",
		primaryDataSheet: "timeline",
		timeVar: variables.week,
		timeSuffix: " weeks",
		categoryVar: variables.category,
		categoryImageUrl: "https://s3-us-west-2.amazonaws.com/na-data-projects/images/paid_family_leave_timeline/",
		descriptionVar: variables.description,
		begEndLabels: ["Childbirth", "1 Year"]
	},
}

module.exports = {
	vizSettings: vizSettings,
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/bll/care_index.json"
}
