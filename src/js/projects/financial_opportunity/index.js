import $ from 'jquery';

import { colors } from "../../helper_functions/colors.js";
import { setupProject } from "../../viz_controller.js";
import { formatValue } from "../../helper_functions/format_value.js";

let variables = {
    medhhinc: {"variable":"MEDHHINC", "displayName":"Median Household Income", "format": "price",  "scaleType": "quantize", "customDomain":[0, 250000], "customRange":[colors.white, colors.grey.light, colors.black], "numBins":5},
    minority: {"variable":"MINORITY", "displayName":"% Minority", "format": "number", "scaleType": "quantize", "customDomain":[0, 100], "customRange":[colors.white, colors.grey.light, colors.black], "numBins":5},
    fampov: {"variable":"FAMPOV", "displayName":"% Families Below Poverty Line", "format": "number", "scaleType": "quantize", "customDomain":[0, 100], "customRange":[colors.white, colors.grey.light, colors.black], "numBins":5},
    medval: {"variable":"MEDVAL", "displayName":"Median Value of Owner-Occupied Units", "format": "price", "scaleType": "quantize", "customDomain":[0, 1000000], "customRange":[colors.white, colors.grey.light, colors.black], "numBins":5},
    banks: {"variable":"banks", "displayName":"Banks", "format": "number"},
    altcredit: {"variable":"altcredit", "displayName":"Alternative Credit", "format": "number"},
    ncua: {"variable":"ncua", "displayName":"Credit Unions", "format": "number"},
    usps: {"variable":"usps", "displayName":"Post Offices", "format": "number"},
    totpop: {"variable":"TOTPOP", "displayName":"Total Population", "format": "number"},
    black: {"variable":"BLACK", "displayName":"Black", "format": "percent_no_multiply"},
    white: {"variable":"WHITE", "displayName":"White", "format": "percent_no_multiply"},
    aian: {"variable":"AIAN", "displayName":"American Indian/Alaskan Native", "format": "percent_no_multiply"},
    asian: {"variable":"ASIAN", "displayName":"Asian/Native Hawaiian/Other Pacific Islander", "format": "percent_no_multiply"},
    tworace: {"variable":"TWORACE", "displayName":"Two or More Races", "format": "percent_no_multiply"},
    hispanic: {"variable":"HISPANIC", "displayName":"Hispanic/Latino", "format": "percent_no_multiply"},
    bank2014: {"variable":"bank2014", "displayName":"Banks", "format": "number"},
    ncua2014: {"variable":"ncua2014", "displayName":"Credit Unions", "format": "number"},
    checkcash: {"variable":"checkcash", "displayName":"Check Cashing", "format": "number"},
    moneyorder: {"variable":"moneyorder", "displayName":"Money Orders", "format": "number"},
    payday: {"variable":"payday", "displayName":"Payday, Installment, and Other Alternative Loans", "format": "number"},
    titleloan: {"variable":"titleloan", "displayName":"Auto and Other Title Loans", "format": "number"},
    pawn: {"variable":"pawn", "displayName":"Pawnbrokers and Furniture Rentals", "format": "number"},
    tax: {"variable":"tax", "displayName":"Tax Return and Filing Services", "format": "number"},
    irsVita: {"variable":"irs-vita", "displayName":"IRS-VITA", "format": "number"},
    bankon: {"variable":"bankon", "displayName":"Bank On City", "format": "number"},
    cdfi: {"variable":"cdfi", "displayName":"CDFI", "format": "number"},
    ida: {"variable":"ida", "displayName":"IDA", "format": "number"},
    nfccFec: {"variable":"nfcc-fec", "displayName":"NFCC-FEC", "format": "number"},

    county_altpc: {"variable":"altpc", "displayName":"Alt. Financial Services Per 10,000 People", "format": "number_per_ten_thousand",  "scaleType": "quantize", "customDomain":[0, 0.000839], "customRange":[colors.white, colors.white, colors.red.dark], "numBins":3},
    county_tradpc: {"variable":"tradpc", "displayName":"Mainstream Financial Services Per 10,000 People", "format": "number_per_ten_thousand",  "scaleType": "quantize", "customDomain":[0, 0.003727], "customRange":[colors.white, colors.white, colors.turquoise.dark], "numBins":3},
    county_altpertrad: {"variable":"altpertrad", "displayName":"Ratio of Alt. Financial Services to Mainstream", "format": "number",  "scaleType": "quantize", "customDomain":[0, 3], "customRange":[colors.white, colors.white, colors.purple.dark], "numBins":3},
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
    {
        title: "New York",
        center: [-74.0059, 40.7128],
        zoom: 8
    },
    {
        title: "Los Angeles",
        center: [-118.2437, 34.0522],
        zoom: 8
    },
    {
        title: "Washington D.C.",
        center: [-77.0369, 38.9072],
        zoom: 8
    },
]

