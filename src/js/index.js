// in the meantime, before the refresh is finished, the following script initializes the vizControl object with the appropriate dataUrl
// (currently stored in the project's settings file) and loops through the vizIds in the project, calling the render function for each

import VizController from "./vizController.js"
var {vizSettings, dataUrl, downloadableDataSheets, customDataDownloadSource, externalScript} = require("./projects/" + PROJECT + "/settings.js")

if (externalScript) { $.getScript(externalScript) }

window.vizControl = new VizController(vizSettings);

window.vizControl.initialize({dataUrl:dataUrl});

window.addEventListener('resize', vizControl.resize);

Object.keys(vizSettings).forEach((vizKey) => {
    window.vizControl.render(vizKey)
})

window.vizControl.setDataDownloadLinks(downloadableDataSheets, customDataDownloadSource)

// ---------------------------------------------------------------
// When the refresh is finished, replace the above with the following:
// (the differences are that the initialize and render functions will be called by the template renderer in the exposed vizControl object
// so they will not be called by default in thsi script)


// import VizController from "./vizController.js"
// var {vizSettings, externalScript} = require("./projects/" + PROJECT + "/settings.js")

// if (externalScript) { $.getScript(externalScript) }

// window.vizControl = new VizController(vizSettings);

// window.addEventListener('resize', vizControl.resize);