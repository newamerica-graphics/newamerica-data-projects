import $ from 'jquery';

let d3 = require("d3");

import { DotMatrix } from "../chart_types/dot_matrix.js";
import { DotHistogram } from "../chart_types/dot_histogram.js";
import { GroupedDotMatrix } from "../chart_types/grouped_dot_matrix.js";
import { TopoJsonMap } from "../chart_types/topo_json_map.js";
import { Table } from "../chart_types/table.js";
import { FactBox } from "../chart_types/fact_box.js";
import { LineChart } from "../chart_types/line_chart.js";

export class ChartWithFactBox {
	constructor(vizSettings, imageFolderId) {
		let { id, primaryDataSheet, chartSettings, factBoxSettings } = vizSettings;
		this.id = id;
		factBoxSettings.id = id;
		factBoxSettings.factBoxType = "simple";
		factBoxSettings.primaryDataSheet = primaryDataSheet;

		this.factBox = new FactBox(factBoxSettings);

		chartSettings.id = id;

		chartSettings.primaryDataSheet = primaryDataSheet;

		switch (chartSettings.vizType) {
			case "dot_matrix":
				this.chart = new DotMatrix(chartSettings, imageFolderId);
				break;

			case "dot_histogram":
				this.chart = new DotHistogram(chartSettings, imageFolderId);
				break;

			case "grouped_dot_matrix":
				this.chart = new GroupedDotMatrix(chartSettings, imageFolderId);
				break;

			case "line_chart":
				this.chart = new LineChart(chartSettings);
				break;

			case "table":
				this.chart = new Table(chartSettings);
				break;

			case "topo_json_map":
				this.chart = new TopoJsonMap(chartSettings);
				break;
		}
	}

	render(data) {
		this.factBox.render(data);
		this.chart.render(data);
	}

	resize() {
		this.chart.resize ? this.chart.resize() : null;
	}
}