const { colors } = require("../../helper_functions/colors.js");
const d3 = require("d3");
const { combineSources } = require("../../helper_functions/combine_sources.js");

let variables = {
  category: {
    variable: "category",
    displayName: "Category",
    format: "string",
    scaleType: "categorical",
    customDomain: [
      "Anti-Sharia Legislation",
      "Opposition to Refugee Resettlement",
      "Opposition to Mosques, Muslim Cemeteries & Schools",
      "Anti-Muslim Actions & Statements by Elected & Appointed Officials",
      "Hate Incidents Against Mosques & Islamic Centers",
      "Media Reports of Anti-Muslim Violence & Crimes"
    ],
    customRange: [
      colors.brown.light,
      colors.purple.light,
      colors.orange.light,
      colors.red.light,
      "#6e7f29",
      colors.blue.light
    ]
  },
  state: { variable: "state", displayName: "State", format: "string" },
  title: { variable: "title", displayName: "Title", format: "string" },
  description: {
    variable: "description",
    displayName: "Description",
    format: "string"
  },
  date: { variable: "date", displayName: "Date", format: "date" },
  year_month: { variable: "year_month", displayName: "Date", format: "string" },
  processed_date: {
    variable: "processed_date",
    displayName: "Date",
    format: "date_simple"
  },
  sources_combined: {
    variable: "sources_combined",
    displayName: "Sources",
    format: "link"
  },

  state_id: { variable: "state_id", displayName: "State id", format: "string" },
  population_total: {
    variable: "population_total",
    displayName: "Total Population",
    format: "number"
  },
  population_muslim: {
    variable: "population_muslim",
    displayName: "Estimated Muslim Population",
    format: "number"
  },

  incidents_total: {
    variable: "incidents_total",
    displayName: "All Incidents",
    category: "Total Incident Counts",
    format: "number",
    filterVal: null,
    scaleType: "quantize",
    numBins: 4,
    customRange: [colors.white, colors.turquoise.light, colors.turquoise.dark]
  },
  incidents_anti_sharia: {
    variable: "incidents_anti_sharia",
    displayName: "Anti-Sharia Legislation",
    category: "Total Incident Counts",
    format: "number",
    filterVal: "Anti-Sharia Legislation",
    scaleType: "quantize",
    numBins: 3,
    customRange: [colors.white, colors.orange.light, colors.orange.dark]
  },
  incidents_anti_refugee: {
    variable: "incidents_anti_refugee",
    displayName: "Opposition to Refugee Resettlement",
    category: "Total Incident Counts",
    format: "number",
    filterVal: "Opposition to Refugee Resettlement",
    scaleType: "quantize",
    numBins: 3,
    customRange: [colors.white, colors.purple.light, colors.purple.dark]
  },
  incidents_anti_construction: {
    variable: "incidents_anti_construction",
    displayName: "Opposition to Mosques, Muslim Cemeteries & Schools",
    category: "Total Incident Counts",
    format: "number",
    filterVal: "Opposition to Mosques, Muslim Cemeteries & Schools",
    scaleType: "quantize",
    numBins: 2,
    customRange: [colors.white, colors.brown.light, colors.brown.dark]
  },
  incidents_elected_official: {
    variable: "incidents_elected_official",
    displayName:
      "Anti-Muslim Actions & Statements by Elected & Appointed Officials",
    category: "Total Incident Counts",
    format: "number",
    filterVal:
      "Anti-Muslim Actions & Statements by Elected & Appointed Officials",
    scaleType: "quantize",
    numBins: 3,
    customRange: [colors.white, colors.red.light, colors.red.dark]
  },
  incidents_hate: {
    variable: "incidents_hate",
    displayName: "Media Reports of Anti-Muslim Violence & Crimes",
    category: "Total Incident Counts",
    format: "number",
    filterVal: "Media Reports of Anti-Muslim Violence & Crimes",
    scaleType: "quantize",
    numBins: 5,
    customRange: [colors.white, colors.blue.light, colors.blue.dark]
  },
  incidents_hate_mosques: {
    variable: "incidents_hate_mosques",
    displayName: "Hate Incidents Against Mosques & Islamic Centers",
    category: "Total Incident Counts",
    format: "number",
    filterVal: "Hate Incidents Against Mosques & Islamic Centers",
    scaleType: "quantize",
    numBins: 5,
    customRange: [colors.white, "#6e7f29", "#2c3e00"]
  },
  per_capita_total: {
    variable: "per_capita_total",
    displayName: "All Incidents",
    altLegendTitle: "All Incidents (Per 1 Million People)",
    category: "Per Capita",
    format: "number_with_decimal_2",
    filterVal: null,
    scaleType: "quantize",
    numBins: 5,
    customRange: [colors.white, colors.turquoise.light, colors.turquoise.dark]
  },
  per_capita_anti_sharia: {
    variable: "per_capita_anti_sharia",
    displayName: "Anti-Sharia Legislation",
    altLegendTitle: "Anti-Sharia Legislation (Per 1 Million People)",
    category: "Per Capita",
    format: "number_with_decimal_2",
    filterVal: "Anti-Sharia Legislation",
    scaleType: "quantize",
    numBins: 5,
    customRange: [colors.white, colors.orange.light, colors.orange.dark]
  },
  per_capita_anti_refugee: {
    variable: "per_capita_anti_refugee",
    displayName: "Opposition to Refugee Resettlement",
    altLegendTitle: "Opposition to Refugee Resettlement (Per 1 Million People)",
    category: "Per Capita",
    format: "number_with_decimal_2",
    filterVal: "Opposition to Refugee Resettlement",
    scaleType: "quantize",
    numBins: 5,
    customRange: [colors.white, colors.purple.light, colors.purple.dark]
  },
  per_capita_anti_construction: {
    variable: "per_capita_anti_construction",
    displayName: "Opposition to Mosques, Muslim Cemeteries & Schools",
    altLegendTitle:
      "Opposition to Mosques, Muslim Cemeteries & Schools (Per 1 Million People)",
    category: "Per Capita",
    format: "number_with_decimal_2",
    filterVal: "Opposition to Mosques, Muslim Cemeteries & Schools",
    scaleType: "quantize",
    numBins: 5,
    customRange: [colors.white, colors.brown.light, colors.brown.dark]
  },
  per_capita_elected_official: {
    variable: "per_capita_elected_official",
    displayName:
      "Anti-Muslim Actions & Statements by Elected & Appointed Officials",
    altLegendTitle:
      "Anti-Muslim Actions & Statements by Elected & Appointed Officials (Per 1 Million People)",
    category: "Per Capita",
    format: "number_with_decimal_2",
    filterVal:
      "Anti-Muslim Actions & Statements by Elected & Appointed Officials",
    scaleType: "quantize",
    numBins: 5,
    customRange: [colors.white, colors.red.light, colors.red.dark]
  },
  per_capita_hate: {
    variable: "per_capita_hate",
    displayName: "Media Reports of Anti-Muslim Violence & Crimes",
    altLegendTitle:
      "Media Reports of Anti-Muslim Violence & Crimes (Per 1 Million People)",
    category: "Per Capita",
    format: "number_with_decimal_2",
    filterVal: "Media Reports of Anti-Muslim Violence & Crimes",
    scaleType: "quantize",
    numBins: 5,
    customRange: [colors.white, colors.blue.light, colors.blue.dark]
  },
  per_capita_muslim_total: {
    variable: "per_capita_muslim_total",
    displayName: "All Incidents",
    format: "number_with_decimal_2",
    filterVal: null,
    scaleType: "quantize",
    numBins: 5,
    customRange: [colors.white, colors.turquoise.light, colors.turquoise.dark]
  },
  per_capita_muslim_anti_sharia: {
    variable: "per_capita_muslim_anti_sharia",
    displayName: "Anti-Sharia Legislation",
    format: "number_with_decimal_2",
    filterVal: "Anti-Sharia Legislation",
    scaleType: "quantize",
    numBins: 5,
    customRange: [colors.white, colors.orange.light, colors.orange.dark]
  },
  per_capita_muslim_anti_refugee: {
    variable: "per_capita_muslim_anti_refugee",
    displayName: "Opposition to Refugee Resettlement",
    format: "number_with_decimal_2",
    filterVal: "Opposition to Refugee Resettlement",
    scaleType: "quantize",
    numBins: 5,
    customRange: [colors.white, colors.purple.light, colors.purple.dark]
  },
  per_capita_muslim_anti_construction: {
    variable: "per_capita_muslim_anti_construction",
    displayName: "Opposition to Mosques, Muslim Cemeteries & Schools",
    format: "number_with_decimal_2",
    filterVal: "Opposition to Mosques, Muslim Cemeteries & Schools",
    scaleType: "quantize",
    numBins: 5,
    customRange: [colors.white, colors.brown.light, colors.brown.dark]
  },
  per_capita_muslim_elected_official: {
    variable: "per_capita_muslim_elected_official",
    displayName:
      "Anti-Muslim Actions & Statements by Elected & Appointed Officials",
    format: "number_with_decimal_2",
    filterVal:
      "Anti-Muslim Actions & Statements by Elected & Appointed Officials",
    scaleType: "quantize",
    numBins: 5,
    customRange: [colors.white, colors.red.light, colors.red.dark]
  },
  per_capita_muslim_hate: {
    variable: "per_capita_muslim_hate",
    displayName: "Media Reports of Anti-Muslim Violence & Crimes",
    format: "number_with_decimal_2",
    filterVal: "Media Reports of Anti-Muslim Violence & Crimes",
    scaleType: "quantize",
    numBins: 5,
    customRange: [colors.white, colors.blue.light, colors.blue.dark]
  }
};

