define([
	"dojo/json",
	"dojo/node!fs",
	"dojo/when",
	"./io",
	"./toCommon", // contains processing of schema
	"./toCsv",
	"./toHtml",
	"./toRaw"
], function(json, fs, when, io, toCommon, toCsv, toHtml, toRaw) {

	function processInput(input) {
		
		function generate(/*callback */to, /*string*/ jsonInput, /*string?*/ file) {
			// to: function
			//		callback to toCsv, toHtml, toRaw
			// jsonInput : string
			//		input schema that will be processed
			// file : string?
			//		path where output file should be saved
			write(to(jsonInput, toCommon), file);
		}
		
		var args = io.getArgs();
		try {
			input = json.parse(input);
		} catch (e) {
			io.writeErr("ERROR: schema could not be parsed, please check schema");
			io.writeErr(e);
		}
		
		var param = args[0];
		var filePath = args[1];	
		if (param) {
			// process first arguments
			switch (param) {
			case 'c':
				generate(toCsv, input, filePath);
				break;
			case 'l':
				generate(toHtml, input, filePath);
				break;
			case 'r': 
				/*falls through*/
			default:
				generate(toRaw, input, filePath);
			}
		} else { // default is raw format		
			generate(toRaw, input, filePath);
		}
	}
	
	when(io.getInputStream()).then(processInput);

	function write(/*string*/ str, /*string?*/file) {
		// str : string
		//		processed schema, output depends on options (html, csv, raw)
		// file : string?
		//		if defined, try to save output to given file path, output is always print on stdout
		if(file) {
			try {
				fs.writeFile(file, str);
			} catch(e) {
				io.writeErr("Error: output could not be saved");
				io.writeErr(e);
			}
		}
		io.writeOut(str + "\n");
	}
});