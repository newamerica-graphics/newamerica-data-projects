import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { colors } from "../../helper_functions/colors.js";
import { isTouchDevice } from "../../helper_functions/is_touch_device.js";

const d3 = require("d3");

class CategoryBlock extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			expanded: false
		}
	}

	onClick() {
		this.setState({
			expanded: !this.state.expanded
		})
	}

	render() {
		const {title, description, categoryDefinitions} = this.props;
		let content, classList;
		classList = "definition-explorer__category";

		if (this.state.expanded) {
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

			classList += " expanded";
		}

		return (
			<div className={classList} onClick={() => {return this.onClick()}}>
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