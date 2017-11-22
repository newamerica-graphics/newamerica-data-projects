import React from 'react';

import { colors } from "../../helper_functions/colors.js";

const d3 = require("d3");
const topojson = require("topojson");

// import { worldGeom } from '../../../geometry/world.js';
import { pakistan } from '../../../geometry/pakistan.js';
import { yemen } from '../../../geometry/yemen.js';
import { somalia } from '../../../geometry/somalia.js';
import $ from 'jquery';

import { getValue } from "./utilities.js";

const mapPadding = 15;

class SimpleMap extends React.Component {
	constructor(props) {
		super(props);

		// let countries = topojson.feature(worldGeom, worldGeom.objects.countries).features;

		// countries.forEach((d) => {
		// 	console.log(d);
		// 	if (d.id == 586) {
		// 		this.geometry = d;
		// 	}
		// })
		if (props.country == "pakistan") {
			this.geometry = pakistan;
		} else if (props.country == "yemen") {
			this.geometry = yemen;
		} else if (props.country == "somalia") {
			this.geometry = somalia;
		}

		console.log(this.geometry)

		this.resizeFunc = this.resize.bind(this);

		this.state = {
			width: 0,
		}
	}

	projection() {
	    return d3.geoMercator()
	      .fitExtent([[mapPadding, mapPadding], [this.state.width - mapPadding, this.state.width - mapPadding]], this.geometry)
	 }

	componentDidMount() {
		let width = $(this.refs.container).width();

		this.setState({
			width: width,
		})

		$(window).resize(this.resizeFunc);
			
	}

	resize() {
		let width = $(this.refs.container).width();

		this.setState({
			width: width
		})
	}
	
	render() {
		const {country, latVar, lngVar, data} = this.props;
		const {width} = this.state;
		let path = d3.geoPath().projection(this.projection())(this.geometry)

		let dataLat= getValue(latVar, data),
			dataLng= getValue(lngVar, data);

		let point;
		if (dataLat && dataLng) {
			point = <circle className="callout-box__simple-map__point" cx={this.projection()([dataLng, dataLat])[0]} cy={this.projection()([dataLng, dataLat])[1]} r="10"/>
		}

		return (
			<div ref="container" className="callout-box__simple-map">
				<svg width="100%" height={width} className="callout-box__simple-map__rendering-area" >
					<defs>
						<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
						  <path d="M-1,1 l2,-2
						           M0,4 l4,-4
						           M3,5 l2,-2" 
						        style={{stroke:"#6b6d71", strokeWidth:1}} />
						</pattern>
					</defs>
					<rect width="100%" height="100%" style={{stroke:"#6b6d71", fill:"url(#diagonalHatch)"}} ></rect>
					<path d={path} className="callout-box__simple-map__path"/>
					{point}
					
				</svg>
			</div>
		)
	}
}


export default SimpleMap;

