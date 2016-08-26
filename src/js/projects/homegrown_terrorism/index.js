// require('../../../scss/index.scss');

// import $ from 'jquery';
// import { usStatesMap } from "../../components/us_states_map.js";
// import { dotMatrix } from "../../components/dot_matrix.js";



// export class HomegrownTerrorism {
// 	constructor() {
// 		let dataUrl = "https://na-data-projects.s3.amazonaws.com/data/isp/homegrown.json"
// 		// let dataUrl = "https://na-data-projects.s3.amazonaws.com/data/test/ag.json";
// 		this.id = "#test1";
// 		// this.usMap = new usStatesMap(dataUrl, this.id);
// 		// this.usMap.initialRender();
// 		this.dotMatrix = new dotMatrix(dataUrl, this.id, "field_citizenship", "categorical", "full_name", ["field_age", "field_citizenship"]);
// 		this.dotMatrix.initialRender();
// 		window.addEventListener('resize', this.resize.bind(this));

// 		// $.get("http://data-projects.herokuapp.com/1wx-GeuiSCFm8g5iAy0HKb57jCS-h4xt_pfAR6cU-KvU/versions/s3://na-data-projects/data/isp/homegrown.json", function(d) {
// 		// 	console.log("success!");
// 		// });
// 	}

// 	resize() {
// 		let w = $(this.id).width();
// 		// this.usMap.resize(w);
// 		// this.usMap.changeFilter()
// 		this.dotMatrix.resize(w);
// 		this.dotMatrix.changeFilter("field_age", "categorical");
// 	}
// }

// let homegrown = new HomegrownTerrorism();

