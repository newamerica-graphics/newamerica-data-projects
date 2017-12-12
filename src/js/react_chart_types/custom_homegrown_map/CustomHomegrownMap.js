import React from 'react';

import { colors } from "../../helper_functions/colors.js";
import { formatValue } from "../../helper_functions/format_value.js";

import { usGeom } from '../../../geometry/us.js';
import { worldGeom } from '../../../geometry/world.js';
// import { stateIdMappings } from '../../helper_functions/state_id_mappings.js';
// import { countryIdMappings } from '../../helper_functions/country_id_mappings.js';

import $ from 'jquery';
const d3 = require("d3");
const topojson = require("topojson");


class CustomHomegrownMap extends React.Component {
	constructor(props) {
		super(props);

		let data = props.data[props.vizSettings.primaryDataSheet];

		this.statesData = data.filter(d => d.geo_type === "state")
			// .map(d => { d.id = stateIdMappings[d.geo_unit_name]; return d; })
		this.countriesData = data.filter(d => d.geo_type === "country")
			// .map(d => { d.id = countryIdMappings[d.geo_unit_name]; return d; })

		this.statesGeom = topojson.feature(usGeom, usGeom.objects["states"]).features;
		this.countriesGeom = topojson.feature(worldGeom, worldGeom.objects.countries).features;

		this.state = {
			width: 1000,
			height: 1000
		}

		this.updateStatesMap(this.state);
		this.setInitialCountriesMap();

		this.resizeFunc = this.resize.bind(this);
	}

	updateStatesMap(stateObject) {
		const { width, height } = stateObject;

		this.statesProjection = d3.geoAlbersUsa()
            .scale(5*width/4)
            .translate([width/2, height/2]);

        this.statesPathGenerator = d3.geoPath()
            .projection(this.statesProjection);
	}

	setInitialCountriesMap() {
		this.countriesProjection = d3.geoEquirectangular()
			.scale(1)
		    .translate([0, 0]);

        this.countriesPathGenerator = d3.geoPath()
            .projection(this.countriesProjection);
	}

	updateCountriesMap(stateObject) {
		const { width, height } = stateObject;

        var b = this.countryBoundingRect,
			s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
			t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

		console.log(b, s, t)

		this.countriesProjection
			.scale(s)
			.translate(t);

        this.countriesPathGenerator = d3.geoPath()
            .projection(this.countriesProjection);
	}

	findCountryBoundingRect() {
		let x0 = 10000,
			y0 = 10000,
			x1 = 0,
			y1 = 0;

		this.countriesGeom.forEach(d => {
			if (this.setFill("country", d.id) === colors.grey.light) {
				return;
			}

			let bounds = this.countriesPathGenerator.bounds(d)

			x0 = Math.min(bounds[0][0], x0);
			y0 = Math.min(bounds[0][1], y0);
			x1 = Math.max(bounds[1][0], x1);
			y1 = Math.max(bounds[1][1], y1);
		})

		this.countryBoundingRect = [[x0, y0], [x1, y1]]
	}

	componentDidMount() {
        $(window).resize(this.resizeFunc);

        this.findCountryBoundingRect();

        this.resize()
    }

    componentWillUpdate(nextProps, nextState) {
    	if (nextState.width != this.state.width) {
    		this.updateStatesMap(nextState);
			this.updateCountriesMap(nextState);
    	}
    }

	render() {
		const { width, height } = this.state;
		const {  } = this.props.vizSettings;

		return (
			<div className="custom-homegrown-map">
				<div className="custom-homegrown-map__main">
					<div className="custom-homegrown-map__section">
						<h5 className="custom-homegrown-map__section__title">Jihadist Terrorists with Origins in the U.S.</h5>
						<div className="custom-homegrown-map__section__map-container" ref="renderingArea">
							<svg width={width} height={height}>
								<g>
									{ this.statesGeom.map(d => {
										let fill = this.setFill("state", d.id);
										return <path key={d.id} className="custom-homegrown-map__path" d={this.statesPathGenerator(d)} fill={fill}></path>
									})}
								</g>
							</svg>
						</div>
					</div>
					<div className="custom-homegrown-map__section">
						<h5 className="custom-homegrown-map__section__title">Jihadist Terrorists with Origins Outside the U.S.</h5>
						<div className="custom-homegrown-map__section__map-container">
							<svg width={width} height={height}>
								<g>
									{ this.countriesGeom.map(d => {
										let fill = this.setFill("country", d.id);
										return <path key={d.id} className="custom-homegrown-map__path" d={this.countriesPathGenerator(d)} fill={fill}></path>
									})}
								</g>
							</svg>
						</div>
					</div>
				</div>
				<div className="custom-homegrown-map__legend">
					<div className="custom-homegrown-map__legend__section">
						<div className="custom-homegrown-map__legend__color-swatch" style={{ backgroundColor: colors.red.light }}>
						</div>
						<h5 className="custom-homegrown-map__legend__text">Birth State of Jihadist Terrorist Responsible for Non-Lethal Attack in U.S.</h5>
					</div>
					<div className="custom-homegrown-map__legend__section">
						<div className="custom-homegrown-map__legend__color-swatch" style={{ backgroundColor: colors.purple.light }}>
						</div>
						<h5 className="custom-homegrown-map__legend__text">Birth State of Jihadist Terrorist Responsible for Non-Lethal Attack in U.S. and Trump Visa Restricted Country</h5>
					</div>
					<div className="custom-homegrown-map__legend__section">
						<div className="custom-homegrown-map__legend__color-swatch" style={{ backgroundColor: colors.turquoise.light }}>
						</div>
						<h5 className="custom-homegrown-map__legend__text">Trump Visa Restricted Country*</h5>
					</div>
				</div>
				<div className="custom-homegrown-map__annotation">
					<h5 className="custom-homegrown-map__annotation__text">*On March 6, 2017 the Trump administration issued a new executive order, which did not include Iraq in the list of visa restricted countries. On Septemebr 24, the travel ban was revised again to drop Sudan, and add travel restrictions regarding Venezuela and North Korea  (not displayed on this map), as well as Chad.</h5>
				</div>
			</div>
		)
	}

	resize() {
		let w = $(this.refs.renderingArea).width();
		this.setState({
        	width: w,
        	height: w,
        })
	}

	setFill(geoType, geoId) {
		let dataValList;

		if (geoType === "state") {
			dataValList = this.statesData.filter(d => +d.geo_id === geoId)
		} else {
			dataValList = this.countriesData.filter(d => +d.geo_id === geoId)
		}

		if (dataValList.length === 0) {
			return colors.grey.light;
		} else {
			let dataVal = dataValList[0]

			if (dataVal.category === "Birth State of Jihadist Terrorist Responsible for Non-Lethal Attack in U.S.") {
				return colors.red.light
			} else if (dataVal.category === "Birth State of Jihadist Terrorist Responsible for Non-Lethal Attack in U.S. and Trump Visa Restricted Country") {
				return colors.purple.light
			} else if (dataVal.category === "Trump Visa Restricted Country") {
				return colors.turquoise.light
			}
		}

		return colors.grey.light
	}
}

export default CustomHomegrownMap;