import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";
import { getColorScale } from "../../helper_functions/get_color_scale.js";

import SelectBox from './SelectBox.js';
import Tooltip from './Tooltip.js';
import LayoutSelector from './LayoutSelector.js';
import LegendCategorical from './LegendCategorical.js';
import HistogramAnnotations from './HistogramAnnotations.js';
import ScatterLayout from './ScatterLayout.js';
import HistogramLayout from './HistogramLayout.js';
import CategoryLayout from './CategoryLayout.js';

import { Motion, spring } from 'react-motion';
import { Axis, axisPropsFromTickScale, BOTTOM, TOP } from 'react-d3-axis';

const d3 = require("d3");

class DotChart extends React.Component {
	constructor(props) {
		super(props);
        const {data, vizSettings} = props

		this.data = data[vizSettings.primaryDataSheet];

		this.resizeFunc = this.resize.bind(this);

		if (vizSettings.colorVar) {
			this.colorScale = getColorScale(this.data, props.vizSettings.colorVar)
		}

		this.state = {
            currLayoutSettings: vizSettings.layouts[0],
			currLayout: null,
			currDataShown: this.data,
			width: 0,
            currHovered: null,
            tooltipSettings: null,
            valsShown:[]
		}
	}

	componentDidMount() {
        $(window).resize(this.resizeFunc);

        let w = this.getCurrWidth(),
            currLayout = this.getCurrLayout(this.state.currDataShown, this.state.currLayoutSettings, w)

        this.setState({
            currLayout: currLayout,
            width: w,
        })
    }

    getCurrWidth() {
        return $(this.refs.renderingArea).width();
    }

    getCurrLayout(data, layoutSettings, w) {
        switch(layoutSettings.layout) {
            case "histogram":
                return new HistogramLayout(data, w)

            case "category":
                return new CategoryLayout(data, w, {variable: "state"})
        }
    }

    getCurrAxis() {
        const {currLayoutSettings, currDataShown} = this.state;

        switch(currLayoutSettings.layout) {
            case "histogram":
                return this.getHistogramAxis()

            case "category":
                return this.getCategoryAxis()
        }
    }

    getHistogramAxis() {
        const { currLayout, currLayoutSettings } = this.state;
        return (
            <Motion style={{currTransform: spring(currLayout.height)}} >
                {({currTransform}) => {
                    return (
                        <g>
                            <g className="dot-chart__axis-time" style={{transform: "translateY(" + currTransform + "px)"}}>
                                <Axis {...axisPropsFromTickScale(currLayout.axisScale, 6)} format={(d) => { return d3.timeFormat("%B %Y")(d) }} style={{orient: BOTTOM}} />
                            </g>
                            {currLayoutSettings.annotationSheet &&
                                <g className="dot-chart__axis-time" style={{transform: "translateY(" + (currTransform + 25) + "px)"}}>
                                    <Axis {...axisPropsFromTickScale(currLayout.axisScale, 6)} format={(d) => { return "" }} style={{orient: TOP}} />
                                </g>
                            }
                        </g>
                    )
                }}
            </Motion>
        )
    }

    getHistogramAnnotations() {
        const { currLayout, currLayoutSettings } = this.state;
        return (
            <Motion style={{currTransform: spring(currLayout.height + 40)}} >
                {({currTransform}) => {
                    return (
                        <HistogramAnnotations data={this.props.data[currLayoutSettings.annotationSheet]} scale={currLayout.axisScale} width={this.state.width} />
                    )
                }}
            </Motion>
        )
    }

    getCategoryAxis() {
        const { currLayout } = this.state;
        return (
            <g>
                {currLayout.yScale.domain().map((d) => {
                    return (
                        <Motion style={{y:spring(currLayout.yScale(d))}} key={d}>
                            {({y}) => {
                                return <text className="dot-chart__axis-categorical__text" x="110" y={y}>{d}</text>;
                            }}
                        </Motion>
                    )
                })}
                
            </g>
        )
    }

    toggleChartVals(newVals) {
        let newData;
        
        let varName = this.props.vizSettings.colorVar.variable
        newData = this.data.filter((d) => { return newVals.indexOf(d[varName]) > -1 })
        
        this.setState({
            currDataShown: newData,
            currLayout: this.getCurrLayout(newData, this.state.currLayoutSettings, this.state.width),
        })
    }

    changeLayout(newLayoutSettings) {
        this.setState({
            currLayoutSettings: newLayoutSettings,
            currLayout: this.getCurrLayout(this.state.currDataShown, newLayoutSettings, this.state.width)
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
		const { valsShown, currLayout, currLayoutSettings, currDataShown, width, height } = this.state;

        let axis, layoutAnnotations;
        console.log(currLayout);

        if (currLayout) {
            axis = this.getCurrAxis();
        }

        if (currLayout && currLayoutSettings.annotationSheet) {
            layoutAnnotations = this.getHistogramAnnotations()
        }

        let layoutHeight = currLayout ? currLayout.height + 27 : 0;
        // layoutHeight += currLayoutSettings.annotationSheet ? 50 : 0;

		return (
			<div className="dot-chart" ref="renderingArea">
                <LayoutSelector layouts={this.props.vizSettings.layouts} currSelected={currLayoutSettings} layoutChangeFunc={this.changeLayout.bind(this)} />
				{ currLayout &&
                    <div>
    					<svg className="dot-chart__container" width="100%" height={layoutHeight}>
    						<g className="dot-chart__rendering-area" width={width} >
    							{currDataShown.map((d) => {
                                    if (!d.id) return null;
    								let style = currLayout.renderDot(d)
    								let fillColor = this.setFill(d),
    									stroke = this.setStroke(d)

    								return (
    									<Motion style={style} key={d.id}>
    										{({x, y, r}) => {
    											return <circle className="dot-chart__dot" cx={x} cy={y} r={r} fill={fillColor} stroke={stroke} strokeWidth="2px" onMouseOver={() => { return this.mouseover(d, x, y); }} onMouseOut={() => { return this.mouseout(); }}/>;
    										}}
    									</Motion>
    								)
    							})}
                            </g>
                            {axis}
                        </svg>
                        {layoutAnnotations}
                    </div>
					
				}
                <LegendCategorical valsShown={valsShown} toggleChartVals={this.toggleChartVals.bind(this)} colorScale={this.colorScale} />
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
                title: d[this.props.vizSettings.tooltipTitleVar.variable],
                tooltipVars: this.props.vizSettings.tooltipVars,
                renderingAreaWidth: this.state.width,
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