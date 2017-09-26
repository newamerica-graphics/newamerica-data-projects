let { colors } = require("../../helper_functions/colors.js")

let d3 = require("d3");

let variables = {
	id: {"variable": "id", "displayName":"ID", "format":"number"},
	name: {"variable": "name", "displayName":"Country", "format":"string"},
	exports_to: {"variable": "exports_to", "displayName":"Exporters", "format":"string"},
	imports_from: {"variable": "imports_from", "displayName":"Importers", "format":"string"},
	developing_armed_drones_year: {"variable": "developing_armed_drones_year", "displayName":"Year", "format":"year", "scaleType":"categorical", "customRange":[colors.turquoise.light]},
	developing_armed_drones_description: {"variable": "developing_armed_drones_description", "displayName":"Description", "format":"string", "disableTableOrdering": true},
	have_armed_drones_year: {"variable": "have_armed_drones_year", "displayName":"Year", "format":"year", "scaleType":"categorical", "customRange":[colors.blue.light]},
	have_armed_drones_description: {"variable": "have_armed_drones_description", "displayName":"Description", "format":"string", "disableTableOrdering": true},
	drones_in_combat_year: {"variable": "drones_in_combat_year", "displayName":"Year", "format":"year", "scaleType":"categorical", "customRange":[colors.blue.dark]},
	drones_in_combat_date: {"variable": "drones_in_combat_date", "displayName":"Date", "format":"date"},
	drones_in_combat_country_of_use: {"variable": "drones_in_combat_country_of_use", "displayName":"Country of Use", "format":"string"},
	drones_in_combat_drone_model_used: {"variable": "drones_in_combat_drone_model_used", "displayName":"Drone Model Used", "format":"string"},
	drones_in_combat_in_arsenal: {"variable": "drones_in_combat_in_arsenal", "displayName":"Drones in Arsenal", "format":"string"},
	drones_in_combat_description: {"variable": "drones_in_combat_description", "displayName":"Description", "format":"string", "disableTableOrdering": true},
}

let vizSettings = {
	"world-of-drones__import-export", 
		vizType: "bipartite",
		primaryDataSheet: "countries",
		keyVar: variables.name,
		leftVar: variables.exports_to,
		rightVar: variables.imports_from,
	},
	"world-of-drones__developing-armed-drones": {
		vizType: "tabbed_chart_layout",
		primaryDataSheet: "countries",
		chartSettingsList: [
			{
				vizType: "dashboard",
				getDefaultValueFunction: getDefaultValue,
				layoutRows: [
					[
						{
							vizType: "slider",
							primaryDataSheet: "countries",
							variable: variables.developing_armed_drones_year,
							isMessagePasser: true,
							automated: true
						}
					],
					[
						{
							vizType: "topo_json_map",
							primaryDataSheet: "countries",
							geometryType: "world",
							stroke: {"color": "white", "width":"1", "opacity": "1", "hoverColor": "white", "hoverWidth": "3"},
							defaultFill: colors.grey.light,
							geometryVar: variables.id,
							filterVars: [variables.developing_armed_drones_year],
							tooltipVars: [variables.name, variables.developing_armed_drones_year, variables.developing_armed_drones_description],
							mouseoverOnlyIfValue: true,
							zoomable: false,
							messageHandlerType: "change_value",
						}
					]
				]
			},
			{
				vizType: "table",
				filterInitialDataBy: [{ field: "developing_armed_drones_year" }, { field: "id" }],
				tableVars: [variables.name, variables.developing_armed_drones_year, variables.developing_armed_drones_description],
				defaultOrdering: [1, "asc"],
				pagination: false,
				numPerPage: 20,
				colorScaling: false
			}
		]
	},
	"world-of-drones__have-armed-drones": {
		vizType: "tabbed_chart_layout",
		primaryDataSheet: "countries",
		chartSettingsList: [
			{
				vizType: "dashboard",
				getDefaultValueFunction: getDefaultValue,
				layoutRows: [
					[
						{
							vizType: "slider",
							primaryDataSheet: "countries",
							variable: variables.have_armed_drones_year,
							isMessagePasser: true,
							automated: true
						}
					],
					[
						{
							vizType: "topo_json_map",
							primaryDataSheet: "countries",
							geometryType: "world",
							stroke: {"color": "white", "width":"1", "opacity": "1", "hoverColor": "white", "hoverWidth": "3"},
							defaultFill: colors.grey.light,
							geometryVar: variables.id,
							filterVars: [variables.have_armed_drones_year],
							tooltipVars: [variables.name, variables.have_armed_drones_year, variables.have_armed_drones_description],
							mouseoverOnlyIfValue: true,
							zoomable: false,
							messageHandlerType: "change_value",
						}
					]
				]
			},
			{
				vizType: "table",
				filterInitialDataBy: [{ field: "have_armed_drones_year" }, { field: "id" }],
				tableVars: [variables.name, variables.have_armed_drones_year, variables.have_armed_drones_description],
				defaultOrdering: [1, "asc"],
				pagination: false,
				numPerPage: 20,
				colorScaling: false
			}
		]
	},
	"world-of-drones__drones-in-combat": {
		vizType: "tabbed_chart_layout",
		primaryDataSheet: "countries",
		chartSettingsList: [
			{
				vizType: "dashboard",
				getDefaultValueFunction: getDefaultValue,
				layoutRows: [
					[
						{
							vizType: "slider",
							primaryDataSheet: "countries",
							variable: variables.drones_in_combat_year,
							isMessagePasser: true,
							automated: true
						}
					],
					[
						{
							vizType: "topo_json_map",
							primaryDataSheet: "countries",
							geometryType: "world",
							stroke: {"color": "white", "width":"1", "opacity": "1", "hoverColor": "white", "hoverWidth": "3"},
							defaultFill: colors.grey.light,
							geometryVar: variables.id,
							filterVars: [variables.drones_in_combat_year],
							tooltipVars: [variables.name, variables.drones_in_combat_date, variables.drones_in_combat_country_of_use, variables.drones_in_combat_drone_model_used, variables.drones_in_combat_in_arsenal],
							mouseoverOnlyIfValue: true,
							zoomable: false,
							messageHandlerType: "change_value",
						}
					]
				]
			},
			{
				vizType: "table",
				filterInitialDataBy: [{ field: "drones_in_combat_date" }, { field: "id" }],
				tableVars: [variables.name, variables.drones_in_combat_date, variables.drones_in_combat_country_of_use, variables.drones_in_combat_drone_model_used, variables.drones_in_combat_in_arsenal],
				defaultOrdering: [1, "asc"],
				pagination: false,
				numPerPage: 20,
				colorScaling: false
			}
		]
	},
}

module.exports = {
	vizSettings: vizSettings,
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/bll/care_index.json"
}

function getDefaultValue(data) {
	let min = d3.min(data["countries"], (d) => { return Number(d["fake_year_data"]) });
	return min;
}