let vizSettingsList = [
    {
        id: "#financial-opportunity__census-tract-map", 
        vizType: "mapbox_map",
        mapboxStyleUrl: "mapbox://styles/newamericamapbox/civcm5ziy00d92imrwswlo1wv",
        source: {
            id:'census-tracts',
            sourceLayer: 'CensusTracts_2014data2K_2-3r3ays',
            url: 'mapbox://newamericamapbox.7zun44wf'
        },
        existingLayers: [variables.altcredit, variables.banks, variables.ncua, variables.usps],
        additionalLayers: [variables.medhhinc, variables.minority, variables.fampov, variables.medval],
        toggleOffLayers: [variables.ncua, variables.usps],
        filters: [
            {
                filterVars: [variables.altcredit, variables.banks, variables.ncua, variables.usps],
                toggleInsets: true,
                canToggleMultiple: true
            },
            {
                filterVars: [variables.medhhinc, variables.minority, variables.fampov, variables.medval],
                toggleInsets: false,
                canToggleMultiple: false
            },
        ],
        tooltipVars: {
            "Economic Metrics": [variables.medhhinc, variables.fampov, variables.medval],
            "Population Demographics": [variables.totpop, variables.minority, variables.aian, variables.asian, variables.black, variables.tworace, variables.white, variables.hispanic],
            "Financial Services": [variables.bank2014, variables.ncua2014, variables.checkcash, variables.moneyorder, variables.payday, variables.titleloan, variables.pawn, variables.tax]
        },
        insetMapSettings: insetMapSettings,
        popupContentFunction: censusTractMapSetPopupContent
    },
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
    {
        id: "#financial-opportunity__census-tract-map-other-services", 
        vizType: "mapbox_map",
        mapboxStyleUrl: "mapbox://styles/newamericamapbox/cixql9hl200762rp5qynmxcfe",
        source: {
            id:'census-tracts',
            sourceLayer: 'CensusTracts_2014data2K_2-3r3ays',
            url: 'mapbox://newamericamapbox.7zun44wf'
        },
        existingLayers: [variables.irsVita, variables.bankon, variables.cdfi, variables.ida, variables.nfccFec],
        additionalLayers: [variables.minority, variables.medhhinc, variables.fampov, variables.medval],
        // toggleOffLayers: [variables.ncua, variables.usps],
        filters: [
            {
                filterVars: [variables.irsVita, variables.bankon, variables.cdfi, variables.ida, variables.nfccFec],
                toggleInsets: true,
                canToggleMultiple: true
            },
            {
                filterVars: [variables.minority, variables.medhhinc, variables.fampov, variables.medval],
                toggleInsets: false,
                canToggleMultiple: false
            },
        ],
        tooltipVars: {
            "Economic Metrics": [variables.medhhinc, variables.fampov, variables.medval],
            "Population Demographics": [variables.totpop, variables.minority, variables.aian, variables.asian, variables.black, variables.tworace, variables.white, variables.hispanic],
        },
        insetMapSettings: false,
        popupContentFunction: censusTractMapSetPopupContent
    },
]

let projectSettings = {
    vizSettingsList: vizSettingsList
}

setupProject(projectSettings);

function censusTractMapSetPopupContent(feature) {
    console.log(this);
    let splitPieces = feature.properties.Geography.split(", ");

    console.log(feature.properties);

    let popupProperties = "";

    for (let key in this.tooltipVars) {
        console.log(key);
        popupProperties += "<div class='mapbox-map__popup__category-container'>" +
            "<h5 class='mapbox-map__popup__category-label'>" + key + "</h5>" +
            "<ul class='mapbox-map__popup__property-list'>";

        let values = this.tooltipVars[key];
        for (let i = 0; i < values.length; i++) {
            let currVar = values[i];
            popupProperties += "<li class='mapbox-map__popup__property'>" +
                        "<h5 class='mapbox-map__popup__property__label'>" + currVar.displayName + "</h5>" +
                        "<h5 class='mapbox-map__popup__property__value'>" + formatValue(feature.properties[currVar.variable], currVar.format)  + "</h5>" +
                    "</li>";
        }
        popupProperties += "</ul></div>";
    }

    return "<h5 class='mapbox-map__popup__subheading'>" + splitPieces[2] + "</h5>" +
    "<h3 class='mapbox-map__popup__heading'>" + splitPieces[1] + "</h3>" +
    "<h5 class='mapbox-map__popup__subheading'>" + splitPieces[0] + "</h5>" +
    "<div class='mapbox-map__popup__properties'>" + popupProperties + "</div>"
}

function countyMapSetPopupContent(feature) {
    console.log(this);
    let popupProperties = "";

    console.log(feature.properties);

    for (let i = 0; i < this.additionalLayers.length; i++) {
        let currVar = this.additionalLayers[i];
        popupProperties += "<li class='mapbox-map__popup__property'>" +
                    "<h5 class='mapbox-map__popup__property__label'>" + currVar.displayName + "</h5>" +
                    "<h5 class='mapbox-map__popup__property__value'>" + formatValue(feature.properties[currVar.variable], currVar.format)  + "</h5>" +
                "</li>";
    }

    return "<h3 class='mapbox-map__popup__heading'>" + feature.properties.NAMELSAD10 + "</h3>" +
    "<div class='mapbox-map__popup__properties'>" + 
    "<div class='mapbox-map__popup__category-container'>" + 
    "<ul class='mapbox-map__popup__property-list'>" + 
    popupProperties + 
    "</ul></div></div>";
}
