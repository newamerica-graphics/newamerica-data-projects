console.log(VIZ_SETTINGS, DATA_URL)

import VizController from "./vizController.js"

window.vizControl = new VizController(VIZ_SETTINGS);

window.vizControl.initialize({dataUrl:DATA_URL});

window.addEventListener('resize', vizControl.resize);

Object.keys(VIZ_SETTINGS).forEach((vizKey) => {
    window.vizControl.render(vizKey)
})
