import $ from 'jquery';

import { colors } from "../../helper_functions/colors.js";
import { setupProject } from "../../viz_controller.js";

let variables = {
    medhhinc: {"variable":"MEDHHINC", "displayName":"Median Household Income", "format": "price",  "scaleType": "quantize", "customDomain":[0, 250000], "customRange":[colors.grey.light, colors.black], "numBins":5},
    minority: {"variable":"MINORITY", "displayName":"% Minority", "format": "number", "scaleType": "quantize", "customDomain":[0, 100], "customRange":[colors.grey.light, colors.black], "numBins":5},
    fampov: {"variable":"FAMPOV", "displayName":"% Families Below Poverty Line", "format": "number", "scaleType": "quantize", "customDomain":[0, 100], "customRange":[colors.grey.light, colors.black], "numBins":5},
    medval: {"variable":"MEDVAL", "displayName":"Medium Value of Houshold Units", "format": "price", "scaleType": "quantize", "customDomain":[0, 1000000], "customRange":[colors.grey.light, colors.black], "numBins":5},
};

let vizSettingsList = [
    {
        id: "#financial-opportunity__census-tract-map", 
        vizType: "mapbox_map",
        mapboxStyleUrl: "mapbox://styles/newamericamapbox/civcm5ziy00d92imrwswlo1wv",
        layerVars: variables,
    },
]

let projectSettings = {
    vizSettingsList: vizSettingsList
}

setupProject(projectSettings);

