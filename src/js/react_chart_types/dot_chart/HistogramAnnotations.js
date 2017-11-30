import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";

let Select = require('react-select');

const d3 = require("d3");

const innerPadding = 5,
	outerPadding = 2;

class HistogramAnnotations extends React.Component {
	constructor(props) {
		super(props)
		console.log(props)

		let annotationPositions = []

		this.sortedData = props.data.sort((a, b) => { return new Date(a.date) - new Date(b.date)})
	
		this.initialRender =

		this.state = {
			currHovered: null
		}
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

		let scaledXVal, startXPos, endXPos, yIndex;
		this.rows = [];
		this.rows[0] = [];

		console.log(scale.domain(), scale.range())

		this.sortedData.map((d, i) => {
			let textElem = this.refs[i];
			let textBounds = textElem.getBBox();
			if (this.props.isYearMonth) {
				scaledXVal = scale(d.year_month)
			} else {
				scaledXVal = scale(new Date(d.date))
			}

			startXPos = scaledXVal - textBounds.width/2 - innerPadding
			if (startXPos < 0) {
				startXPos = 0
			}
			endXPos = startXPos + textBounds.width + 2*innerPadding;

			console.log(endXPos, width)

			if (endXPos > width) {
				startXPos = width - textBounds.width - 2*innerPadding;
				endXPos = width;
			}

			console.log(d)
			console.log(this.rows)
			console.log(startXPos, endXPos)

			let yIndex = this.calcYIndex(startXPos, endXPos)

			console.log(yIndex)

			d.yPos = 25 * yIndex + 10;
			d.startXPos = startXPos;
			d.endXPos = endXPos;

			return d;
		})

		this.height = this.rows.length * 25 + 10;
	}

	calcYIndex(startXPos, endXPos) {	
		let i = 0;

		for (let row of this.rows) {
			let foundOverlap = false;
			// loop through all intervals stored within row
			for (let rowInterval of row) {
				// check if start or end position overlaps with interval
				if ((startXPos >= rowInterval.start && startXPos <= rowInterval.end) || 
					(endXPos >= rowInterval.start && endXPos <= rowInterval.end) ||
					(startXPos <= rowInterval.start)) {
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
		// if (!d.startXPos || !d.yPos) { 
		// 	return <text className="dot-chart__histogram-annotation__text" ref={i}></text>; 
		// }
		let startXPos = d.startXPos || 0,
			endXPos = d.endXPos || 0,
			yPos = d.yPos || 0

		let className = "dot-chart__histogram-annotation__container"
		className += this.state.currHovered === i ? " active" : "";

		return (
			<g className={className} onMouseEnter={() => this.mouseEnter(i)} onMouseLeave={() => this.mouseLeave()} >
				<rect className="dot-chart__histogram-annotation__box" x={startXPos} width={endXPos - startXPos} y={yPos} height={20} />
				<text className="dot-chart__histogram-annotation__text" ref={i} x={startXPos + innerPadding} y={yPos + 14}>{d.text}</text>
			</g>
		)
	}

	renderAnnotationLine(d, i) {
		// if (!d.startXPos || !d.yPos) { 
		// 	return <line className="dot-chart__histogram-annotation__line" />; 
		// }
		const { scale } = this.props;

		let xPos,
			yPos = d.yPos || 0

		if (this.props.isYearMonth) {
			xPos = scale(d.year_month)
		} else {
			xPos = scale(new Date(d.date))
		}
		console.log(d)

		let className = "dot-chart__histogram-annotation__line"
		className += this.state.currHovered === i ? " active" : "";

		return (
			<line className={className} x1={xPos} x2={xPos} y1="0" y2={yPos} />
		)
	}

	render() {
		const { data } = this.props;

		
		return (
			<svg width="100%" height={this.height} transform="translate(0, -12)">
				{this.sortedData.map((d, i) => this.renderAnnotationLine(d, i))}
				{this.sortedData.map((d, i) => this.renderAnnotationText(d, i))}
			</svg>
		)
	}

	mouseEnter(index) {
		this.setState({
			currHovered: index
		})
	}

	mouseLeave() {
		this.setState({
			currHovered: null
		})
	}
}

export default HistogramAnnotations;