import $ from 'jquery';

let { colors } = require("../../helper_functions/colors.js")
import { formatValue } from "../../helper_functions/format_value.js";

let variables = {
    medhhinc: {"variable":"MEDHHINC", "displayName":"Median Household Income", "format": "price",  "scaleType": "quantize", "customDomain":[0, 37500, 75000, 112500, 150000], "customRange":["rgb(247, 247, 247)","rgb(238, 238, 239)","rgb(196, 197, 199)","rgb(120, 122, 126)","rgb(44, 47, 53)"], "numBins":5},
    minority: {"variable":"MINORITY", "displayName":"Minority (%)", "format": "percent_no_multiply", "scaleType": "quantize", "customDomain":[0, 15, 30, 45, 60], "customRange":["rgb(247, 247, 247)","rgb(238, 238, 239)","rgb(196, 197, 199)","rgb(120, 122, 126)","rgb(44, 47, 53)"], "numBins":5},
    fampov: {"variable":"FAMPOV", "displayName":"Families Below Poverty Line (%)", "format": "percent_no_multiply", "scaleType": "quantize", "customDomain":[0, 10, 20, 30, 40], "customRange":["rgb(247, 247, 247)","rgb(238, 238, 239)","rgb(196, 197, 199)","rgb(120, 122, 126)","rgb(44, 47, 53)"], "numBins":5},
    medval: {"variable":"MEDVAL", "displayName":"Median Value of Owner-Occupied Units", "format": "price", "scaleType": "quantize", "customDomain":[0, 150000, 300000, 450000, 600000], "customRange":["rgb(247, 247, 247)","rgb(238, 238, 239)","rgb(196, 197, 199)","rgb(120, 122, 126)","rgb(44, 47, 53)"], "numBins":5},
    banks: {"variable":"banks", "displayName":"Banks", "format": "number", "color":"#2dc6bf"},
    altcredit: {"variable":"altcredit", "displayName":"Alternative Services", "format": "number", "color":"#f24b56"},
    ncua: {"variable":"ncua", "displayName":"Credit Unions", "format": "number", "color":"#9773c7"},
    usps: {"variable":"usps", "displayName":"Post Offices", "format": "number", "color":"#fdcb6d"},
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
    irsVita: {"variable":"irs-vita", "displayName":"IRS-VITA", "format": "number", "color":"#f2e079"},
    bankon: {"variable":"bankon", "displayName":"Bank On City", "format": "number", "color":"#fca849"},
    cdfi: {"variable":"cdfi", "displayName":"CDFI", "format": "number", "color":"#9F76AC"},
    ida: {"variable":"ida", "displayName":"IDA", "format": "number", "color":"#6B91D3"},
    nfccFec: {"variable":"nfcc-fec", "displayName":"NFCC-FEC", "format": "number", "color":"#2dc6bf"},

    county_altpc: {"variable":"altpc", "displayName":"Alt. Financial Services Per 10,000 People", "format": "number_per_ten_thousand", "customDomain": [0, 0.000025, 0.000075, 0.000125, 0.0003], "customRange":["rgb(154, 186, 167)","rgb(189, 201, 149)","rgb(224, 216, 130)","rgb(242, 194, 114)","rgb(242, 135, 100)"], "customLabels":["Very Low", "Low", "Average", "High", "Very High"], "numBins":5},
    county_tradpc: {"variable":"tradpc", "displayName":"Mainstream Financial Services Per 10,000 People", "format": "number_per_ten_thousand", "customDomain": [0, 0.0002, 0.0004, 0.0006, 0.001], "customRange":["rgb(242, 135, 100)","rgb(242, 194, 114)","rgb(224, 216, 130)","rgb(189, 201, 149)","rgb(154, 186, 167)"], "customLabels":["Very Low", "Low", "Average", "High", "Very High"], "numBins":5},
    county_altpertrad: {"variable":"altpertrad", "displayName":"Ratio of Alt. Financial Services to Mainstream", "format": "number_with_decimal_2", "customDomain": [0, 0.1, 0.23, 0.5, 1], "customRange":["rgb(154, 186, 167)","rgb(189, 201, 149)","rgb(224, 216, 130)","rgb(242, 194, 114)","rgb(242, 135, 100)"], "customLabels":["Very Low", "Low", "Average", "High", "Very High"], "numBins":5},
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

let vizSettings = {
    "financial-opportunity__census-tract-map": {
        vizType: "financial_opportunity_map",
        mapboxStyleUrl: "mapbox://styles/newamericamapbox/civcm5ziy00d92imrwswlo1wv",
        source: {
            id:'census-tracts',
            sourceLayer: 'CensusTracts_2014data2K_2-3r3ays',
            url: 'mapbox://newamericamapbox.7zun44wf'
        },
        existingLayers: [variables.altcredit, variables.banks, variables.ncua, variables.usps],
        additionalLayers: [variables.minority, variables.fampov, variables.medhhinc, variables.medval],
        toggleOffLayers: [variables.ncua, variables.usps],
        filters: [
            {
                filterVars: [variables.altcredit, variables.banks, variables.ncua, variables.usps],
                toggleInsets: true,
                canToggleMultiple: true
            },
            {
                filterVars: [variables.minority, variables.fampov, variables.medhhinc, variables.medval],
                toggleInsets: false,
                canToggleMultiple: false,
                label: true
            },
        ],
        tooltipVars: {
            "Economic Metrics": [variables.medhhinc, variables.fampov, variables.medval],
            "Population Demographics": [variables.totpop, variables.minority, variables.aian, variables.asian, variables.black, variables.white, variables.tworace, variables.hispanic],
        },
        insetMapSettings: insetMapSettings,
        popupContentFunction: censusTractMapSetPopupContent,
        popupColumns: 3
    },
    "financial-opportunity__county-map": {
        vizType: "financial_opportunity_map",
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
        popupContentFunction: countyMapSetPopupContent,
        popupColumns: 1
    },
    "financial-opportunity__census-tract-map-other-services": {
        vizType: "financial_opportunity_map",
        mapboxStyleUrl: "mapbox://styles/newamericamapbox/cixql9hl200762rp5qynmxcfe",
        source: {
            id:'census-tracts',
            sourceLayer: 'CensusTracts_2014data2K_2-3r3ays',
            url: 'mapbox://newamericamapbox.7zun44wf'
        },
        existingLayers: [variables.irsVita, variables.bankon, variables.cdfi, variables.ida, variables.nfccFec],
        additionalLayers: [variables.minority, variables.fampov, variables.medhhinc, variables.medval],
        // toggleOffLayers: [variables.ncua, variables.usps],
        filters: [
            {
                filterVars: [variables.irsVita, variables.bankon, variables.cdfi, variables.ida, variables.nfccFec],
                toggleInsets: false,
                canToggleMultiple: true
            },
            {
                filterVars: [variables.minority, variables.fampov, variables.medhhinc, variables.medval],
                toggleInsets: false,
                canToggleMultiple: false,
                label: true
            },
        ],
        tooltipVars: {
            "Economic Metrics": [variables.medhhinc, variables.fampov, variables.medval],
            "Population Demographics": [variables.totpop, variables.minority, variables.aian, variables.asian, variables.black, variables.tworace, variables.white, variables.hispanic],
        },
        insetMapSettings: false,
        popupContentFunction: censusTractOtherServicesMapSetPopupContent,
        popupColumns: 3
    },
}

module.exports = {
    vizSettings: vizSettings,
    dataUrl: "https://na-data-projects.s3.amazonaws.com/data/bll/care_index.json"
}

function censusTractMapSetPopupContent(feature) {
    console.log(this);
    let splitPieces = feature.properties.Geography.split(", ");

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

    let tradTotal = 0,
        altTotal = 0;

    tradTotal += feature.properties[variables.bank2014.variable]
        + feature.properties[variables.ncua2014.variable];

    altTotal += feature.properties[variables.checkcash.variable]
        + feature.properties[variables.moneyorder.variable]
        + feature.properties[variables.payday.variable]
        + feature.properties[variables.titleloan.variable]
        + feature.properties[variables.pawn.variable]
        + feature.properties[variables.tax.variable];

    popupProperties += "<div class='mapbox-map__popup__category-container'>" +
            "<h5 class='mapbox-map__popup__category-label'>Financial Services</h5>" +
            "<ul class='mapbox-map__popup__property-list'>";

    popupProperties += "<li class='mapbox-map__popup__property'>" +
            "<h5 class='mapbox-map__popup__property__label'>Traditional Financial Services</h5>" +
            "<h5 class='mapbox-map__popup__property__value'>" + formatValue(tradTotal, "number")  + "</h5>" +
        "</li>";

    popupProperties += "<li class='mapbox-map__popup__property'>" +
            "<h5 class='mapbox-map__popup__property__label'>Alternative Financial Services</h5>" +
            "<h5 class='mapbox-map__popup__property__value'>" + formatValue(altTotal, "number")  + "</h5>" +
        "</li>";
        
        popupProperties += "</ul></div>";


    return "<h5 class='mapbox-map__popup__subheading'>" + splitPieces[2] + "</h5>" +
    "<h3 class='mapbox-map__popup__heading'>" + splitPieces[1] + "</h3>" +
    "<h5 class='mapbox-map__popup__subheading'>" + splitPieces[0] + "</h5>" +
    "<div class='mapbox-map__popup__properties'>" + popupProperties + "</div>"
}

function censusTractOtherServicesMapSetPopupContent(feature) {
    let splitPieces = feature.properties.Geography.split(", ");

    let popupProperties = "";

    for (let key in this.tooltipVars) {
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
    let popupProperties = "";

    for (let i = 0; i < this.additionalLayers.length; i++) {
        let currVar = this.additionalLayers[i];
        popupProperties += "<li class='mapbox-map__popup__property'>" +
                    "<h5 class='mapbox-map__popup__property__label'>" + currVar.displayName + "</h5>" +
                    "<h5 class='mapbox-map__popup__property__value'>" + formatValue(feature.properties[currVar.variable], currVar.format)  + "</h5>" +
                "</li>";
    }

    return "<h3 class='mapbox-map__popup__heading'>" + feature.properties.NAMELSAD10 + "</h3>" +
    "<div class='mapbox-map__popup__properties 1-column'>" + 
    "<div class='mapbox-map__popup__category-container'>" + 
    "<ul class='mapbox-map__popup__property-list'>" + 
    popupProperties + 
    "</ul></div></div>";
}
