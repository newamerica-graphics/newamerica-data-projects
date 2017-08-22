import React from 'react';

export default function LayoutSelector({ layouts, currSelected, layoutChangeFunc }) {
	return (
		<ul className="layout-selector">
			{ layouts.map((layoutSettings) => {
				return <li className="layout-selector__option" onClick={() => { return layoutChangeFunc(layoutSettings) }}>{layoutSettings.label}</li>
			})}
		</ul>
	)
}