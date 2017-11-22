import $ from 'jquery';

let d3 = require("d3");

export class Trendline {
	constructor(renderingArea, filterVars) {
		this.filterVar = filterVars[0].variable;
		this.trendline = renderingArea
			.append("line")
			.attr("class", "trendline");
	}

	render(data, xScale, yScale) {
		this.xSeries = d3.range(0, data.length-1);
		this.ySeries = data.map((d) => { return Number(d[this.filterVar]); });
		
		this.leastSquaresCoeff = this.leastSquares();
		
		this.setLinePoints(xScale, yScale);
	}

	resize(xScale, yScale) {
		this.setLinePoints(xScale, yScale);
	}

	setLinePoints(xScale, yScale) {
		// apply the results of the least squares regression
		let y1 = this.leastSquaresCoeff[0] + this.leastSquaresCoeff[1];
		let y2 = this.leastSquaresCoeff[0] * this.xSeries.length + this.leastSquaresCoeff[1];
			
		this.trendline
			.attr("x1", xScale.range()[0])
			.attr("y1", yScale(y1))
			.attr("x2", xScale.range()[1])
			.attr("y2", yScale(y2));
	}

	leastSquares() {
		let reduceSumFunc = (prev, cur) => { return prev + cur; };
		
		let xBar = this.xSeries.reduce(reduceSumFunc) * 1.0 / this.xSeries.length;
		let yBar = this.ySeries.reduce(reduceSumFunc) * 1.0 / this.ySeries.length;

		let ssXX = this.xSeries.map((d) => { return Math.pow(d - xBar, 2); })
			.reduce(reduceSumFunc);
		
		let ssYY = this.ySeries.map((d) => { return Math.pow(d - yBar, 2); })
			.reduce(reduceSumFunc);
			
		let ssXY = this.xSeries.map((d, i) => { return (d - xBar) * (this.ySeries[i] - yBar); })
			.reduce(reduceSumFunc);
			
		let slope = ssXY / ssXX;
		let intercept = yBar - (xBar * slope);
		let rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
		
		return [slope, intercept, rSquare];
	}

}