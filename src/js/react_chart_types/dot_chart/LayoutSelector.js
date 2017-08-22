import React from 'react';

export default function LayoutSelector({ layouts, currSelected, layoutChangeFunc }) {
	return (
		<ul className="dot-chart__layout-selector">
			{ layouts.map((layoutSettings) => {
				let classList = "dot-chart__layout-selector__option";
				classList += layoutSettings.layout == currSelected.layout ? " active" : ""

				return <li className={classList} onClick={() => { return layoutChangeFunc(layoutSettings) }}>{layoutSettings.label}</li>
			})}
		</ul>
	)
}