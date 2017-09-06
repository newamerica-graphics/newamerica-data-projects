import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";

let Select = require('react-select');

const d3 = require("d3");

class HistogramAnnotations extends React.Component {
	constructor(props) {
		super(props)
		console.log(props)

		let annotationPositions = []

		this.sortedData = props.data.sort((a, b) => { return new Date(a.date) - new Date(b.date)})
	}

	componentDidMount() {
		console.log(this.refs)
		this.forceUpdate()
	}

	componentWillUpdate(nextProps) {
		console.log(this.refs)
		this.setAnnotationPositions(nextProps)

	}

	setAnnotationPositions({ scale, width }) {
		console.log("setting positions")

		let startXPos, endXPos, yIndex;
		this.rows = [];
		this.rows[0] = [];

		this.sortedData.map((d, i) => {
			let textElem = this.refs[i];
			let textBounds = textElem.getBBox();
			console.log(textBounds)
			startXPos = scale(new Date(d.date)) - textBounds.width/2
			endXPos = startXPos + textBounds.width;

			if (endXPos > width) {
				startXPos = width - textBounds.width;
				endXPos = width;
			}

			d.yPos = 20 * this.calcYIndex(startXPos, endXPos) + 10;
			d.startXPos = startXPos;

			return d;
		})

		this.height = this.rows.length * 20 + 10;
	}

	calcYIndex(startXPos, endXPos) {	
		let i = 0;

		for (let row of this.rows) {
			let foundOverlap = false;
			// loop through all intervals stored within row
			for (let rowInterval of row) {
				// check if start or end position overlaps with interval
				if ((startXPos >= rowInterval.start && startXPos <= rowInterval.end) || 
					(endXPos >= rowInterval.start && endXPos <= rowInterval.end)) {
					// if overlap, breaks loop, moves to next row
					foundOverlap = true;
					break;
				}
			}
			// no overlap found, adding to current row
			if (!foundOverlap) {
				row.push({start:startXPos, end:endXPos});
				return i;
			}
			i++;
		}
		// could not place in current rows, adding new row
		this.rows.push([{start:startXPos, end:endXPos}]);
		return i;
	}

	renderAnnotationText(d, i) {
		let xPos = d.startXPos || 0,
			yPos = d.yPos + 10 || 0
		console.log(d)

		return (
			<text className="dot-chart__histogram-annotation__text" ref={i} x={xPos} y={yPos}>{d.text}</text>
		)
	}

	renderAnnotationLine(d) {
		const { scale } = this.props;

		let xPos = scale(new Date(d.date)),
			yPos = d.yPos || 0
		console.log(d)

		return (
			<line className="dot-chart__histogram-annotation__line" x1={xPos} x2={xPos} y1="0" y2={yPos} />
		)
	}

	render() {
		const { data } = this.props;

		
		return (
			<svg width="100%" height={this.height} transform="translate(0, -10)">
				{this.sortedData.map((d, i) => this.renderAnnotationText(d, i))}
				{this.sortedData.map((d, i) => this.renderAnnotationLine(d, i))}
			</svg>
		)
	}
}

export default HistogramAnnotations;