import React from 'react';

import ScrollAnimation from 'react-animate-on-scroll';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";
import { getColorScale } from "../../helper_functions/get_color_scale.js";

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


		this.resizeFunc = this.resize.bind(this);

		this.state = {
			width: 0,
		}
	}

    getCurrWidth() {
        return $(this.refs.renderingArea).width();
    }

    renderCategory(category, index) {
        let categoryDescription
        if (this.categoryDescriptions) {
            this.categoryDescriptions.forEach(d => {
                if (d.category === category.key) {
                    categoryDescription = d.description
                }
            })
        }
        return (
            <div className="quote-scroller__category" key={index}>
                <h3 className="quote-scroller__category__title">{category.key}</h3>
                {categoryDescription && <p className="quote-scroller__category__description">{categoryDescription}</p>}
                <div className="quote-scroller__category__quotes">
                    {category.values.map((d, i) => {
                        return this.renderQuote(d, i);
                    })}
                </div>
                <hr></hr>
            </div>
        )
    }

    renderQuote(quote, index) {
        let animationType;
        if (index % 2 == 0) {
            animationType = "fadeInLeft"
        } else {
            animationType = "fadeInRight"
        }

        return (
            <div className="quote-scroller__quote" key={index} >
                <ScrollAnimation animateIn={animationType} offset={50} duration={.75} animateOnce={true}>
                    <p className="quote-scroller__quote__text" dangerouslySetInnerHTML={{__html: formatValue(quote.quote, "markdown")}}></p>
                    <h5 className="quote-scroller__quote__source">{"- " + quote.source + ", " + quote.source_location}</h5>
                </ScrollAnimation>
            </div>
        )
    }

	render() {

		return (
			<div className="quote-scroller">
                {this.dataNest.map((category, i) => {
                    return this.renderCategory(category, i);
                })}
            </div>
		)
	}

	resize() {
        let w = this.getCurrWidth();

        this.state.currLayout.resize(w)

        this.setState({
          width: w,
          height: w/2
        })
    }
}

export default QuoteScroller;