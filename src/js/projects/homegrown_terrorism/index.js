import $ from 'jquery';
import { usStatesMap } from "../../components/us_states_map.js"
import { dotMatrix } from "../../components/dot_matrix.js"


export class HomegrownTerrorism {
	constructor() {
		this.id = "#test1";
		let width = $(this.id).width();
		// this.usMap = new usStatesMap(this.id, width);
		// this.usMap.initialRender();
		this.dotMatrix = new dotMatrix(this.id, width);
		this.dotMatrix.initialRender();
		window.addEventListener('resize', this.update.bind(this));
	}

	update() {
		let w = $(this.id).width();
		console.log(w);
		// this.usMap.updateDimensions(w);
		this.dotMatrix.updateDimensions(w);
	}
}

let homegrown = new HomegrownTerrorism();

