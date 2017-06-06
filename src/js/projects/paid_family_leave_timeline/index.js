import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";


let variables = {
	week: {"variable":"week", "displayName":"Week", "format": "string"},
	category: {"variable":"category", "displayName":"Category", "format": "string", "scaleType":"categorical", "customDomain":["Paid Family Leave Milestones", "Maternal Health Milestones", "Infant Health Milestones"], "customRange":[colors.turquoise.light, colors.blue.light, colors.purple.light], "categoryImagePaths": ["paid-leave.svg", "maternal-health.svg", "infant-health.svg"]},
	description: {"variable":"description", "displayName":"Description", "format": "string"},
}

let vizSettingsList = [
	{
		id: "#paid-family-leave-timeline__timeline", 
		vizType: "vertical_timeline",
		primaryDataSheet: "timeline",
		timeVar: variables.week,
		timeSuffix: " weeks",
		categoryVar: variables.category,
		categoryImageUrl: "https://s3-us-west-2.amazonaws.com/na-data-projects/images/paid_family_leave_timeline/",
		descriptionVar: variables.description
	},
]


let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/bll/paid_family_leave.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/1LNeGat4tkirj4IqpXUEa4DhD3nO39saOmjWRMyU-a1I",
	dataSheetNames:["timeline"],
	vizSettingsList: vizSettingsList,
}

setupProject(projectSettings);

	