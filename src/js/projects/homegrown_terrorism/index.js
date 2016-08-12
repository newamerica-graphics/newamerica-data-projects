import $ from 'jquery';
import { usStatesMap } from "../../components/us_states_map.js"
import { dotMatrix } from "../../components/dot_matrix.js"


export class HomegrownTerrorism {
	constructor() {
		let dataUrl = "https://na-data-projects.s3.amazonaws.com/data/isp/homegrown.json"
		this.id = "#test1";
		// this.usMap = new usStatesMap(this.id, width);
		// this.usMap.initialRender();
		this.dotMatrix = new dotMatrix(dataUrl, this.id, "field_citizenship", "categorical");
		this.dotMatrix.initialRender();
		window.addEventListener('resize', this.update.bind(this));
	}

	update() {
		let w = $(this.id).width();
		// this.usMap.updateDimensions(w);
		this.dotMatrix.resize(w);
	}
}

let homegrown = new HomegrownTerrorism();

