import $ from 'jquery';

let d3 = require("d3");

import { DotHistogram } from "../chart_types/dot_histogram.js";
import { TopoJsonMap } from "../chart_types/topo_json_map.js";
import { PinDropMap } from "../chart_types/pindrop_map.js";
import { MapboxMap } from "../chart_types/mapbox_map.js";
import { SelectBox } from "../components/select_box.js";
import { TextBox } from "../components/text_box.js";
import { Slider } from "../components/slider.js";
import { ContentStream } from "../components/content_stream.js";

export class Dashboard {
	constructor(vizSettings) {
		let { id, layoutRows, defaultValue, getDefaultValueFunction } = vizSettings;
		this.id = id;
		this.defaultValue = defaultValue;
		this.getDefaultValueFunction = getDefaultValueFunction;

		this.componentList = [];
		let i = 0;

		for (let layoutRow of layoutRows) {
			let currRow = d3.select(this.id).append("div")
				.attr("class", "dashboard__row");

			for (let componentSettings of layoutRow) {
				currRow.append("div")
					.attr("id", "viz" + i)
					.style("width", componentSettings.width ? componentSettings.width : "auto")
					.classed("dashboard__floated", layoutRow.length != 1 ? true : false);

				componentSettings.id = "#viz" + i;

				this.componentList.push(this.initializeComponent(componentSettings));
				i++;
			}
		}

	}

	initializeComponent(componentSettings) {
		if (componentSettings.isMessagePasser) {
			componentSettings.dashboardChangeFunc = this.changeFilter.bind(this);
		}
			
		let component;
		switch (componentSettings.vizType) {
			case "content_stream":
				component = new ContentStream(componentSettings);
				break;
			case "dot_histogram":
				component = new DotHistogram(componentSettings);
				break;
			case "mapbox_map":
				component = new MapboxMap(componentSettings);
				break;
			case "pindrop_map":
				component = new PinDropMap(componentSettings);
				break;
			case "select_box":
				component = new SelectBox(componentSettings);
				break;
			case "slider":
				if (componentSettings.isMessagePasser) {
					componentSettings.filterChangeFunction = this.changeFilter.bind(this);
				}
				component = new Slider(componentSettings);
				break;
			case "text_box":
				component = new TextBox(componentSettings);
				break;
			case "topo_json_map":
				component = new TopoJsonMap(componentSettings);
				break;
		}
		
		component.messageHandlerType = componentSettings.messageHandlerType;
		return component;
	}

	render(data) {
		if (this.getDefaultValueFunction) {
			this.defaultValue = this.getDefaultValueFunction(data);
		}
		for (let component of this.componentList) {
			component.render(data);
		}
		if (this.defaultValue) {
			this.changeFilter(this.defaultValue, this);
		}

		for (let component of this.componentList) {
			component.addAnimationTrigger ? component.addAnimationTrigger() : null;
		}
	}

	resize() {
		for (let component of this.componentList) {
			component.resize ? component.resize() : null;
		}
	}

	changeFilter(messageObject, messageOriginator) {
		for (let component of this.componentList) {
			if (component.id != messageOriginator.id) {
				switch (component.messageHandlerType) {
					case null:
						break;
					case "change_filter":
						component.changeFilter(messageObject) ? component.changeFilter(messageObject) : null;
						break;
					case "change_value":
						component.changeValue(messageObject) ? component.changeValue(messageObject) : null;
						break;
				}
			}
		}
	}


}