let vizSettings = {
  "muslim-community-restrictions__states-map": {
    vizType: "dashboard",
    layoutRows: [
      [
        {
          vizType: "topo_json_map",
          primaryDataSheet: "states",
          width: "70%",
          filterVars: [
            variables.incidents_total,
            variables.incidents_anti_sharia,
            variables.incidents_anti_refugee,
            variables.incidents_anti_construction,
            variables.incidents_elected_official,
            variables.incidents_hate_mosques,
            variables.incidents_hate,
            variables.per_capita_total,
            variables.per_capita_anti_sharia,
            variables.per_capita_anti_refugee,
            variables.per_capita_anti_construction,
            variables.per_capita_elected_official,
            variables.per_capita_hate
          ],
          geometryType: "states",
          geometryVar: variables.state_id,
          stroke: {
            color: colors.white,
            width: "1",
            opacity: "1",
            hoverColor: colors.white,
            hoverWidth: "3"
          },
          filterGroupSettings: {
            hidden: false,
            keepVarIndexSameWhenCatChanged: true
          },
          // tooltipVars: [ variables.state, variables.incidents_total, variables.incidents_anti_sharia, variables.incidents_anti_refugee, variables.incidents_anti_construction, variables.incidents_elected_official],
          legendSettings: { orientation: "horizontal-center", showTitle: true },
          addSmallStateInsets: true,
          isMessagePasser: true,
          interaction: "click",
          defaultFill: colors.grey.light,
          mouseoverOnlyIfValue: true,
          sameFilterIndexWhenCategoryChanged: true
        },
        {
          vizType: "content_stream",
          primaryDataSheet: "incidents",
          clickable: false,
          defaultFilter: variables.incidents_total,
          noValueText: "No incidents of this type recorded for this state",
          width: "30%",
          isMessagePasser: false,
          messageHandlerType: "change_value",
          idVar: variables.state,
          showCurrFilterVal: true,
          filterVar: variables.category,
          additionalDataVars: [
            variables.population_total,
            variables.population_muslim
          ],
          dateVar: variables.processed_date,
          hasColorOutline: true
        }
      ]
    ]
  },
  "muslim-community-restrictions__states-table": {
    vizType: "table",
    primaryDataSheet: "states",
    tableVars: [
      variables.state,
      variables.incidents_total,
      variables.incidents_anti_sharia,
      variables.incidents_anti_refugee,
      variables.incidents_anti_construction,
      variables.incidents_elected_official,
      variables.incidents_hate_mosques,
      variables.incidents_hate
    ],
    defaultOrdering: [1, "desc"],
    pagination: false,
    colorScaling: false,
    filterInitialDataFunction: d => d.state != "United States"
  },
  "muslim-community-restrictions__dot-chart": {
    isReact: true,
    vizType: "dot_chart",
    primaryDataSheet: "incidents",
    colorSettings: { colorVar: variables.category, showLegend: true },
    tooltipTitleVar: variables.title,
    tooltipVars: [
      variables.state,
      variables.category,
      variables.processed_date,
      variables.description
    ],
    dotScaleRange: [1, 3],
    interaction: "mouseover",
    layouts: [
      {
        label: "Incidents Over Time",
        layout: "histogram_fixed_interval",
        xVar: variables.year_month,
        sortingVar: variables.date,
        isYearMonth: true,
        annotationSheet: "key_events"
      },
      {
        label: "Incidents by State",
        layout: "category",
        categoryVar: variables.state,
        sortCategoryValsFunction: (a, b) => {
          return new Date(a.date) - new Date(b.date);
        },
        leftMargin: 120,
        verticalPadding: 5
      }
    ]
  }
};

const preProcessData = data => {
  const fullDateFormat = d3.timeFormat("%B %-d, %Y"),
    monthYearFormat = d3.timeFormat("%B %Y"),
    yearMonthFormat = d3.timeFormat("%Y%m");

  data.incidents.map(d => {
    let date = new Date(d.date);
    d.processed_date =
      d.show_day === "TRUE" ? fullDateFormat(date) : monthYearFormat(date);
    d.year_month = yearMonthFormat(date);
    d.sources_combined = combineSources([
      d.source1_url,
      d.source1_display_name,
      d.source2_url,
      d.source2_display_name,
      d.source3_url,
      d.source3_display_name,
      d.source4_url,
      d.source4_display_name
    ]);

    return d;
  });

  return data;
};

module.exports = {
  vizSettings: vizSettings,
  dataUrl:
    "https://na-data-projects.s3.amazonaws.com/data/muslimdiaspora/muslim_community_restrictions.json",
  preProcessData: preProcessData,
  downloadableSheets: ["incidents", "states"]
};
