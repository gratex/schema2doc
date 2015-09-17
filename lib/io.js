/*global process:true */
//(function muteConsole() {
//	// consumes console output, so it won't not pollute output
//	var calls = [
//		"log",
//		"info",
//		"debug",
//		"warn",
//		"error"
//	];
//	var f = function() {
//		// redirect console functions into error stream
//		//process.stderr.write(Array.prototype.join.call(arguments, ", ") + "\n");
//	};
//	for ( var i = 0; i < calls.length; i++) {
//		console[calls[i]] = f;
//	}
//})();

define([
	"dojo/Deferred"
], function(Deferred) {

	function getArgs() {
		// flatten array of arrays from cmdline 
		var args = [].concat.apply([], require.rawConfig.commandLineArgs.slice(2));
		return args;
	}

	function parseOptions() {
		// returns map of keys (converted values) and other arguments
		//		commnand --option1=value1 --option2=value2
		// will return
		//		{
		//			option1: "value1",
		//			option2: "value2",
		//			args: [ /*other arguments*/ ]
		//		}
		var args = getArgs();
		if (!args || !args.length) {
			return {};
		}
		var k, v, i, l, map = {
			args : []
		};
		for (i = 0, l = args.length; i < l; i += 2) {
			k = args[i];
			v = args[i + 1];
			if (_isOption(k)) {
				k = k.substring(2);
				if (!isNaN(+v) && typeof +v === "number") {
					map[k] = +v; //number
				} else {
					map[k] = _convertValue(v); //autoconverter
				}
			} else {
				i--; //must rewind back
				map.args.push(k); //argument
			}
		}
		return map;
		function _isOption(str) {
			//option has leading '--'
			return str.indexOf("--") === 0;
		}
		function _convertValue(v) {
			var autoConverted = {
				"true" : true,
				"false" : false,
				"null" : null,
				"undefined" : undefined,
				"Infinity" : Infinity,
				"-Infinity" : -Infinity
			};
			return (v in autoConverted) ? autoConverted[v] : v;
		}
	}

	function getInputStream() {
		var d = new Deferred();
		var stream = process.stdin;
		var buff = "";
		stream.setEncoding('utf8');
		stream.resume();
		stream.on("data", function(chunk) {
			buff += chunk;
		});
		stream.on("end", function() {
			d.resolve(buff);
		});
		return d;
	}

	function writeOut(str) {
		process.stdout.write(str + "\n");
	}

	function writeErr(str) {
		process.stderr.write('\x1B[31m' + str + '\x1B[39m\n'); // print in red color (inspired by node module color)
	}

	return {
		getInputStream : getInputStream,
		getArgs : getArgs,
		parseOptions : parseOptions,
		writeOut : writeOut,
		writeErr : writeErr
	};
});