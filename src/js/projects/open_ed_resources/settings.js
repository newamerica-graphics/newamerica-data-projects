let { colors } = require("../../helper_functions/colors.js");

let variables = {
  state: { variable: "state", displayName: "State", format: "string" },
  district: { variable: "district", displayName: "District", format: "string" },
  grade_level_band: {
    variable: "grade_level_band",
    displayName: "Grade Level",
    format: "string"
  },
  grade_level: {
    variable: "grade_level",
    displayName: "Grade Level",
    format: "string"
  },
  content_area: {
    variable: "content_area",
    displayName: "Content Area",
    format: "string"
  },
  // placeholder_val: {"variable":"placeholder_val", "displayName":"Placeholder", "format": "string", "scaleType": "categorical", "customDomain": [ "1", "2" ], "customRange": [ colors.turquoise.light, colors.turquoise.dark ]},
  placeholder_val: {
    variable: "placeholder_val",
    displayName: "Article",
    format: "string",
    category: "Article",
    canSplitCategory: true,
    scaleType: "categorical",
    customDomain: ["No Article Written", "Article Available"],
    customRange: [colors.turquoise.light, colors.turquoise.dark]
  },
  is_go: { variable: "is_go", displayName: "District Type", format: "string" },
  dist_enroll: {
    variable: "dist_enroll",
    displayName: "District Enrollment",
    format: "integer"
  },
  comm_type: {
    variable: "comm_type",
    displayName: "Community Type",
    format: "string"
  },
  has_link: { variable: "has_link", displayName: "Article", format: "string" },

  site: { variable: "site", displayName: "Site", format: "string" },
  site_richtext: {
    variable: "site_richtext",
    displayName: "Site",
    format: "markdown"
  },
  description: {
    variable: "description",
    displayName: "Description",
    format: "string",
    disableTableOrdering: true
  },
  resource_type: {
    variable: "resource_type",
    displayName: "Resource Type",
    format: "string"
  },
  notes: {
    variable: "notes",
    displayName: "Notes",
    format: "string",
    disableTableOrdering: true
  },
  title: { variable: "title", displayName: "Title", format: "string" },
  title_richtext: {
    variable: "title_richtext",
    displayName: "Title",
    format: "markdown"
  },
  tags: { variable: "tags", displayName: "Tags", format: "string" },
  license: { variable: "license", displayName: "License", format: "string" }
};

let vizSettings = {
  "open-ed-resources__districts": {
    vizType: "pindrop_map_oer",
    primaryDataSheet: "districts",
    geometryType: "states",
    stroke: {
      color: colors.white,
      width: "1",
      opacity: "1",
      hoverColor: colors.white,
      hoverWidth: "1",
      hoverOpacity: ".6"
    },
    pinRadius: 4.5,
    filterVars: [variables.placeholder_val],
    tooltipVars: [
      variables.district,
      variables.state,
      variables.grade_level_band,
      variables.content_area,
      variables.dist_enroll,
      variables.is_go,
      variables.comm_type,
      variables.has_link
    ],
    filterGroupSettings: { hidden: false },
    legendSettings: { orientation: "vertical-right", showTitle: false },
    applyForce: true
  },
  "open-ed-resources__oer-resources": {
    primaryDataSheet: "oer",
    vizType: "table",
    tableVars: [
      variables.site_richtext,
      variables.description,
      variables.grade_level,
      variables.content_area,
      variables.resource_type,
      variables.notes
    ],
    defaultOrdering: [0, "asc"],
    pagination: false
    // numPerPage: 20,
    // freezeColumn: {leftColumns: 1},
  },
  "open-ed-resources__professional-learning-resources": {
    primaryDataSheet: "professional_learning_resources",
    vizType: "table",
    tableVars: [
      variables.site,
      variables.title_richtext,
      variables.description,
      variables.tags,
      variables.license
    ],
    defaultOrdering: [1, "asc"],
    pagination: false
    // numPerPage: 20,
    // freezeColumn: {leftColumns: 1},
  }
};

module.exports = {
  vizSettings: vizSettings,
  dataUrl:
    "https://na-data-projects.s3.amazonaws.com/data/edpolicy/open-ed-resources.json",
  downloadableSheets: ["districts", "oer", "professional_learning_resources"]
};
