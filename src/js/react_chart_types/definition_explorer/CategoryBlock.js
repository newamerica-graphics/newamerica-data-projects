import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { colors } from "../../helper_functions/colors.js";
import { isTouchDevice } from "../../helper_functions/is_touch_device.js";
import { formatValue } from "../../helper_functions/format_value.js";

const d3 = require("d3");

import Definition from './Definition.js'

class CategoryBlock extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			hovered: false
		}
	}

	mouseEnter() {
		this.setState({
			hovered: true
		})
	}

	mouseLeave() {
		this.setState({
			hovered: false
		})
	}

	onClick() {
		console.log(isTouchDevice());
		if (isTouchDevice()) {
			this.setState({
				hovered: this.state.hovered
			})
		}
	}

	render() {
		const {title, description, categoryDefinitions} = this.props;
		let content;

		if (this.state.hovered) {
			content = <div className="definition-explorer__category__content" key={title}>
				<p className="definition-explorer__category__description">{description}</p>
				<ul className="definition-explorer__category__list">
					{ categoryDefinitions.map((d) => {
						return (
							<li className="definition-explorer__definition" key={d.title}>
								<h5 className="definition-explorer__definition__title">{d.title}</h5>
								<p className="definition-explorer__definition__text">{d.description}</p>
							</li>
						)
					})}
				</ul>
			</div>;
		}

		return (
			<div className="definition-explorer__category" ref="category_container" onMouseEnter={() => {return this.mouseEnter()}} onMouseLeave={() => {return this.mouseLeave()}} onClick={() => {return this.onClick()}}>
				<h5 className="definition-explorer__category__title">{title}</h5>
				<CSSTransitionGroup
				      transitionName="category-block-content"
			          transitionEnterTimeout={500}
			          transitionLeaveTimeout={0}>
				     {content}
				</CSSTransitionGroup >
			</div>
		)
	}
}

export default CategoryBlock;