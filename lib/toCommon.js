var util = require('util');
var string = require('./string');

var schemaProps = [ // name of props that are not used to gen output
	"type",
	"enum",
	"additionalProperties",
	"required"
]; 

module.exports = function(inputJson, templates, cssContent) {
	var counter = 0, // increment for object in heterogenous arrays
	stash = [], // save nodes (BFS algorithm)
	content = []; // store whole content

	if (typeof inputJson == "string") {
		inputJson = JSON.parse(inputJson);
	}

	content.push(templates.rowHeader); // add header

	var next, identificator, locType;
	if (util.isArray(inputJson.type)) {
		locType = "{ ";
		inputJson.type.forEach(function(item) {
			identificator = (item.type || (typeof item)) + (counter++);
			locType += (identificator + " ");
			stash.push({
				path : identificator,
				value : item
			});
		});

		var path = ".";
		content.push(string.substitute(templates.row, [
			"++", // required/nullable
			path, // path
			locType + "}", // type
			"", // format
			inputJson && inputJson.description || "" // description
		]));
		content.push(templates.emptyRow);

		next = stash.shift();
	} else {
		next = {
			path : "",
			value : inputJson
		};
	}

	while (next) {
		content = content.concat(generate(next.value, next.path, []));
		next = stash.shift();
		/*jshint expr:true */
		next && content.push(templates.emptyRow); // if next iteration is required, insert empty row
	}

	return string.substitute(templates.main, [
		cssContent,
		content.join("")
	]);

	//-------------------------------------------------------------------------
	function generate(input, path, rows) {
		// check if only primitives type
		function checkIfPrimitive(typeArray) {
			return typeArray.every(function(item) {
				return typeof item != "object";
			});
		}

		var name, localPath, type, required, nullable;

		// json schema draft #4, handle required prop
		if (input.required) {
			input.required.forEach(function(reqPropName) {
				this.properties[reqPropName] && (this.properties[reqPropName].required = true);
			}, input);
		}

		for (name in input) {
			if (typeof input[name] == "object" && !~schemaProps.indexOf(name)) {
				type = input && input[name].type ? input[name].type : ""; // get type
				required = input && input[name].required;
				nullable = (type === "null" || type.indexOf("null") != -1);
				type = typeof type === "object" && util.isArray(type) && checkIfPrimitive(type) ? type.join() : type; // this is only printable version

				type || (type = input[name]["$ref"]);

				if (name !== "items" && name !== "properties") {
					if (type.toString().match(/\[object Object\]/g)) { // if type is still object, stringify and let user to see contetn (should be $ref)
						type = JSON.stringify(type);
					}
					localPath = (path !== "" ? path + "." : path) + name + (input.type == "array" ? "[*]" : "");
					//if (type !== "array") { // arrays are processed later (in next iteration)
					rows.push(string.substitute(templates.row, [
						(required ? "+" : "-") + (!nullable ? "+" : "-"),
						type == "array" ? localPath + "[*]" : localPath,
						type == "array" ? "${0}" : type || "", // type will be replaced in next iteration
						input && input[name].format || "",
						input && input[name].description || ""
					]));
					//}
				} else if (name == "items") {
					var locType = "array of ";
					if (util.isArray(type)) {
						var identifierItem;
						locType += "[";
						/*jshint loopfunc:true*/
						type.forEach(function(item) {
							var typeOfItem = item.type || typeof item;
							if (typeOfItem == "object" || typeOfItem == "array") {
								identifierItem = typeOfItem + (counter++) + "";
								locType += (" " + identifierItem);
								stash.push({
									path : identifierItem,
									value : item
								}); // stash nested properties (heterogenous array)
							} else {
								locType += (" " + typeOfItem);
							}
						});
						locType += "]";
					} else {
						locType += input[name].type || typeof input[name];
					}

					localPath = path + "[*]";
					if (path === "" || !rows.length) {
						rows.push(string.substitute(templates.row, [
							(required ? "+" : "-") + (!nullable ? "+" : "-"),
							localPath,
							locType,
							"", // format
							input && input[name].description || ""
						]));
					} else {
						var locRowString = rows.pop();
						rows.push(string.substitute(locRowString, [
							locType
						]));
					}
				} else {
					localPath = path;
				}
				generate(input[name], localPath, rows);
			}
		}
		return rows;
	}
};