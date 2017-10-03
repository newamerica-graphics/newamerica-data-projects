import React from 'react';
var d3 = require("d3");
import { formatValue } from "../../helper_functions/format_value.js";

export default class LegendCategorical extends React.Component {
	constructor(props) {
		super(props);

		this.numVals = this.props.colorScale.domain().length
		this.fullValList = this.props.colorScale.domain();
		
		this.state = {
			valsShown: this.fullValList
		};
	}

	toggleVals(valToggled) {
		let {valsShown} = this.state;
		let newValsShownList = [];

		if (valsShown.length == this.numVals) {
			newValsShownList.push(valToggled);
		} else {
			let index = valsShown.indexOf(valToggled);
			newValsShownList = valsShown;

			if (index > -1) {
				newValsShownList.splice(index, 1);
			} else {
				newValsShownList.push(valToggled);
			}
		}

		// if none toggled, show all values
		if (newValsShownList.length == 0) {
			newValsShownList = this.fullValList;
		}

		this.props.toggleChartVals(newValsShownList);

		this.setState({
			valsShown: newValsShownList
		});
	}

	render() {
		return (
			<div className={"legend " + this.props.orientation + " categorical"}>
				<ul className="legend__cell-list">
					{this.fullValList.map(variable => {
						let classes = "legend__cell";
						classes += this.state.valsShown.indexOf(variable) > -1 ? "" : " disabled";
			          return (
			          	<li className={classes} onClick={() => this.toggleVals(variable)}>
			          		<svg height="8" width="8" className="legend__cell__color-swatch-container">
			          			<circle key={variable} fill={this.props.colorScale(variable)} cx="4" cy="4" r="4" className="legend__cell__color-swatch"></circle>
			          		</svg>
			          		<h5 className="legend__cell__label">{variable}</h5>
			          	</li>
			          )
			        })}
				</ul>
			</div>
		)
	}
}