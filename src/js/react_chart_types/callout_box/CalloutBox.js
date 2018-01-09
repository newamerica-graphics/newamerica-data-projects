import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";

import CalloutBoxDataElement from './CalloutBoxDataElement.js';

const d3 = require("d3");

class CalloutBox extends React.Component {
	constructor(props) {
		super(props);
		console.log(props);

		this.data = props.data[props.vizSettings.primaryDataSheet];
		console.log(this.data)
		if (props.vizSettings.secondaryDataSheets) {
			props.vizSettings.secondaryDataSheets.forEach((d) => {
				console.log(d)
				this.data = [...this.data, ...props.data[d]];
			})
		}
		console.log(this.data)
		this.resizeFunc = this.resize.bind(this);

		if (props.vizSettings.filterInitialDataFunction) {
			this.data = this.data.filter(props.vizSettings.filterInitialDataFunction)[0]
			console.log(this.data)
		}

		this.state = {
			width: 1000
		}

	}

	componentDidMount() {
		$(window).resize(this.resizeFunc);

		this.resize()
	}

	getCurrWidth() {
        return $(this.refs.renderingArea).width();
    }

	renderSection(sectionSettings, i) {
		return (
			<div className="callout-box__section" key={i}>
				{sectionSettings.title && <h3 className="callout-box__section__title">{sectionSettings.title}</h3>}
				<div className={"callout-box__section__content children-" + sectionSettings.dataElements.length }>
					{ sectionSettings.dataElements.map((dataElementSettings, i) => {
						console.log(dataElementSettings)
						return <CalloutBoxDataElement settings={dataElementSettings} data={this.data} fullDataObject={this.props.data} key={i} />
					})}
				</div>
			</div>
		)
	}

	render() {
		const {vizSettings} = this.props

		return (
			<div className={"callout-box " + vizSettings.backgroundColor} ref="renderingArea">
				{vizSettings.columns.map(columnSettings => {
					console.log(columnSettings.fullWidthBreakpoint, this.state.width)
					let classList = "callout-box__column"
					if (columnSettings.fullWidthBreakpoint && this.state.width <= columnSettings.fullWidthBreakpoint) {
						classList += " full-width";
					}
					return (
						<div className={classList} style={{width: columnSettings.width}}>
							{ columnSettings.sections.map((sectionSettings, i) => this.renderSection(sectionSettings, i)) }
						</div>
					)
				})}
			</div>
		)
	}

	resize() {
        let w = this.getCurrWidth();

        console.log(w)

        this.setState({
          width: w,
        })
    }
}

export default CalloutBox;