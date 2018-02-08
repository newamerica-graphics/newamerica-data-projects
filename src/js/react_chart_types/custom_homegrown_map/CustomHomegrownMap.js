import React from 'react';

import { colors } from "../../helper_functions/colors.js";
import { formatValue } from "../../helper_functions/format_value.js";

// import { usGeom } from '../../../geometry/us.js';
// import { worldGeom } from '../../../geometry/world.js';
// import { stateIdMappings } from '../../helper_functions/state_id_mappings.js';
// import { countryIdMappings } from '../../helper_functions/country_id_mappings.js';

const d3 = require("d3");
const topojson = require("topojson");


class CustomHomegrownMap extends React.Component {
	constructor(props) {
		super(props);

		this.sendGeomRequests();

		let data = props.data[props.vizSettings.primaryDataSheet].filter(props.vizSettings.filterInitialDataFunction)

		this.statesData = data.filter(d => d.geo_type === "state")
			// .map(d => { d.id = stateIdMappings[d.geo_unit_name]; return d; })
		this.countriesData = data.filter(d => d.geo_type === "country")
			// .map(d => { d.id = countryIdMappings[d.geo_unit_name]; return d; })

		this.state = {
			width: 0,
			height: 0,
			statesGeom: null,
			countriesGeom: null
		}

		this.updateStatesMap(this.state);
		this.setInitialCountriesMap();

		this.resizeFunc = this.resize.bind(this);

		this.initialUpdate = true;
	}

	sendGeomRequests() {
		d3.json("https://na-data-projects.s3.amazonaws.com/geography/us.json", (error, data) => {
			let statesGeom = topojson.feature(data, data.objects["states"]).features;

			statesGeom.map(geom => {
				this.statesData.forEach(d => {
					if (+d.geo_id === geom.id) {
						geom.data = d;
						return;
					}
				})
				return geom;
			})

			this.setState({
				statesGeom: statesGeom
			})
		})

		d3.json("https://na-data-projects.s3.amazonaws.com/geography/world.json", (error, data) => {
			let countriesGeom = topojson.feature(data, data.objects.countries).features;

			countriesGeom.map(geom => {
				this.countriesData.forEach(d => {
					if (+d.geo_id === geom.id) {
						geom.data = d;
						return;
					}
				})
				return geom;
			})

			this.findCountryBoundingRect(countriesGeom);

			this.setState({
				countriesGeom: countriesGeom
			})
		})
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
			.rotate([-12,0])
		    .translate([0, 0]);

        this.countriesPathGenerator = d3.geoPath()
            .projection(this.countriesProjection);
	}

	updateCountriesMap(stateObject) {
		const { width, height } = stateObject;

        var b = this.countryBoundingRect,
			s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
			t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

		this.countriesProjection
			.scale(s)
			.translate(t);

        this.countriesPathGenerator = d3.geoPath()
            .projection(this.countriesProjection);
	}

