import { setupProject } from "../../viz_controller.js";

import { colors } from "../../helper_functions/colors.js";

let variables = {
	type: {"variable":"type", "displayName":"Type", "format": "string", "scaleType":"categorical", "customDomain":["Tropical Storm", "Flood", "Snow/ Ice Storm", "Severe Weather", "Drought",  "Wildfire", "Tornado", "Hurricane"], "customRange":[colors.turquoise.light, colors.blue.light, colors.blue.dark, colors.purple.light, colors.red.light, colors.red.dark, colors.orange.light, colors.orange.dark]},
	fema_description: {"variable":"fema_description", "displayName":"FEMA Description", "format": "string"},
	end_date: {"variable":"end_date", "displayName":"End Date", "format": "date"},
	start_date: {"variable":"start_date", "displayName":"Start Date", "format": "date"}, 
	year: {"variable":"year", "displayName":"Year", "format": "year"}, 
	month: {"variable":"month", "displayName":"Month", "format": "number"}, 

	category: {"variable":"category", "displayName":"Category", "format": "string"},

	name: {"variable":"name", "displayName":"County", "format": "string"},
	state: {"variable":"state", "displayName":"State", "format": "string"},
	profile_link: {"variable":"profile_link", "displayName":"Profile Link", "format": "string"},
	county_population: {"variable":"county_population", "displayName":"Population", "format": "number"},
	white_perc: {"variable":"white_perc", "displayName":"% White", "format": "percent"},
	black_perc: {"variable":"black_perc", "displayName":"% Black", "format": "percent"},
	hisp_perc: {"variable":"hisp_perc", "displayName":"% Hispanic or Latino", "format": "percent"},
	amin_perc: {"variable":"amin_perc", "displayName":"% American Indian", "format": "percent"},
	asian_perc: {"variable":"asian_perc", "displayName":"% Asian", "format": "percent"},
	two_or_more_perc: {"variable":"two_or_more_perc", "displayName":"% Two or More Races", "format": "percent"},
	unemployment: {"variable":"unemployment", "displayName":"Unemployment Rate", "format": "percent"},
	poverty_line: {"variable":"poverty_line", "displayName":"Living in Poverty", "format": "percent"},
	total_disaster_count: {"variable":"total_disaster_count", "displayName":"Total", "format": "number"},
	flood: {"variable":"flood", "displayName":"Floods", "format": "number"},
	tornado: {"variable":"tornado", "displayName":"Tornadoes", "format": "number"},
	snow_ice_storm: {"variable":"snow_ice_storm", "displayName":"Snow/ Ice Storms", "format": "number"},
	severe_weather: {"variable":"severe_weather", "displayName":"Severe Weather", "format": "number"},
	drought: {"variable":"drought", "displayName":"Drought", "format": "number"},
	tropical_storm: {"variable":"tropical_storm", "displayName":"Tropical Storm", "format": "number"},
	wildfire: {"variable":"wildfire", "displayName":"Wildfire", "format": "number"},
	hurricane: {"variable":"hurricane", "displayName":"Hurricane", "format": "number"},
	events_experienced: {"variable":"events_experienced", "displayName":"Weather Types Experienced", "format": "string"},
}

const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


let vizSettingsList = [
	{
		id:"#weather-eye__county-map",
		vizType: "mapbox_map",
		primaryDataSheet: "county_overview",
        mapboxSettings: {
        	style: "mapbox://styles/newamericamapbox/cja4e4wen2ise2socuy99l5lc",
        	center: [-101, 35.1056],
        	zoom: 0,
        	scrollZoom: false,
        },
        defaultColor: colors.turquoise.light,
        defaultRadius: 10,
        showLegend: false,
        hasHover: true,
        fitBounds: [
        	[-124.7844079, 24.7433195],
        	[-66.9513812, 49.3457868]
        ],
        widthHeightConversionFunc: w => { return w > 500 ? (3*w)/5 : 500},
        overrideClickFunction: d => {
        	console.log(d);
        	if (d.profile_link) {
        		window.location.href = d.profile_link
        	}
        },
        dataBoxBackgroundColor: "#e6e6e6",
        dataBoxVars: {
        	title: variables.name,
        	subtitle: [variables.state],
        	categories: [
        		{ 
	        		fields: [variables.county_population, variables.unemployment, variables.poverty_line] 
	        	},
        		{ 
	        		label: "Population by Race",
	        		fields: [variables.white_perc, variables.black_perc, variables.hisp_perc, variables.amin_perc, variables.asian_perc, variables.two_or_more_perc] 
	        	},
	        	{ 
	        		label: "Weather Profile",
	        		fields: [variables.events_experienced] 
	        	}
        	]
        }
    },
]

