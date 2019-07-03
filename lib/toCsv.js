var helpers = require("./helpers");

function _buildTemplates(options) {
	var columns = options.columns;
	var keys = Object.keys(columns);

	return {
		main: "sep=;\r\n${1}",
		row: keys.map(helpers.wrapSubstitute).join(";") + "\r\n",
		emptyRow: helpers.emptyArray(keys.length).join(";") + "\r\n",
		rowHeader: helpers.objectValues(columns).join(";") + "\r\n"
	};
}

var cssContent; //not used in csv

module.exports = function (options) {
	var templates = _buildTemplates(options);
	return function (inputJson, generate) {
		return generate(inputJson, templates, cssContent);
	};
};
