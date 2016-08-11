import $ from 'jquery';
import { usStatesMap } from "../../components/us_states_map.js"
import { dotMatrix } from "../../components/dot_matrix.js"


export class HomegrownTerrorism {
	constructor() {
		this.id = "#test1";
		// this.usMap = new usStatesMap(this.id, width);
		// this.usMap.initialRender();
		this.dotMatrix = new dotMatrix(this.id, "field_age", "linear");
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

