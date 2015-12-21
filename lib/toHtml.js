/*jshint laxbreak:true*/
var cssContent = "table,th,td {	margin: 0;	padding: 0;	border: 1px solid black;border-collapse: collapse;}" + "table table {width: 100%;border: 0;}"
			+ "td {vertical-align:top;}" + "td.name {font-weight:bold;color: blue;	width: 150px;}";

// todo generate css
var templates = {
	main : "<html><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>" + "<head><style type='text/css'>${0}</style></head>"
			+ "<body><table>${1}</table></body></html>",
	row : "<tr><td class='name'>${0}</td><td>${1}</td><td>${2}</td><td>${3}</td><td>${4}</td></tr>",
	emptyRow : "<tr><td colspan='5' style='text-align:center'>-</td></tr>",
	rowHeader : "<tr><th>RQ/NN</th><th>Field</th><th>Type</th><th>Format</th><th>Desc</th></tr>"
};

module.exports = function(inputJson, generate) {
	return generate(inputJson, templates, cssContent);
};
