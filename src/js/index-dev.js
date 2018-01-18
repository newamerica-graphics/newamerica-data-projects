// this dev index script initializes the data call using the data url stored in the project's settings file and loops through all vizIds, calling the render function for each

import VizController from "./vizController.js"
var {vizSettings, preProcessData, dataUrl, externalScript} = require("./projects/" + PROJECT + "/settings.js")

if (externalScript) { $.getScript(externalScript) }

window.vizControl = new VizController(vizSettings, preProcessData);

window.vizControl.initialize({dataUrl:dataUrl});

window.addEventListener('resize', () => window.vizControl.resize());

Object.keys(vizSettings).forEach((vizKey) => {
    window.vizControl.render(vizKey)
})
