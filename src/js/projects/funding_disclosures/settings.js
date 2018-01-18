let { colors } = require("../../helper_functions/colors.js")

let variables = {
  donor: {"variable":"donor", "displayName":"Donor", "format":"string"},
  amount: {"variable":"amount", "displayName":"Donation Amount", "format":"price"},
  term: {"variable":"term", "displayName":"Term", "format":"string"},
  description: {"variable":"description", "displayName":"Description", "format":"string"},
}

let vizSettings = {
	"funding-disclosure__data-table": {
		primaryDataSheet: "Sheet1",
		vizType: "table",
		tableVars: [ variables.donor, variables.amount, variables.term, variables.description ],
		defaultOrdering: [0, "asc"],
		pagination: false,
		numPerPage: 500,
	},
}

module.exports = {
	vizSettings: vizSettings,
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/admin/funding-disclosure.json"
}
