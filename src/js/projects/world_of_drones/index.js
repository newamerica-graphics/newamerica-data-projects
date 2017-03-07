import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";

let d3 = require("d3");

let variables = {
	id: {"variable": "id", "displayName":"ID", "format":"number"},
	name: {"variable": "name", "displayName":"Country", "format":"string"},
	exports_to: {"variable": "exports_to", "displayName":"Exporters", "format":"string"},
	imports_from: {"variable": "imports_from", "displayName":"Importers", "format":"string"},
	domestic_production: {"variable": "domestic_production", "displayName":"Domestic Production", "format":"string", "scaleType":"categorical", "customRange":[colors.grey.light, colors.turquoise.light]},
	fake_year_data: {"variable": "fake_year_data", "displayName":"Fake Year", "format":"year", "scaleType":"categorical", "customRange":[colors.turquoise.light]},
	description: {"variable": "description", "displayName":"Description", "format":"string", "disableTableOrdering": true},
	developing_armed_drones_year: {"variable": "developing_armed_drones_year", "displayName":"Year", "format":"year", "scaleType":"categorical", "customRange":[colors.turquoise.light]},
	developing_armed_drones_description: {"variable": "developing_armed_drones_description", "displayName":"Description", "format":"string", "disableTableOrdering": true},
}

let vizSettingsList = [
	{
		id: "#world-of-drones__import-export", 
		vizType: "bipartite",
		primaryDataSheet: "countries",
		keyVar: variables.name,
		leftVar: variables.exports_to,
		rightVar: variables.imports_from,
	},
	{
		id: "#world-of-drones__domestic-production",
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
				filterInitialDataBy: { field: "developing_armed_drones_year" },
				tableVars: [variables.name, variables.developing_armed_drones_description],
				defaultOrdering: [0, "asc"],
				pagination: true,
				numPerPage: 15,
				colorScaling: false
			}
		]
	},
	// {
	// 	id: "#world-of-drones__domestic-production",
	// 	vizType: "tabbed_chart_layout",
	// 	primaryDataSheet: "countries",
	// 	chartSettingsList: [
	// 		{
	// 			vizType: "dashboard",
	// 			getDefaultValueFunction: getDefaultValue,
	// 			layoutRows: [
	// 				[
	// 					{
	// 						vizType: "slider",
	// 						primaryDataSheet: "countries",
	// 						variable: variables.fake_year_data,
	// 						isMessagePasser: true,
	// 						automated: true
	// 					}
	// 				],
	// 				[
	// 					{
	// 						vizType: "topo_json_map",
	// 						primaryDataSheet: "countries",
	// 						geometryType: "world",
	// 						stroke: {"color": "white", "width":"1", "opacity": "1", "hoverColor": "white", "hoverWidth": "3"},
	// 						defaultFill: colors.grey.light,
	// 						geometryVar: variables.id,
	// 						filterVars: [variables.fake_year_data],
	// 						tooltipVars: [variables.name, variables.description],
	// 						zoomable: false,
	// 						messageHandlerType: "change_value",
	// 					}
	// 				]
	// 			]
	// 		},
	// 		{
	// 			vizType: "table",
	// 			tableVars: [variables.name, variables.description],
	// 			defaultOrdering: [0, "asc"],
	// 			pagination: true,
	// 			numPerPage: 15,
	// 			colorScaling: false
	// 		}
	// 	]
	// },
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/isp/wod-military.json",
	downloadDataLink: "https://docs.google.com/spreadsheets/d/1RptooWTfZbDEtlqNUb_GiqI6ihQubWUHffE9hbfht9k/",
	dataSheetNames:["countries"],
	vizSettingsList: vizSettingsList
}

setupProject(projectSettings);

function getDefaultValue(data) {
	console.log("getting default value");
	console.log(data);
	let min = d3.min(data["countries"], (d) => { return Number(d["fake_year_data"]) });
	console.log(min);
	return min;
}