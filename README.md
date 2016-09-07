# newamerica-data-projects

Data Sheet Variables Settings

Data sheet variables should be defined in the projects/project name/index.js file as follows: 

let variables = {
	name: {"variable":"name", "displayName":"Name", "format":"string", "scaleType":"categorical", "color":"blue" ...},
	age: {"variable":"age", "displayName":"Age", "format":"number", "scaleType":"quantize", "color":"blue", ... }
}

variable - required - string representing the name of the variable in the data sheet (should match exactly)
displayName - string representing how the variable name should be displayed (on axes, tooltips, etc.) ______ set default if not specified ______
format - required - string representing how values for the variable should be formatted - OPTIONS: "string", "number", "year", "percent", "image" ______ set default if not specified ______
category - optional (only if grouping variables in display for tooltips, filters, etc.) - defines which category a variable should belong to.  Variables will be ungrouped by default
scaleType - required only if variable used for scaling - string representing type of scale - OPTIONS: "categorical", "quantize"
customDomain - optional (will use defaults if not set) - for categorical scales, array of values defines which values of the variable will be used and in what order they will appear, all other values of the variable will be discarded. If no custom domain is set, max of 12 values for default. For quantize scales, array of values defines the min, midpoint, and max values (will be automatically computed based on data if left unspecified) _____change "color" option for quantize scales to use this______
customRange - optional (will use defaults if not set) - array of values representing the output range.  For categorical domain, one to one mapping from value to range, for quantize, three values representing the min, midpoint, and max of the range


Viz Settings

Settings for each viz element to be rendered on the page should be defined as an array as follows:

let vizSettingsList = [
	{
		id: "#chart1", 
		vizType: "dot_histogram",
		groupingVars: [ variables.age ],
		filterVars: [ variables.marital_status ],
		tooltipVars: [ variables.full_name, variables.age, variables.marital_status, variables.terror_plot ],
		tooltipImageVar: variables.headshot,
		labelSettings: { interval: 5 }
	},
	{
		id: "#chart2", 
		vizType: "table",
		tableVars: [ variables.full_name, variables.age, variables.gender ],
		colorScaling: false
	},
]

Required for All

id - required - string representing the DOM element id where the viz will be rendered 
vizType - required - string representing the type of viz (see individual viz type for options)


Settings Common to Many Viz Types

filterVars - array of variables to be used for filtering the viz, will appear in order specified, with first being default, will categorize variables if they have categories
tooltipVars - array fo variables in tooltip, will appear in order specified, with first being title of tooltip, will categorize variables if they have categories
tooltipImageVar - optional - variable to be used for image in tooltip
groupingVars - for grouped viz types, array of variables that define the variable to use in forming groups, first will be default


Viz Types

Dot Matrix (vizType : "dot_matrix")

orientation - required - defines orientation of chart - OPTIONS: "horizontal", "vertical"
dotsPerRow - optional (will dynamically calculate if not specified) - number which sets fixed number of dots per row
filterVars, tooltipVars, tooltipImageVar - (see above)


Grouped Dot Matrix (vizType : "grouped_dot_matrix")

dotsPerRow: - required - number which sets fixed number of dots per row
distanceBetweenGroups - required - number of pixels for padding between groups
labelSettings - optional: 
{ 
	interval - number that sets frequency for labelling (ex. 5 means that every fifth group will be labelled) - default is 1 ___set default___
	showNumVals - boolean determining whether to show counts for each label - default is false
}
dividingLine: - optional - Currently only available for viz with only one filterVar: 
{ 
	value: value of filterVar to insert dividing line. Will insert line immediately following specified value
	title: string representing the title of the line caption,
	descriptionLines: array of strings representing the lines of text for the caption description
}
filterVars, tooltipVars, tooltipImageVar, groupingVars - (see above)


Dot Histogram (vizType : "dot_histogram")

labelSettings - (see Grouped Dot Matrix)
filterVars, tooltipVars, tooltipImageVar, groupingVars - (see above)


Fact Box

factBoxVals - required - array of objects for with settings for each box 
{ 
	variable - required - string, which variable to use for fact box
	value - required - value of that variable to use
	type - required - what kind of fact it is  OPTIONS: "percent", "sum"
	color - optional (turquoise if unspecified) - background color for fact box
	text - optional - text following fact box
}
			

Table

tableVars - required - array of variables to be used for table columns. Will appear in specified order, with first as default
colorScaling - optional - boolean determining if color scale will be applied to variable column

defaultOrderingVar, tooltipVars, tooltipImageVar, filterVars - currently unsupported



Project Settings

Settings for the project should be defined as an object as follows:

let projectSettings = {
	dataUrl: "https://na-data-projects.s3.amazonaws.com/data/isp/troubleshoot.json",
	dataSheetNames:["Sheet1", "Sheet2", ...],
	vizSettingsList: vizSettingsList,
	imageFolderId: "0B2KbJlQb9jlgeG5hOXZqbURpRUE"
}

dataUrl - required - url of JSON file on S3 - form should follow "https://na-data-projects.s3.amazonaws.com/data/PROGRAM/FILENAME.json
dataSheetNames - required - array of strings representing the sheets of the source spreadsheet
vizSettingsList - required - array of VizSettings objects
imageFolderId - optional - Google ID of folder containing images for project
