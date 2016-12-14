import $ from 'jquery';

import { colors } from "../../helper_functions/colors.js";
import { setupProject } from "../../viz_controller.js";
import { formatValue } from "../../helper_functions/format_value.js";

let variables = {
    medhhinc: {"variable":"MEDHHINC", "displayName":"Median Household Income", "format": "price",  "scaleType": "quantize", "customDomain":[0, 250000], "customRange":[colors.grey.light, colors.black], "numBins":5},
    minority: {"variable":"MINORITY", "displayName":"% Minority", "format": "number", "scaleType": "quantize", "customDomain":[0, 100], "customRange":[colors.grey.light, colors.black], "numBins":5},
    fampov: {"variable":"FAMPOV", "displayName":"% Families Below Poverty Line", "format": "number", "scaleType": "quantize", "customDomain":[0, 100], "customRange":[colors.grey.light, colors.black], "numBins":5},
    medval: {"variable":"MEDVAL", "displayName":"Medium Value of Houshold Units", "format": "price", "scaleType": "quantize", "customDomain":[0, 1000000], "customRange":[colors.grey.light, colors.black], "numBins":5},
    banks: {"variable":"banks", "displayName":"Banks", "format": "number"},
    altcredit: {"variable":"altcredit", "displayName":"Alternative Credit", "format": "number"},
    ncua: {"variable":"ncua", "displayName":"Credit Unions", "format": "number"},
    usps: {"variable":"usps", "displayName":"Post Offices", "format": "number"},

    county_altpc: {"variable":"altpc", "displayName":"Alt. Financial Services Per 10,000 People", "format": "number_per_ten_thousand",  "scaleType": "quantize", "customDomain":[0, 0.000839], "customRange":[colors.white, colors.red.dark], "numBins":3},
    county_tradpc: {"variable":"tradpc", "displayName":"Mainstream Financial Services Per 10,000 People", "format": "number_per_ten_thousand",  "scaleType": "quantize", "customDomain":[0, 0.003727], "customRange":[colors.white, colors.turquoise.dark], "numBins":3},
    county_altpertrad: {"variable":"altpertrad", "displayName":"Ratio of Alt. Financial Services to Mainstream", "format": "number",  "scaleType": "quantize", "customDomain":[0, 3], "customRange":[colors.white, colors.purple.dark], "numBins":3},
};

let insetMapSettings = [
    {
        title: "Atlanta",
        center: [-84.3880, 33.7490],
        zoom: 8
    },
    {
        title: "Chicago",
        center: [-87.6298, 41.8781],
        zoom: 8
    },
    {
        title: "Denver",
        center: [-104.9903, 39.7392],
        zoom: 8
    },
    // {
    //     title: "Houston",
    //     center: [-95.3698, 29.7604],
    //     zoom: 8
    // },
    {
        title: "New York",
        center: [-74.0059, 40.7128],
        zoom: 8
    },
    {
        title: "San Francisco",
        center: [-122.4194, 37.7749],
        zoom: 8
    },
    {
        title: "Washington D.C.",
        center: [-77.0369, 38.9072],
        zoom: 8
    },
]

let vizSettingsList = [
    // {
    //     id: "#financial-opportunity__census-tract-map", 
    //     vizType: "mapbox_map",
    //     mapboxStyleUrl: "mapbox://styles/newamericamapbox/civcm5ziy00d92imrwswlo1wv",
    //     source: {
    //         id:'census-tracts',
    //         sourceLayer: 'CensusTracts_2014data2K_2-3r3ays',
    //         url: 'mapbox://newamericamapbox.7zun44wf'
    //     },
    //     existingLayers: [variables.banks, variables.altcredit, variables.ncua, variables.usps],
    //     additionalLayers: [variables.medhhinc, variables.minority, variables.fampov, variables.medval],
    //     filters: [
    //         {
    //             filterVars: [variables.banks, variables.altcredit, variables.ncua, variables.usps],
    //             toggleInsets: true,
    //             canToggleMultiple: true
    //         },
    //         {
    //             filterVars: [variables.medhhinc, variables.minority, variables.fampov, variables.medval],
    //             toggleInsets: false,
    //             canToggleMultiple: false
    //         },
    //     ],
    //     tooltipVars: [variables.medhhinc, variables.minority, variables.fampov, variables.medval],
    //     insetMapSettings: insetMapSettings,
    //     popupContentFunction: censusTractMapSetPopupContent
    // },
    {
        id: "#financial-opportunity__county-map", 
        vizType: "mapbox_map",
        mapboxStyleUrl: "mapbox://styles/newamericamapbox/ciwdu1mzs003j2pmq94myzf8q",
        source: {
            id:'counties',
            sourceLayer: 'Countydata-4gt6se',
            url: 'mapbox://newamericamapbox.8v8ldjz3'
        },
        additionalLayers: [variables.county_altpertrad, variables.county_altpc, variables.county_tradpc],
        filters: [
            {
                filterVars: [variables.county_altpertrad, variables.county_altpc, variables.county_tradpc],
                toggleInsets: false,
                canToggleMultiple: false
            },
        ],
        tooltipVars: [variables.county_altpertrad, variables.county_altpc, variables.county_tradpc],
        insetMapSettings: false,
        popupContentFunction: countyMapSetPopupContent
    },
]

let projectSettings = {
    vizSettingsList: vizSettingsList
}

setupProject(projectSettings);

function censusTractMapSetPopupContent(feature) {
    console.log(this);
    let splitPieces = feature.properties.Geography.split(", ");

    let popupProperties = "";

    for (let i = 0; i < this.additionalLayers.length; i++) {
        let currVar = this.additionalLayers[i];
        popupProperties += "<li class='popup__property'>" +
                    "<h5 class='popup__property__label'>" + currVar.displayName + "</h5>" +
                    "<h5 class='popup__property__value'>" + formatValue(feature.properties[currVar.variable], currVar.format)  + "</h5>" +
                "</li>";
    }

    return "<h5 class='popup__subheading'>" + splitPieces[2] + "</h5>" +
    "<h3 class='popup__heading'>" + splitPieces[1] + "</h3>" +
    "<h5 class='popup__subheading'>" + splitPieces[0] + "</h5>" +
    "<ul class='popup__properties'>" + popupProperties + "</ul>"
}

function countyMapSetPopupContent(feature) {
    console.log(this);
    let popupProperties = "";

    for (let i = 0; i < this.additionalLayers.length; i++) {
        let currVar = this.additionalLayers[i];
        popupProperties += "<li class='popup__property'>" +
                    "<h5 class='popup__property__label'>" + currVar.displayName + "</h5>" +
                    "<h5 class='popup__property__value'>" + formatValue(feature.properties[currVar.variable], currVar.format)  + "</h5>" +
                "</li>";
    }

    return "<h3 class='popup__heading'>" + feature.properties.NAMELSAD10 + "</h3>" +
    "<ul class='popup__properties'>" + popupProperties + "</ul>"
}
