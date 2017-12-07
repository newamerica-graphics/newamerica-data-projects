import React from 'react';

import ScrollAnimation from 'react-animate-on-scroll';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";
import { getColorScale } from "../../helper_functions/get_color_scale.js";

import { Motion, spring } from 'react-motion';
import { Axis, axisPropsFromBandedScale, BOTTOM, TOP } from 'react-d3-axis';

const d3 = require("d3");

class QuoteScrollerCategory extends React.Component {
	constructor(props) {
		super(props);
       
        this.state = {
            contentVisible: false
        }
	}


    renderQuote(quote, index) {
        let animationType;
        if (index % 2 == 0) {
            animationType = "fadeInLeft"
        } else {
            animationType = "fadeInRight"
        }

        let classList = "quote-scroller__quote";
        classList += this.state.contentVisible ? " animate " + animationType : ""

        return (
            <div className={classList} key={index} >
                {/*<ScrollAnimation animateIn={animationType} offset={50} duration={.75} animateOnce={true}>*/}
                    <p className="quote-scroller__quote__text" dangerouslySetInnerHTML={{__html: formatValue(quote.quote, "markdown")}}></p>
                    <h5 className="quote-scroller__quote__source">{"- " + quote.source + ", " + quote.source_location}</h5>
                {/*</ScrollAnimation>*/}
            </div>
        )
    }

    toggleVisibility() {
        this.setState({
            contentVisible: !this.state.contentVisible
        })
    }

	render() {
        const {categoryData, categoryDescription} = this.props;

        let categoryClassList = "quote-scroller__category";
        categoryClassList += this.state.contentVisible ? "" : " hidden";

		return (
            <div className={categoryClassList} onClick={() => this.toggleVisibility()}>
                <h3 className="quote-scroller__category__title">{categoryData.key}</h3>
                
                    <div className="quote-scroller__category__content">
        			    {categoryDescription && <div className="quote-scroller__category__description" dangerouslySetInnerHTML={{__html:formatValue(categoryDescription, "markdown")}} ></div>}
                        <div className="quote-scroller__category__quotes">
                            {categoryData.values.map((d, i) => {
                                return this.renderQuote(d, i);
                            })}
                        </div>
                    </div>
                
            </div>
		)
	}
}

export default QuoteScrollerCategory;