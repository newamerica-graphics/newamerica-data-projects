import { BarChart } from "./chart_types/bar_chart.js";
import { StackedBar } from "./chart_types/stacked_bar.js";
import { PercentageStackedBar } from "./chart_types/percentage_stacked_bar.js";
import { Dashboard } from "./layouts/dashboard.js";
import { DotMatrix } from "./chart_types/dot_matrix.js";
import { DotHistogram } from "./chart_types/dot_histogram.js";
import { GroupedDotMatrix } from "./chart_types/grouped_dot_matrix.js";
import { TopoJsonMap } from "./chart_types/topo_json_map.js";
import { TabbedChartLayout } from "./layouts/tabbed_chart_layout.js";
import { ChartWithFactBox } from "./layouts/chart_with_fact_box.js";
import { Table } from "./chart_types/table.js";
import { FactBox } from "./chart_types/fact_box.js";
import { LineChart } from "./chart_types/line_chart.js";
import { StepChart } from "./chart_types/step_chart.js";
import { MapboxMap } from "./chart_types/mapbox_map.js";
import { FinancialOpportunityMap } from "./chart_types/financial_opportunity_map.js";
import { SummaryBox } from "./chart_types/summary_box.js";
import { PieChart } from "./chart_types/pie_chart.js";
import { Bipartite } from "./chart_types/bipartite.js";
import { CategoryBreakdown } from "./chart_types/category_breakdown.js";
import { ComparativeDotHistogram } from "./chart_types/comparative_dot_histogram.js";
import { FilterableChart } from "./layouts/filterable_chart.js";
import { BarLineCombo } from "./chart_types/bar_line_combo.js";
import { PinDropMap } from "./chart_types/pindrop_map.js";
import { VerticalTimeline } from "./chart_types/vertical_timeline.js";
import { InteractiveSvg } from "./chart_types/interactive_svg.js";
import { DroneStrikesTargetsStackedBar } from "./chart_types/drone_strikes_targets_stacked_bar.js";

const $ = require("jquery")
const d3 = require("d3")
const json2csv = require('json2csv');
const JSZip = require("jszip");
import { formatValue } from './helper_functions/format_value.js'

export const whichChart = {
	"bar_chart": BarChart,
	"bar_line_combo": BarLineCombo,
	"bipartite": Bipartite,
	"category_breakdown": CategoryBreakdown,
	"chart_with_fact_box": ChartWithFactBox,
	"comparative_dot_histogram": ComparativeDotHistogram,
	"dashboard": Dashboard,
	"dot_matrix": DotMatrix,
	"dot_histogram": DotHistogram,
	"drone_strikes_targets_stacked_bar": DroneStrikesTargetsStackedBar,
	"fact_box": FactBox,
	"filterable_chart": FilterableChart,
	"financial_opportunity_map": FinancialOpportunityMap,
	"grouped_dot_matrix": GroupedDotMatrix,
	"interactive_svg": InteractiveSvg,
	"line_chart": LineChart,
	"mapbox_map": MapboxMap,
	"percentage_stacked_bar": PercentageStackedBar,
	"pie_chart": PieChart,
	"pindrop_map": PinDropMap,
	"stacked_bar": StackedBar,
	"step_chart": StepChart,
	"summary_box": SummaryBox,
	"tabbed_chart_layout": TabbedChartLayout,
	"table": Table,
	"topo_json_map": TopoJsonMap,
	"vertical_timeline": VerticalTimeline,
}

export const defaultClickToProfile = (profileName) => {
	console.log(window.location)
	let currPath = window.location.pathname,
		splitPieces = currPath.splitPieces

	window.location.pathname = "/" + splitPieces[1] + "/" + splitPieces[2] + "/profile/?" + encodeURI(profileName);
}

