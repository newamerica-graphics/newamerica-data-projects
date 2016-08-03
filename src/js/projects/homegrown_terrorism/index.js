import $ from 'jquery';

export class HomegrownTerrorism {
	constructor() {
		console.log($("#test1"));
		$("#test1").append("This is the visualization!");
	}
}
console.log("hello!");
new HomegrownTerrorism();