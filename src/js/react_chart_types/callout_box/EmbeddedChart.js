import React from 'react';

import DotChart from "../dot_chart/DotChart.js";

class EmbeddedChart extends React.Component {
	constructor(props) {
		super(props);

	}
	
	render() {
		return <DotChart vizSettings={this.props.chartSettings} data={this.props.fullDataObject} />
	}
}


export default EmbeddedChart;