export const setCSVZipLink = (dataJson) => {
	var zip = new JSZip();

	for (let sheetName of Object.keys(dataJson)) {
		if(!dataJson[sheetName]) continue;
		let fields = Object.keys(dataJson[sheetName][0]);

		let csvString = json2csv({ data: dataJson[sheetName], fields: fields });

		zip.file(sheetName + ".csv", csvString);
	}

	zip.generateAsync({type:"base64"}).then(function (base64) {
	    $("#in-depth__download__csv").attr("href", "data:application/zip;base64," + base64);
	});
}

export const setJSONZipLink = (dataJson) => {
	var jsonDataUrlString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataJson));
	$("#in-depth__download__json").attr("href", jsonDataUrlString);
}



export const setProfileValues = (data) => {
	let $inDepthProfile = $(".in-depth__profile");
	let dataSheet = $inDepthProfile.attr("data-sheet-name");
	let lookupField = $inDepthProfile.attr("data-lookup-field");
	let lookupValue = decodeURI(window.location.search).replace("?", "");

	if (!lookupField) {
		return;
	}

	let allLookupValues = d3.nest()
		.key((d) => { return d[lookupField].toLowerCase(); })
		.map(data[dataSheet]);

	let currElement = allLookupValues.get(lookupValue);
	currElement = currElement ? currElement[0] : null;

	if (currElement) {
		setOtherValueSelectorOptions(allLookupValues.keys(), true);
	} else {
		setOtherValueSelectorOptions(allLookupValues.keys(), false);
		$(".in-depth__profile__body").empty();
		$(".in-depth__profile__title-block").hide();
		return;
	}

	let valueDiv, footnoteLabelDiv, displayField, fieldFormat, footnoteField;

	$(".in-depth__profile__title-block__title").text(currElement[lookupField])

	$(".block-data_reference").each(function(i, container) {
		let footnoteCount = 1;
		let footnoteContainer = $(container).children(".data-reference__footnote-container");

		$(container).find(".data-reference__row").each(function(j, dataRow) {
			valueDiv = $(dataRow).children(".data-reference__value");
			footnoteLabelDiv = $(dataRow).find(".data-reference__footnote__label");

			displayField = $(valueDiv).attr("data-field-name");
			fieldFormat = $(valueDiv).attr("data-field-format");
			footnoteField = $(footnoteLabelDiv).attr("data-footnote-field-name");

			let value = formatValue(currElement[displayField], fieldFormat);

			if (value && value.length > 0) {
				if (fieldFormat == "markdown") {
					$(valueDiv).html(value);
				} else {
					$(valueDiv).text(value);
				}
				if (footnoteField && currElement[footnoteField] && currElement[footnoteField] != null) {

					$(footnoteLabelDiv).text(footnoteCount);
					$(footnoteContainer).append("<li class='data-reference__footnote'>" + footnoteCount + ". " + currElement[footnoteField] + "</li>");
					footnoteCount++;
				}
			} else {
				$(dataRow).hide();
			}
		})
	})

	$(".video-data-reference").each(function(i, item) {
		displayField = $(item).attr("data-field-name");
		let hostSite = $(item).attr("data-host");

		let value = currElement[displayField];

		if (value && value.length > 0) {
			if (hostSite == "vimeo") {
				$(item).append('<iframe width="640" height="360" frameborder="0" src="https://player.vimeo.com/video/' + value + '"></iframe>');
			} else {
				$(item).append('<iframe width="640" height="360" frameborder="0" src="https://www.youtube.com/embed/' + value + '"></iframe>');				}
		} else {
			$(item).hide();
		}
	})
}

const setOtherValueSelectorOptions = (otherValuesList, pageHasValue) => {
	let $valueSelector = $(".in-depth__profile__other-value-selector");
	for (let item of otherValuesList) {
		let option = $('<option/>')
	        .addClass('in-depth__profile__other-value-selector__option')
	        .text(item)
	        .attr("value", encodeURI(item))
	        .appendTo($valueSelector);
	}
}
