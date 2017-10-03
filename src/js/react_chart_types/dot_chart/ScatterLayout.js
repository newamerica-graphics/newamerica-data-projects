import React from 'react';

import { colors } from "../../helper_functions/colors.js";

import { formatValue } from "../../helper_functions/format_value.js";
import {spring} from "react-motion";

const d3 = require("d3");

class ScatterLayout {
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}

	resize(width, height) {
		this.width = width;
		this.height = height;
	}

	renderDot(d, i) {
		return {x: spring(Math.random()*this.width), y: spring(Math.random()*this.height), r:5 }
	}
}

export default ScatterLayout;