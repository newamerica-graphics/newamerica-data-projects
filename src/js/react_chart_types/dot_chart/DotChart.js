import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";
import { getColorScale } from "../../helper_functions/get_color_scale.js";

import SelectBox from './SelectBox.js';
import Tooltip from './Tooltip.js';
import ScatterLayout from './ScatterLayout.js';
import HistogramLayout from './HistogramLayout.js';
import {Motion} from 'react-motion';
import {Axis, axisPropsFromTickScale, BOTTOM} from 'react-d3-axis';

const d3 = require("d3");

class DotChart extends React.Component {
	constructor(props) {
		super(props);
		console.log(props);

		this.data = props.data[props.vizSettings.primaryDataSheet];

		this.resizeFunc = this.resize.bind(this);

		if (props.vizSettings.colorVar) {
			this.colorScale = getColorScale(this.data, props.vizSettings.colorVar)
		}

		this.state = {
			currLayout: null,
			currDataShown: this.data,
			width: 0,
            height: 0,
            currHovered: null,
            tooltipSettings: null,
		}

	}

	componentDidMount() {
        $(window).resize(this.resizeFunc);

        let w = this.getCurrWidth();

        this.setState({
        	currLayout: new HistogramLayout(this.state.currDataShown, w, w/2),
            width: w,
            height: w/2,
            
        })
    }

    getCurrWidth() {
        return $(this.refs.renderingArea).width();
    }

    clicked() {
    	// this.setState({
    	// 	currLayout: new HistogramLayout(this.data, this.state.width, this.state.height)
    	// })
    }

    filterChangeFunc(newFilter) {
    	let varName = this.props.vizSettings.filterVar.variable
    	this.setState({
    		currDataShown: this.data.filter((d) => { return d[varName] == newFilter })
    	})
    }

    setFill(d) {
    	const {colorVar} = this.props.vizSettings
    	return this.colorScale(d[colorVar.variable])
    }

    setStroke(d) {
    	const {currHovered} = this.state;

    	if (currHovered && currHovered == d) {
    		return "white"
    	} 
    	return "none"
    }

	render() {
		const { currLayout, currDataShown, width, height } = this.state;
		const {filterVar} = this.props.vizSettings;

		let filterSelector;

		let filterVals = d3.map(this.data, (d) => {return d[filterVar.variable];}).keys()
		console.log(filterVals)
		filterSelector = <SelectBox values={filterVals} filterChangeFunc={this.filterChangeFunc.bind(this)} />


		return (
			<div className="dot-chart" ref="renderingArea" onClick={ () => { return this.clicked() } }>
				{filterSelector}
				{ currLayout &&
					<svg className="dot-chart__container" width="100%" height={currLayout.height + 50}>
						
							<g className="dot-chart__rendering-area" width={width} height={currLayout.height }>
								
								{currDataShown.map((d, i) => {
									let style = currLayout.renderDot(d, i)
									let fillColor = this.setFill(d),
										stroke = this.setStroke(d)

									return (
										<Motion style={style} key={i}>
											{({x, y, r}) => {
												return <circle className="dot-chart__dot" cx={x} cy={y} r={r} fill={fillColor} stroke={stroke} strokeWidth="2px" onMouseOver={() => { return this.mouseover(d, x, y); }} onMouseOut={() => { return this.mouseout(); }}/>;
											}}
										</Motion>
									)

								})}
								
                            </g>
                            <g style={{transform: "translateY(" + currLayout.height + "px)"}}>
                                <Axis {...axisPropsFromTickScale(currLayout.axisScale, 6)} format={(d) => { return d3.timeFormat("%B %Y")(d) }} style={{orient: BOTTOM}}/>
                            </g>
						}
					</svg>
				}
				<Tooltip settings={this.state.tooltipSettings} />
			</div>
		)
		

	}

	resize() {
        let w = this.getCurrWidth();

        this.state.currLayout.resize(w, w/2)

        this.setState({
          width: w,
          height: w/2
        })
    }

    mouseover(d, x, y) {
    	console.log(d, x, y)

    	this.setState({
            currHovered: d,
            tooltipSettings: {
                x: x,
                y: y - 30,
                tooltipVars: this.props.vizSettings.tooltipVars,
                // renderingAreaWidth: renderingAreaWidth,
                // title: year,
                datum: d
            }
        })
    }

    mouseout() {
    	this.setState({
            currHovered: null,
            tooltipSettings: null
        })
    }
}

export default DotChart;