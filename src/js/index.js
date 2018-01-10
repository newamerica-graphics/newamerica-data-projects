console.log(PROJECT)

import VizController from "./vizController.js"
var {vizSettings, dataUrl} = require("./projects/" + PROJECT + "/settings.js")

console.log(vizSettings, dataUrl)

window.vizControl = new VizController(vizSettings);

window.vizControl.initialize({dataUrl:dataUrl});

window.addEventListener('resize', vizControl.resize);

Object.keys(vizSettings).forEach((vizKey) => {
    window.vizControl.render(vizKey)
})
