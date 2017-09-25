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
import { Axis, axisPropsFromBandedScale, BOTTOM, TOP } from 'react-d3-axis';

const d3 = require("d3");

class DotChart extends React.Component {
	constructor(props) {
		super(props);
        const {data, vizSettings} = props

		this.data = data[vizSettings.primaryDataSheet];
        console.log(this.data.length)
        if (vizSettings.filterInitialDataFunction) {
            this.data = this.data.filter(vizSettings.filterInitialDataFunction);
        }
        console.log(this.data.length)

		this.resizeFunc = this.resize.bind(this);

		if (vizSettings.colorSettings.colorVar) {
			this.colorScale = getColorScale(this.data, vizSettings.colorSettings.colorVar)
		}

        if (vizSettings.interaction == "click") {
            window.addEventListener('click', () => { console.log("clicked"); return this.clicked(null); });
        }

		this.state = {
            currLayoutSettings: vizSettings.layouts[0],
			currLayout: null,
			currDataShown: this.data,
			width: 0,
            currHovered: null,
            currClicked: null,
            tooltipSettings: null,
            valsShown:[]
		}
	}

    setFill(d) {
        const {colorVar, defaultColor} = this.props.vizSettings.colorSettings

        if (this.colorScale) {
           return this.colorScale(d[colorVar.variable])
        } else {
            return defaultColor
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
        console.log(this.props.vizSettings.dotSettings)
        switch(layoutSettings.layout) {
            case "histogram":
                return new HistogramLayout(data, w, layoutSettings, this.props.vizSettings.dotSettings)

            case "category":
                return new CategoryLayout(data, w, layoutSettings, this.props.vizSettings.dotSettings)
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
        const { currLayout, currLayoutSettings, width } = this.state;

        // let numTicks = d3.timeYear.count(currLayout.axisScale.domain()[0], currLayout.axisScale.domain()[1])
        // console.log(numTicks)
        return (
            <Motion style={{currTransform: spring(currLayout.height - 27)}} >
                {({currTransform}) => {
                    return (
                        <g>
                            <g className="dot-chart__axis-time" style={{transform: "translateY(" + currTransform + "px)"}}>
                                <Axis {...axisPropsFromBandedScale(currLayout.axisScale)} format={(d) => { return d3.timeFormat("%Y")(d) }} style={{orient: BOTTOM}} />
                            </g>
                            {currLayoutSettings.annotationSheet &&
                                <g className="dot-chart__axis-time" style={{transform: "translateY(" + (currTransform + 25) + "px)"}}>
                                    <Axis {...axisPropsFromBandedScale(currLayout.axisScale)} format={(d) => { return "" }} style={{orient: TOP}} />
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
                                return <text className="dot-chart__axis-categorical__text" x={currLayout.leftMargin - 10} y={y + 1}>{d}</text>;
                            }}
                        </Motion>
                    )
                })}
                
            </g>
        )
    }

    toggleChartVals(newVals) {
        let newData;
        
        let varName = this.props.vizSettings.colorSettings.colorVar.variable
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

    setStrokeColor(d) {
    	const {currClicked, currHovered} = this.state;

    	if ((currClicked && currClicked == d) || (currHovered && currHovered == d)) {
    		return "black"
    	} 
    	return "white"
    }

	render() {
		const { valsShown, currLayout, currLayoutSettings, currDataShown, width, height } = this.state;
        const { layouts, interaction, colorSettings } = this.props.vizSettings

        let axis, layoutAnnotations;

        if (currLayout) {
            axis = this.getCurrAxis();
        }

        if (currLayout && currLayoutSettings.annotationSheet) {
            layoutAnnotations = this.getHistogramAnnotations()
        }

        let layoutHeight = currLayout ? currLayout.height : 0;
        // layoutHeight += currLayoutSettings.annotationSheet ? 50 : 0;

		return (
			<div className="dot-chart" ref="renderingArea">
                {layouts.length > 1 && 
                    <LayoutSelector layouts={layouts} currSelected={currLayoutSettings} layoutChangeFunc={this.changeLayout.bind(this)} /> 
                }
                {colorSettings.showLegend && 
                    <LegendCategorical valsShown={valsShown} toggleChartVals={this.toggleChartVals.bind(this)} colorScale={this.colorScale} orientation="horizontal-center"/> 
                }
				{ currLayout &&
                    <div>
    					<svg className="dot-chart__container" width="100%" height={layoutHeight}>
    						<g className="dot-chart__rendering-area" width={width} >
    							{currDataShown.map((d) => {
                                    if (!d.id) return null;
    								let style = currLayout.renderDot(d)

    								let fillColor = currLayoutSettings.overrideColorVar ? currLayout.setFill(d) : this.setFill(d),
    									strokeColor = this.setStrokeColor(d)

    								return (
    									<Motion style={style} key={d.id}>
    										{({x, y, r}) => {
    											return (
                                                    <circle className={interaction == "click" ? "dot-chart__dot clickable" : "dot-chart__dot"}
                                                        cx={x} cy={y} r={r} 
                                                        fill={fillColor} 
                                                        stroke={strokeColor} 
                                                        onClick={(e, b) => { console.log(e, b); e.stopPropagation(); return interaction == "click" ? this.clicked(d, x, y) : null; }} 
                                                        onMouseOver={() => { return this.mouseover(d, x, y); }} 
                                                        onMouseOut={() => { return this.mouseout(d); }}/>
                                                )
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

    clicked(d, x, y) {
        if (!d || (this.state.tooltipSettings && this.state.currClicked == d)) {
            this.setState({
                currClicked: null,
                tooltipSettings: null
            })
        } else {
            this.setState({
                currClicked: d,
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
    }

    mouseover(d, x, y) {
        if (this.props.vizSettings.interaction == "click") {
        	this.setState({
                currHovered: d
            })
        } else {
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
    }

    mouseout(d) {
        if (this.props.vizSettings.interaction == "click") {
            // if (!this.state.tooltipSettings || (this.state.tooltipSettings && this.state.tooltipSettings.datum != d)) {
            	this.setState({
                    currHovered: null
                })
            // }
        } else {
            this.setState({
                currHovered: null,
                tooltipSettings: null
            })
        }
    }
}

export default DotChart;