import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";

let variables = {
	
}

let vizSettingsList = [
	{
		id: "#timeline-test__test", 
		vizType: "timeline",

	},
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/test/timelinetest.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/1UHVsknlx8sWPNg6nYBg2_WdXTp2RwnWwe7BdInWncdg/",
	dataSheetNames:["Sheet1"],
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);