const reactVizSettingsList = [
	{
		id: "#weather-eye__st-louis__call-out", 
		vizType: "callout_box",
		primaryDataSheet: "county_overview",
		filterInitialDataFunction: d => d.name === "St Louis County",
		backgroundColor: "white",
		columns: [
			{
				width: "33%",
				fullWidthBreakpoint: 500,
				sections:[
					{
						dataElements: [
							{
								type: "fact-box-list",
								format: "vertical-outline",
								factBoxVars: [
									{ label: "County Population", type: "value", variable: variables.county_population},
									{ label: "Unemployment Rate", type: "value", variable: variables.unemployment},
									{ label: "Percent Living in Poverty", type: "value", variable: variables.poverty_line}
								]
							},
						]
					},
				]
			},
			{
				width: "33%",
				fullWidthBreakpoint: 500,
				sections:[
					{
						title: "Population by Race",
						dataElements: [
							{
								type:"fact-box-list",
								format:"vertical",
								factBoxVars: [
									{ label: "White", type: "value", variable: variables.white_perc},
									{ label: "Black", type: "value", variable: variables.black_perc},
									{ label: "Hispanic or Latino", type: "value", variable: variables.hisp_perc},
									{ label: "American Indian", type: "value", variable: variables.amin_perc},
									{ label: "Asian", type: "value", variable: variables.asian_perc},
									{ label: "Two or More Races", type: "value", variable: variables.two_or_more_perc}
								]
							},
						]
					},
				]
			},
			{
				width: "33%",
				fullWidthBreakpoint: 500,
				sections:[
					{
						title: "Disaster Declarations by Type (Since 1973)",
						dataElements: [
							{
								type:"chart",
								chartSettings: {
									vizType: "dot_chart",
									primaryDataSheet: "st_louis",
									colorSettings: { colorVar: variables.type, showLegend: false },
									tooltipTitleVar: variables.type,
									tooltipVars: [variables.fema_description, variables.start_date, variables.end_date],
									dotScaleRange: [4, 20],
									interaction: "mouseover",
									layouts: [
										{
											label: "Storm Events by Type",
											layout: "category",
											categoryVar: variables.type,
											sortCategoryValsFunction: (a, b) => { return new Date(a.start_date) - new Date(b.start_date)},
											leftMargin: 125,
											verticalPadding: 20
										}
									]
								},
							},
						]
					},
				]
			}
		]
	},
	{
		id: "#weather-eye__caddo__call-out", 
		vizType: "callout_box",
		primaryDataSheet: "county_overview",
		filterInitialDataFunction: d => d.name === "Caddo County",
		backgroundColor: "white",
		columns: [
			{
				width: "33%",
				fullWidthBreakpoint: 500,
				sections:[
					{
						dataElements: [
							{
								type: "fact-box-list",
								format: "vertical-outline",
								factBoxVars: [
									{ label: "County Population", type: "value", variable: variables.county_population},
									{ label: "Unemployment Rate", type: "value", variable: variables.unemployment},
									{ label: "Percent Living in Poverty", type: "value", variable: variables.poverty_line}
								]
							},
						]
					},
				]
			},
			{
				width: "33%",
				fullWidthBreakpoint: 500,
				sections:[
					{
						title: "Population by Race",
						dataElements: [
							{
								type:"fact-box-list",
								format:"vertical",
								factBoxVars: [
									{ label: "White", type: "value", variable: variables.white_perc},
									{ label: "Black", type: "value", variable: variables.black_perc},
									{ label: "Hispanic or Latino", type: "value", variable: variables.hisp_perc},
									{ label: "American Indian", type: "value", variable: variables.amin_perc},
									{ label: "Asian", type: "value", variable: variables.asian_perc},
									{ label: "Two or More Races", type: "value", variable: variables.two_or_more_perc}
								]
							},
						]
					},
				]
			},
			{
				width: "33%",
				fullWidthBreakpoint: 500,
				sections:[
					{
						title: "Disaster Declarations by Type (Since 1982)",
						dataElements: [
							{
								type:"chart",
								chartSettings: {
									vizType: "dot_chart",
									primaryDataSheet: "caddo",
									colorSettings: { colorVar: variables.type, showLegend: false },
									tooltipTitleVar: variables.type,
									tooltipVars: [variables.fema_description, variables.start_date, variables.end_date],
									dotScaleRange: [4, 20],
									interaction: "mouseover",
									layouts: [
										{
											label: "Storm Events by Type",
											layout: "category",
											categoryVar: variables.type,
											sortCategoryValsFunction: (a, b) => { return new Date(a.start_date) - new Date(b.start_date)},
											leftMargin: 125,
											verticalPadding: 20
										}
									]
								},
							},
						]
					},
				]
			}
		]
	},
	{
		id: "#weather-eye__essex__call-out", 
		vizType: "callout_box",
		primaryDataSheet: "county_overview",
		filterInitialDataFunction: d => d.name === "Essex County",
		backgroundColor: "white",
		columns: [
			{
				width: "33%",
				fullWidthBreakpoint: 500,
				sections:[
					{
						dataElements: [
							{
								type: "fact-box-list",
								format: "vertical-outline",
								factBoxVars: [
									{ label: "County Population", type: "value", variable: variables.county_population},
									{ label: "Unemployment Rate", type: "value", variable: variables.unemployment},
									{ label: "Percent Living in Poverty", type: "value", variable: variables.poverty_line}
								]
							},
						]
					},
				]
			},
			{
				width: "33%",
				fullWidthBreakpoint: 500,
				sections:[
					{
						title: "Population by Race",
						dataElements: [
							{
								type:"fact-box-list",
								format:"vertical",
								factBoxVars: [
									{ label: "White", type: "value", variable: variables.white_perc},
									{ label: "Black", type: "value", variable: variables.black_perc},
									{ label: "Hispanic or Latino", type: "value", variable: variables.hisp_perc},
									{ label: "American Indian", type: "value", variable: variables.amin_perc},
									{ label: "Asian", type: "value", variable: variables.asian_perc},
									{ label: "Two or More Races", type: "value", variable: variables.two_or_more_perc}
								]
							},
						]
					},
				]
			},
			{
				width: "33%",
				fullWidthBreakpoint: 500,
				sections:[
					{
						title: "Disaster Declarations by Type (Since 1972)",
						dataElements: [
							{
								type:"chart",
								chartSettings: {
									vizType: "dot_chart",
									primaryDataSheet: "essex",
									colorSettings: { colorVar: variables.type, showLegend: false },
									tooltipTitleVar: variables.type,
									tooltipVars: [variables.fema_description, variables.start_date, variables.end_date],
									dotScaleRange: [4, 20],
									interaction: "mouseover",
									layouts: [
										{
											label: "Storm Events by Type",
											layout: "category",
											categoryVar: variables.type,
											sortCategoryValsFunction: (a, b) => { return new Date(a.start_date) - new Date(b.start_date)},
											leftMargin: 125,
											verticalPadding: 20
										}
									]
								},
							},
						]
					},
				]
			}
		]
	},
	{
		id: "#weather-eye__walsh__call-out", 
		vizType: "callout_box",
		primaryDataSheet: "county_overview",
		filterInitialDataFunction: d => d.name === "Walsh County",
		backgroundColor: "white",
		columns: [
			{
				width: "33%",
				fullWidthBreakpoint: 500,
				sections:[
					{
						dataElements: [
							{
								type: "fact-box-list",
								format: "vertical-outline",
								factBoxVars: [
									{ label: "County Population", type: "value", variable: variables.county_population},
									{ label: "Unemployment Rate", type: "value", variable: variables.unemployment},
									{ label: "Percent Living in Poverty", type: "value", variable: variables.poverty_line}
								]
							},
						]
					},
				]
			},
			{
				width: "33%",
				fullWidthBreakpoint: 500,
				sections:[
					{
						title: "Population by Race",
						dataElements: [
							{
								type:"fact-box-list",
								format:"vertical",
								factBoxVars: [
									{ label: "White", type: "value", variable: variables.white_perc},
									{ label: "Black", type: "value", variable: variables.black_perc},
									{ label: "Hispanic or Latino", type: "value", variable: variables.hisp_perc},
									{ label: "American Indian", type: "value", variable: variables.amin_perc},
									{ label: "Asian", type: "value", variable: variables.asian_perc},
									{ label: "Two or More Races", type: "value", variable: variables.two_or_more_perc}
								]
							},
						]
					},
				]
			},
			{
				width: "33%",
				fullWidthBreakpoint: 500,
				sections:[
					{
						title: "Disaster Declarations by Type (Since 1965)",
						dataElements: [
							{
								type:"chart",
								chartSettings: {
									vizType: "dot_chart",
									primaryDataSheet: "walsh",
									colorSettings: { colorVar: variables.type, showLegend: false },
									tooltipTitleVar: variables.type,
									tooltipVars: [variables.fema_description, variables.start_date, variables.end_date],
									dotScaleRange: [4, 20],
									interaction: "mouseover",
									layouts: [
										{
											label: "Storm Events by Type",
											layout: "category",
											categoryVar: variables.type,
											sortCategoryValsFunction: (a, b) => { return new Date(a.start_date) - new Date(b.start_date)},
											leftMargin: 125,
											verticalPadding: 20
										}
									]
								},
							},
						]
					},
				]
			}
		]
	},
	{
		id: "#weather-eye__tulsa__call-out", 
		vizType: "callout_box",
		primaryDataSheet: "county_overview",
		filterInitialDataFunction: d => d.name === "Tulsa County",
		backgroundColor: "white",
		columns: [
			{
				width: "33%",
				fullWidthBreakpoint: 500,
				sections:[
					{
						dataElements: [
							{
								type: "fact-box-list",
								format: "vertical-outline",
								factBoxVars: [
									{ label: "County Population", type: "value", variable: variables.county_population},
									{ label: "Unemployment Rate", type: "value", variable: variables.unemployment},
									{ label: "Percent Living in Poverty", type: "value", variable: variables.poverty_line}
								]
							},
						]
					},
				]
			},
			{
				width: "33%",
				fullWidthBreakpoint: 500,
				sections:[
					{
						title: "Population by Race",
						dataElements: [
							{
								type:"fact-box-list",
								format:"vertical",
								factBoxVars: [
									{ label: "White", type: "value", variable: variables.white_perc},
									{ label: "Black", type: "value", variable: variables.black_perc},
									{ label: "Hispanic or Latino", type: "value", variable: variables.hisp_perc},
									{ label: "American Indian", type: "value", variable: variables.amin_perc},
									{ label: "Asian", type: "value", variable: variables.asian_perc},
									{ label: "Two or More Races", type: "value", variable: variables.two_or_more_perc}
								]
							},
						]
					},
				]
			},
			{
				width: "33%",
				fullWidthBreakpoint: 500,
				sections:[
					{
						title: "Disaster Declarations by Type (Since 1971)",
						dataElements: [
							{
								type:"chart",
								chartSettings: {
									vizType: "dot_chart",
									primaryDataSheet: "tulsa",
									colorSettings: { colorVar: variables.type, showLegend: false },
									tooltipTitleVar: variables.type,
									tooltipVars: [variables.fema_description, variables.start_date, variables.end_date],
									dotScaleRange: [4, 20],
									interaction: "mouseover",
									layouts: [
										{
											label: "Storm Events by Type",
											layout: "category",
											categoryVar: variables.type,
											sortCategoryValsFunction: (a, b) => { return new Date(a.start_date) - new Date(b.start_date)},
											leftMargin: 125,
											verticalPadding: 20
										}
									]
								},
							},
						]
					},
				]
			}
		]
	},
	{
		id: "#weather-eye__st-louis__dot-chart", 
		vizType: "dot_chart",
		primaryDataSheet: "st_louis",
		colorSettings: { colorVar: variables.type, showLegend: true },
		tooltipTitleVar: variables.type,
		tooltipVars: [variables.fema_description, variables.start_date, variables.end_date],
		dotScaleRange: [2, 6],
		interaction: "mouseover",
		layouts: [
			{
				label: "Storm Events by Year",
				layout: "histogram_fixed_interval",
				xVar: variables.year,
				sortingVar: variables.start_date,
				fixedStartVal: 1973
			},
			{
				label: "Storm Events by Month",
				layout: "histogram_fixed_interval",
				xVar: variables.month,
				sortingVar: variables.start_date,
				maxWidth: 600,
				axisLabelOverrideFunc: d => months[+d]
			},
		]
	},
	{
		id: "#weather-eye__caddo__dot-chart", 
		vizType: "dot_chart",
		primaryDataSheet: "caddo",
		colorSettings: { colorVar: variables.type, showLegend: true },
		tooltipTitleVar: variables.type,
		tooltipVars: [variables.fema_description, variables.start_date, variables.end_date],
		dotScaleRange: [2, 5],
		interaction: "mouseover",
		layouts: [
			{
				label: "Storm Events by Year",
				layout: "histogram_fixed_interval",
				xVar: variables.year,
				sortingVar: variables.start_date,
				fixedStartVal: 1982
			},
			{
				label: "Storm Events by Month",
				layout: "histogram_fixed_interval",
				xVar: variables.month,
				sortingVar: variables.start_date,
				maxWidth: 600,
				axisLabelOverrideFunc: d => months[+d]
			}
		]
	},
	{
		id: "#weather-eye__walsh__dot-chart", 
		vizType: "dot_chart",
		primaryDataSheet: "walsh",
		colorSettings: { colorVar: variables.type, showLegend: true },
		tooltipTitleVar: variables.type,
		tooltipVars: [variables.fema_description, variables.start_date, variables.end_date],
		dotScaleRange: [2, 6],
		interaction: "mouseover",
		layouts: [
			{
				label: "Storm Events by Year",
				layout: "histogram_fixed_interval",
				xVar: variables.year,
				sortingVar: variables.start_date,
				fixedStartVal: 1965
			},
			{
				label: "Storm Events by Month",
				layout: "histogram_fixed_interval",
				xVar: variables.month,
				sortingVar: variables.start_date,
				maxWidth: 600,
				axisLabelOverrideFunc: d => months[+d]
			}
		]
	},
	{
		id: "#weather-eye__essex__dot-chart", 
		vizType: "dot_chart",
		primaryDataSheet: "essex",
		colorSettings: { colorVar: variables.type, showLegend: true },
		tooltipTitleVar: variables.type,
		tooltipVars: [variables.fema_description, variables.start_date, variables.end_date],
		dotScaleRange: [2, 6],
		interaction: "mouseover",
		layouts: [
			{
				label: "Storm Events by Year",
				layout: "histogram_fixed_interval",
				xVar: variables.year,
				sortingVar: variables.start_date,
				fixedStartVal: 1972
			},
			{
				label: "Storm Events by Month",
				layout: "histogram_fixed_interval",
				xVar: variables.month,
				sortingVar: variables.start_date,
				maxWidth: 600,
				axisLabelOverrideFunc: d => months[+d]
			}
		]
	},
	{
		id: "#weather-eye__tulsa__dot-chart", 
		vizType: "dot_chart",
		primaryDataSheet: "tulsa",
		colorSettings: { colorVar: variables.type, showLegend: true },
		tooltipTitleVar: variables.type,
		tooltipVars: [variables.fema_description, variables.start_date, variables.end_date],
		dotScaleRange: [2, 6],
		interaction: "mouseover",
		layouts: [
			{
				label: "Storm Events by Year",
				layout: "histogram_fixed_interval",
				xVar: variables.year,
				sortingVar: variables.start_date,
				fixedStartVal: 1971
			},
			{
				label: "Storm Events by Month",
				layout: "histogram_fixed_interval",
				xVar: variables.month,
				sortingVar: variables.start_date,
				maxWidth: 600,
				axisLabelOverrideFunc: d => months[+d]
			}
		]
	},
	{
		id: "#weather-eye__cumberland__dot-chart", 
		vizType: "dot_chart",
		primaryDataSheet: "cumberland",
		colorSettings: { colorVar: variables.type, showLegend: true },
		tooltipTitleVar: variables.type,
		tooltipVars: [variables.fema_description, variables.start_date, variables.end_date],
		dotScaleRange: [2, 6],
		interaction: "mouseover",
		layouts: [
			{
				label: "Storm Events by Year",
				layout: "histogram_fixed_interval",
				xVar: variables.year,
				sortingVar: variables.start_date,
				fixedStartVal: 1965
			},
			{
				label: "Storm Events by Month",
				layout: "histogram_fixed_interval",
				xVar: variables.month,
				sortingVar: variables.start_date,
				maxWidth: 600,
				axisLabelOverrideFunc: d => months[+d]
			}
		]
	},
	
	{
		id: "#weather-eye__findings__all", 
		vizType: "quote_scroller",
		primaryDataSheet: "storm_quotes",
		categoryDescriptionSheet: "storm_quotes_category_descriptions",
		categoryVar: variables.category,
		showCategoryTitle: true
	}
]

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/resourcesecurity/weather-eye.json",
	dataSheetNames:["st_louis", "walsh", "caddo", "essex", "tulsa", "cumberland", "storm_quotes", "storm_quotes_category_descriptions"],
	vizSettingsList: vizSettingsList,
	reactVizSettingsList: reactVizSettingsList
}

setupProject(projectSettings);
	