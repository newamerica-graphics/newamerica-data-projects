import $ from 'jquery';

let d3 = require("d3");

var fs = require('fs');

import { colors } from "../helper_functions/colors.js";

// require.extensions['.svg'] = function (module, filename) {
//     module.exports = fs.readFileSync(filename, 'utf8');
// };

export class InteractiveSvg {
	constructor(vizSettings) {
		Object.assign(this, vizSettings)

		d3.select(this.id).html(this.svg)

		this.attachLinks();
	}

	attachLinks() {
		this.linkList.forEach(d => {
			$(d.id).click(() => { console.log("clicked!"); window.location.href = d.url; })
		})
	}

	render() {

	}
}