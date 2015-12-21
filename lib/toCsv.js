var templates = {
	main : "sep=;\r\n${1}",
	row : "${0};${1};${2};${3};${4}\r\n",
	emptyRow : ";;;;\r\n",
	rowHeader : "RQ/NN;Field;Type;Format;Desc\r\n"
};
var cssContent; //not used in csv

module.exports = function(inputJson, generate) {
	return generate(inputJson, templates, cssContent);
};