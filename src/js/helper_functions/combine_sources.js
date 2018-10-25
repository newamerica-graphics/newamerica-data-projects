const combineSources = (sourceArray) => {
	let retString = "";

	for (let i = 0; i < sourceArray.length; i+=2) {

		if (sourceArray[i] && sourceArray[i+1]) {
			retString += i > 0 ? ", " : ""
			retString += "<a href='" + sourceArray[i] + "'>" + sourceArray[i+1] + "</a>"
		}
	}
	return retString;
}

module.exports = {
	combineSources: combineSources
}
