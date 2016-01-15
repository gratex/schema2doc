/*jshint laxbreak:true*/

var helpers = require("./helpers");
var string = require("./string")

var cssContent = "table,th,td {	margin: 0;	padding: 0;	border: 1px solid black;border-collapse: collapse;}" + "table table {width: 100%;border: 0;}"
			+ "td {vertical-align:top;}" + "td.name {font-weight:bold;color: blue;	width: 150px;}";

function wrapToTag(tagName, str) {
	return string.substitute("<${0}>${1}</${0}>", [tagName, str]);
}

function _buildTemplates(options) {
	var columns = options.columns;
	var keys = Object.keys(columns);

	return {
		main : "<html><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>" + "<head><style type='text/css'>${0}</style></head>"
			+ "<body><table>${1}</table></body></html>",
		row : wrapToTag("tr", keys.map(helpers.wrapSubstitute).map(wrapToTag.bind(null, "td")).join("")),
		emptyRow : string.substitute("<tr><td colspan='${0}' style='text-align:center'>-</td></tr>", [keys.length]),
		rowHeader : wrapToTag("tr", helpers.objectValues(columns).map(wrapToTag.bind(null, "th")).join(""))
	};
}


module.exports = function(options) { 
	var templates = _buildTemplates(options);
	return function(inputJson, generate) {
		return generate(inputJson, templates, cssContent);
	};
}
