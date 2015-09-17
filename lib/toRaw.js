define([], function() {
	var templates = {
		main : "${1}",
		row : "${0}\t${1}\t${2}\t${3}\t${4}\r\n",
		emptyRow : "\t\t\t\t\r\n",
		rowHeader : "RQ/NN\tField\tType\tFormat\tDesc\r\n------\t------\t------\t------\t------\r\n"
	};
	var cssContent; //not used in raw

	return function(inputJson, generate) {
		return generate(inputJson, templates, cssContent);
	};
});