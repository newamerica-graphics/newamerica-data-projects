import React from 'react';

import ScrollAnimation from 'react-animate-on-scroll';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";
import { getColorScale } from "../../helper_functions/get_color_scale.js";

import QuoteScrollerCategory from './QuoteScrollerCategory.js';
import { Motion, spring } from 'react-motion';
import { Axis, axisPropsFromBandedScale, BOTTOM, TOP } from 'react-d3-axis';

const d3 = require("d3");

class QuoteScroller extends React.Component {
	constructor(props) {
		super(props);
        const {data, vizSettings} = props

		this.data = data[vizSettings.primaryDataSheet];
        if (vizSettings.filterInitialDataFunction) {
            this.data = this.data.filter(vizSettings.filterInitialDataFunction);
        }

        if (vizSettings.categoryDescriptionSheet) {
            this.categoryDescriptions = data[vizSettings.categoryDescriptionSheet];
        }

        this.dataNest = d3.nest()
            .key(d => d[vizSettings.categoryVar.variable])
            .entries(this.data)
	}

	render() {
		return (
			<div className="quote-scroller">
                {this.dataNest.map((categoryData, i) => {
                    let categoryDescription
                    
                    if (this.categoryDescriptions) {
                        this.categoryDescriptions.forEach(d => {
                            if (d.category === categoryData.key) {
                                categoryDescription = d.description
                            }
                        })
                    }

                    return <QuoteScrollerCategory categoryData={categoryData} categoryDescription={categoryDescription} key={i}/>
                })}
            </div>
		)
	}
}

export default QuoteScroller;