	findCountryBoundingRect(countriesGeom) {
		let x0 = 10000,
			y0 = 10000,
			x1 = 0,
			y1 = 0;

		countriesGeom.forEach(d => {
			if (!d.data) {
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

        this.resize();
    }

    componentWillUpdate(nextProps, nextState) {
    	const {statesGeom, countriesGeom} = this.state;

    	if ((nextState.statesGeom && nextState.countriesGeom) && ((!statesGeom || !countriesGeom) || (nextState.width != this.state.width))) {
    		this.updateStatesMap(nextState);
			this.updateCountriesMap(nextState);
			// this.initialUpdate = false;
    	}
    }

	render() {
		const { width, height, tooltipVal, tooltipPos, statesGeom, countriesGeom } = this.state;
		const {  } = this.props.vizSettings;

		return (
			<div className="custom-homegrown-map">
				<div className="custom-homegrown-map__main" ref="fullContainer">
					<div className="custom-homegrown-map__section">
						<h5 className="custom-homegrown-map__section__title">Jihadist Terrorists with Origins in the U.S.</h5>
						<div className="custom-homegrown-map__section__map-container" ref="renderingArea">
							<svg width={width} height={height}>
								{statesGeom && <g>
									{ statesGeom.map(d => {
										let fill = this.setFill(d);
										return <path
													key={d.id}
													className="custom-homegrown-map__path"
													d={this.statesPathGenerator(d)}
													fill={fill}
													fillOpacity={tooltipVal && tooltipVal.data.geo_type == "state" && tooltipVal.id === d.id ? ".5" : "1"}
													onMouseOver={(e) => { return d.data ? this.mouseover(d, e) : null; }}
                                                    onMouseOut={() => { return d.data ?  this.mouseout(d) : null; }} />
									})}
								</g>}
							</svg>
						</div>
					</div>
					<div className="custom-homegrown-map__section">
						<h5 className="custom-homegrown-map__section__title">Jihadist Terrorists with Origins Outside the U.S.</h5>
						<div className="custom-homegrown-map__section__map-container">
							<svg width={width} height={height}>
								{ countriesGeom && <g>
									{ countriesGeom.map(d => {
										let fill = this.setFill(d);
										return <path
													key={d.id}
													className="custom-homegrown-map__path"
													d={this.countriesPathGenerator(d)}
													fill={fill}
													fillOpacity={tooltipVal && tooltipVal.data.geo_type == "country" && tooltipVal.id === d.id ? ".5" : "1"}
													onMouseOver={(e) => { return d.data ? this.mouseover(d, e) : null; }}
                                                    onMouseOut={() => { return d.data ?  this.mouseout(d) : null; }} />
									})}
								</g>}
							</svg>
						</div>
					</div>
				</div>
				<div className="custom-homegrown-map__legend">
					<div className="custom-homegrown-map__legend__section">
						<div className="custom-homegrown-map__legend__section__content">
							<div className="custom-homegrown-map__legend__color-swatch-container">
								<div className="custom-homegrown-map__legend__color-swatch" style={{ backgroundColor: colors.red.light }}>
								</div>
							</div>
							<h5 className="custom-homegrown-map__legend__text">Birth State of Jihadist Terrorist Responsible for Attack in U.S.</h5>
						</div>
					</div>
					<div className="custom-homegrown-map__legend__section">
						<div className="custom-homegrown-map__legend__section__content">
							<div className="custom-homegrown-map__legend__color-swatch-container">
								<div className="custom-homegrown-map__legend__color-swatch" style={{ backgroundColor: "#927d85" }}>
								</div>
							</div>
							<h5 className="custom-homegrown-map__legend__text">Birth State of Jihadist Terrorist Responsible for Attack in U.S. and Trump Visa Restricted Country</h5>
						</div>
					</div>
					<div className="custom-homegrown-map__legend__section">
						<div className="custom-homegrown-map__legend__section__content">
							<div className="custom-homegrown-map__legend__color-swatch-container">
								<div className="custom-homegrown-map__legend__color-swatch" style={{ backgroundColor: colors.turquoise.light }}>
								</div>
							</div>
							<h5 className="custom-homegrown-map__legend__text">Trump Visa Restricted Country*</h5>
						</div>
					</div>
				</div>
				<div className="custom-homegrown-map__annotation">
					<h5 className="custom-homegrown-map__annotation__text">*On March 6, 2017 the Trump administration issued a new executive order, which did not include Iraq in the list of visa restricted countries. On September 24, the travel ban was revised again to drop Sudan, and add travel restrictions regarding Venezuela and North Korea  (not displayed on this map), as well as Chad. This graphic excludes Mahad Abdirahman, a U.S. citizen of Somali descent, as his birth location and whether he was a naturalized citizen is unknown as of January 31, 2018 as well as Tnuza Hassan whose citizenship status is also unknown.</h5>
				</div>
				{tooltipVal && tooltipVal.data.text && tooltipVal.data.text != "" && <div className="custom-homegrown-map__tooltip" style={tooltipPos}>{tooltipVal.data.text}</div>}
			</div>
		)
	}

	resize() {
		let w = $(this.refs.renderingArea).width();

		this.setState({
        	width: w,
        	height: 4*w/5,
        })
	}

	mouseover(d, e) {
		let renderingAreaOffset = $(this.refs.renderingArea).offset()

		let tooltipPos = { top: e.pageY - renderingAreaOffset.top }

		if (e.pageX + 160 > $(this.refs.fullContainer).width()) {
			tooltipPos.right = $(this.refs.fullContainer).width() - (e.pageX - renderingAreaOffset.left) + 15;
		} else {
			tooltipPos.left = e.pageX + 15 - renderingAreaOffset.left
		}

		this.setState({
			tooltipVal: d,
			tooltipPos: tooltipPos
		})
	}

	mouseout() {
		this.setState({
			tooltipVal: null
		})
	}

	setFill(d) {
		if (d.data) {
			let dataVal = d.data.category
			if (dataVal === "Birth State of Jihadist Terrorist Responsible for Attack in U.S.") {
				return colors.red.light
			} else if (dataVal === "Birth State of Jihadist Terrorist Responsible for Attack in U.S. and Trump Visa Restricted Country") {
				return "#927d85"
			} else if (dataVal === "Trump Visa Restricted Country") {
				return colors.turquoise.light
			}
		}

		return colors.grey.light;
	}
}

export default CustomHomegrownMap;
