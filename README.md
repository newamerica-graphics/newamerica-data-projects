# NA Data Projects

Primary repository for New America's data visualization projects

## Getting Started

1. clone repo
2. run ``` npm install ```

## Creating/Editing a Project

#### Initializing a New Project
1. Create a new folder within the src/js/projects directory titled with the project_id (no spaces/capital letters)
2. Create an settings.js file within this new folder.  settings.js must contain:
    * variables definitions array (see spec below)
    * vizSettings object (see spec below)
    * ``` module.exports { vizSettings: vizSettings } ```

#### Development

1. to start the dev server run ``` npm run start ```
2. to create a dev build of the project run ``` npm run dev -- --env.project=<project_id> ``` 
(where project id is the title given to the folder in step 1) 
    * You should now see a file in the local build directory entitled <project_id>.js
    * leave this command running, as it will watch for any changes you make to the project and update the bundle in your local build directory
    
#### Creating a Production Build
1. to create a production build of the project run ``` npm run build -- --env.project=<project_id> ```
    * this will upload a copy of the bundled script to new america's data project s3 bucket, which will then be able to be included as an external script in any post page on the New America site  
    
#### Integrating Bundled Project Script with New America Site
1. Create a new In Depth Project, Blog Post, Article, Podcast, Policy Paper, etc. in the Wagtail editor
2. Go to the settings tab for the page you just created and add the name of the script (project_id.js) to the DATA PROJECT EXTERNAL SCRIPT field
3. Add dataviz blocks to the post, with the corresponding dataviz id for each visualization

## Variables Definition Spec
The variables definition section of the settings config defines the formatting and display settings for each variable used in the visualizations for the project. It consists of an object with entries for every variable, each containing the following :

* variable: the variable name (corresponds with column title in spreadsheet)
* displayName: how the variable should be displayed in labels, legends, tooltips
* format: how the value of the variable should be formatted wherever displayed - possible options include:
   * number: 134,500
   * integer: 145
   * price: $3,355.98
   * year: 1990
   * percent: 57%
   * rank: 1st
   * date: January 1, 2015
   * string: "This is a string"
   * markdown
   * link

Depending upon the visualization, additional fields may be required in the variable definition.  These include:
* scaleType: "linear"|"categorical"|"quantize"
* customDomain: []
* customRange: []
* numBins: int (for quantize scales)
* color
* category
* disableTableOrdering: true|false
* canSplitCategory: true|false

## Viz Settings Definition Spec
The vizSettings object contains a key-value pair for each visualization in the project, where the key is the id which will be targeted in the DOM and the value is a settings object defining the custom behavior of that visualization.  All chart types require the following:
* vizType: any of the react or non-react chart names (i.e. "bar_chart", "line_chart")
* primaryDataSheet: the name of the individual sheet where the data for the visualization should be pulled
* isReact: defaults to false

In addition to these fields, each vizType requires additional variables to define its requisite settings. 

## Integration with Wagtail Templating Backend

The bundled script output for a given project will instantiate a viz controller object for the project.  This viz controller has the following public methods:

##### initialize({dataUrl, clickToProfileFunction, downloadableDataSheets})
* initiates data fetch call and optionally overrides click to profile function
* (required) dataUrl {String} - url path for project's data json source
* (optional) clickToProfileFunction {String} - overrides default clickToProfileFunction (function called within viz elements that link to a project's profile pages)
* (optional) downloadableDataSheets {[String]} - specifies names of sheets in Google Sheet for project that should available for download (defaults to all sheets)

##### render(dataVizId)
* renders a given dataviz element
* (required) dataVizId {String} - id (without #) for the viz element you wish to render

##### resize()
* loops through list of non-react viz elements, calling each element's resize function

##### reset()
* clears list of non-react viz elements (should be called upon component unmount)

##### getData()
* get method for retrieving the project data, if async data call has not yet completed, will return null
* @return {object} object containing an array for each sheet in the datasheet

