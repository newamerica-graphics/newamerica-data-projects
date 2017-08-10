import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";

import ScatterLayout from './ScatterLayout.js';
import HistogramLayout from './HistogramLayout.js';
import {Motion} from 'react-motion';

const d3 = require("d3");

class DotChart extends React.Component {
	constructor(props) {
		super(props);
		console.log(props);

		this.data = props.data[props.vizSettings.primaryDataSheet];

		this.resizeFunc = this.resize.bind(this);

		this.state = {
			currLayout: null,
			currDataShown: [],
			width: 0,
            height: 0,
		}

	}

	componentDidMount() {
        $(window).resize(this.resizeFunc);

        let w = this.getCurrWidth();

        this.setState({
        	currLayout: new HistogramLayout(this.data, w, w/2),
            width: w,
            height: w/2,
            
        })
    }

    getCurrWidth() {
        return $(this.refs.renderingArea).width();
    }

    clicked() {
    	this.setState({
    		currLayout: new HistogramLayout(this.data, this.state.width, this.state.height)
    	})
    }

	render() {
		const { currLayout, currDataShown, width, height } = this.state;

		console.log(currLayout)
		return (
			<div className="dot-chart" ref="renderingArea" onClick={ () => { return this.clicked() } }>
				<svg className="dot-chart__container" width="100%" height={height}>
					{ currLayout &&
						<g className="dot-chart__rendering-area" width={width} height={height}>
							
								{this.data.map((d, i) => {
									let style = currLayout.renderDot(d, i)

									return (
										<Motion style={style} key={i}>
											{({x, y, r}) => {
												return <circle cx={x} cy={y} r={r} />;
											}}
										</Motion>
									)

								})}
							

						</g>
					}
				</svg>
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


}

export default DotChart;