import React from 'react';
var d3 = require("d3");
import { formatValue } from "../../helper_functions/format_value.js";

export default function Tooltip(props) {
	let styleObject, tooltipTitle;
	if (props.settings) {
		const {datum, tooltipVars, x, y, title, renderingAreaWidth} = props.settings
		styleObject = {
			display: "block",
			top: y + "px"
		};

		if (x < (renderingAreaWidth - 300)) {
			styleObject.left = (x + 10) + "px";
		} else {
			styleObject.right = (renderingAreaWidth - x + 10) + "px";
		}

		tooltipTitle = title;
	} else {
		styleObject = {
			display: "none"
		};
	}
	return (
		<div className="tooltip" style={styleObject}>

		{ props.settings &&
			<div className="tooltip__content-container">
				<div className="tooltip__title-container">
					<h1 className="tooltip__title">{tooltipTitle}</h1>
				</div>
				<div className="tooltip__category">
					<ul className="tooltip__category__val-list">
						{ props.settings.tooltipVars.map((varSettings) => { return renderVal(props.settings.datum, varSettings); })}
					</ul>
				</div>
			</div>
		}
		</div>
	)
}

function renderVal(datum, varSettings) {
	let dataVal = datum[varSettings.variable];
	let formattedValue;

	if (dataVal) {
		if (varSettings.format == "link") {
			formattedValue =  <h3 className="tooltip__category__list-item__value" dangerouslySetInnerHTML={{__html:dataVal}}></h3>
		} else {
			formattedValue = <h3 className="tooltip__category__list-item__value">{ formatValue(dataVal, varSettings.format) }</h3>
		}

		return (
			<li className="tooltip__category__list-item" key={varSettings.variable}>
				{/*<svg className="tooltip__color-swatch-container">
					<circle className="tooltip__color-swatch" cx="4" cy="4" r="4" style={{fill:"green"}}></circle>
				</svg>*/}
				<h3 className="tooltip__category__list-item__label">{ varSettings.displayName }:</h3>
				{formattedValue}
			</li>
		)
	}
}