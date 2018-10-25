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
			          		<div className="legend__cell-contents">
				          		<svg height="10" width="10" className="legend__cell__color-swatch-container" style={{transform: "translateY(-50%)"}}>
				          			<circle key={variable} stroke={this.props.colorScale(variable)} fill={this.props.colorScale(variable)} cx="5" cy="5" r="4" className="legend__cell__color-swatch"></circle>
				          		</svg>
				          		<h5 className="legend__cell__label">{variable}</h5>
				          	</div>
			          	</li>
			          )
			        })}
				</ul>
			</div>
		)
	}
}
