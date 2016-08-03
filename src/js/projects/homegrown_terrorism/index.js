import $ from 'jquery';
import { usStatesMap } from "../../components/us_states_map.js"

export class HomegrownTerrorism {
	constructor() {
		console.log($("#test1"));
		var usMap = new usStatesMap("#test1");
		usMap.initialRender();
		$("#test1").append("This is the visualization!");
	}
}
console.log("hello!");
new HomegrownTerrorism();