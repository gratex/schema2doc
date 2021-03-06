var helpers = require("./helpers");

var cssContent; //not used in raw

function _buildTemplates(options) {
	var columns = options.columns;
	var keys = Object.keys(columns);

	return {
		main: "${1}",
		row: keys.map(helpers.wrapSubstitute).join("\t") + "\r\n",
		emptyRow: (helpers.emptyArray(keys.length)).join("\t") + "\r\n",
		rowHeader: helpers.objectValues(columns).join("\t") + "\r\n" + //
			(helpers.emptyArray(keys.length)).map(function () {
				return "------";
			}).join("\t") + "\r\n"
	};
}

module.exports = function (options) {
	var templates = _buildTemplates(options);

	return function (inputJson, generate) {
		return generate(inputJson, templates, cssContent);
	};
};
