/*jshint esversion: 6 */
/*global module:true,JSON:true */
var string = require('./string');

var schemaProps = [ // name of props that are not used to gen output
	"type",
	"enum",
	"additionalProperties",
	"additionalItems",
	"required"
];

function isPlainObject(value) {
	return Object.prototype.toString.call(value) == "[object Object]";
}

// check if only primitives type
function checkIfPrimitive(typeArray) {
	return typeArray.every(function (item) {
		return typeof item != "object";
	});
}

module.exports = function (inputJson, templates, cssContent) {
	var stash = []; // save nodes (BFS algorithm)
	var content = []; // store whole content

	if (typeof inputJson == "string") {
		inputJson = JSON.parse(inputJson);
	}

	content.push(templates.rowHeader); // add header

	var next,
		identificator,
		locType;


	if (Array.isArray(inputJson.type)) {
		subSchemas(inputJson);

		next = stash.shift();
	} else {
		next = {
			path: "",
			value: inputJson
		};
	}

	while (next) {
		content = content.concat(generate(next.value, next.path, [], !true));
		next = stash.shift();
		/*jshint expr:true */
		next && content.push(templates.emptyRow); // if next iteration is required, insert empty row
	}

	return string.substitute(templates.main, [
		cssContent,
		content.join("")
	]);

	//-------------------------------------------------------------------------
	function subSchemas(schema, path, rows) {
		var locTypes = [];
		schema.type.forEach(function (item, index) {
			// check type in item type otherwise try to figure it out by type
			// type : [{..},{..}], ["string", {}], ["object", "array"]
			identificator = `{${(path||"")}[${getIdentifier(item, index, path)}]}`;
			locTypes.push(identificator);
			stash.push({
				path: identificator,
				value: item
			});
		});
		path || (path = ".");
		(rows || content).push(string.substitute(templates.row, {
			rqnn: "++", // required/nullable
			field: path, // path
			type: `${locTypes.join(",")}`, // type
			format: "", // format
			constraints: "",
			description: inputJson && inputJson.description || "" // description
		}));
		content.push(templates.emptyRow);
	}

	function generate(input, path, rows, isDef) {

		var name,
			localPath,
			type,
			required,
			nullable,
			hasEnum;

		// json schema draft #4, handle required prop
		if (input.required && Array.isArray(input.required)) {

			input.required.forEach(function (reqPropName) {
				this.properties[reqPropName] && (this.properties[reqPropName].required = true);
			}, input);
		}

		for (name in input) {
			if (typeof input[name] == "object" && (isDef || !~schemaProps.indexOf(name))) {
				type = input && input[name].type ? input[name].type : ""; // get type
				required = input && input[name].required;
				nullable = (type === "null" || (type.indexOf ? type.indexOf("null") != -1 : false));
				hasEnum = input && input[name]["enum"];
				type = typeof type === "object" && Array.isArray(type) && checkIfPrimitive(type) ? type.join() : type; // this is only printable version

				type || (type = input[name]["$ref"]);
				// set enum info, that type is defined by enum
				hasEnum && (type = (type || "") + "(enum)");

				if (name !== "items" && name !== "properties") {
					if (type && type.toString().match(/\[object Object\]/g)) { // if type is still object, stringify and let user to see contetn (should be $ref)
						if (Array.isArray(type)) {
							subSchemas(input[name], path + (path ? "." : "") + name, rows);
							continue;
						} else {
							type = JSON.stringify(type);
						}
					}


					localPath = (path !== "" ? path + "." : path) + name + (input.type == "array" ? "[*]" : "");
					//if (type !== "array") { // arrays are processed later (in next iteration)
					rows.push(string.substitute(templates.row, {
						rqnn: (required ? "+" : "-") + (!nullable ? "+" : "-"),
						field: type == "array" ? localPath + "[*]" : localPath,
						type: type == "array" ? "${0}" : type || "", // type will be replaced in next iteration
						format: input && input[name].format || "",
						constraints: _getConstraints(input[name], type),
						description: input && input[name].description || ""
					}));
					//}
				} else if (name == "items") {
					// TODO: distinguish between items:[] and items.type:[] please
					// tuple validation will be printed as [*].0, [*].1
					if (Array.isArray(type)) {
						var identifierItem;
						var locTypes = [];
						/*jshint loopfunc:true*/
						type.forEach(function (item, index) {
							var typeOfItem = item.type || typeof item;
							if (typeOfItem == "object" || typeOfItem == "array") {
								identifierItem = `{${(path||"")}[${getIdentifier(item, index, path)}]}`;
								locTypes.push(identifierItem);
								stash.push({
									path: identifierItem,
									value: item
								}); // stash nested properties (heterogenous array)
							} else {
								locTypes.push(typeOfItem);
							}
						});
						locType = `${locTypes.join(",")}`;
					} else {
						locType = input[name].type || (util.isArray(input[name]) ? "array" : typeof input[name]);
					}

					localPath = path + "[*]";
					if (path === "" || !rows.length) {
						rows.push(string.substitute(templates.row, {
							rqnn: (required ? "+" : "-") + (!nullable ? "+" : "-"),
							field: localPath,
							type: locType,
							format: "", // format
							constraints: "",
							description: input && input[name].description || ""
						}));
					} else {
						var locRowString = rows.pop();
						rows.push(string.substitute(locRowString, [
							locType
						]));
					}
				} else {
					localPath = path;
				}
				generate(input[name], localPath, rows, name == "items" ? false : !isDef);
			}
		}
		return rows;
	}
};

function _getConstraints(object) {
	var constraints = "";

	var props = [{
		label: "length",
		base: "Length"
	}, {
		label: "no. items",
		base: "Items"
	}, {
		label: "interval",
		base: "imum"
	}];

	var min,
		max;
	props.forEach(function (d) {
		min = object["min" + d.base];
		max = object["max" + d.base];
		if (min != null || max != null) {
			constraints !== "" && (constraints += "\n");
			constraints += (d.label + ": <" + (min == null ? "0" : min) + "," + (max == null ? "*" : max) + ">");
		}
	});

	if (object.pattern) {
		constraints !== "" && (constraints += "\n");
		constraints += 'pattern: ' + object.pattern;
	}

	return constraints;
}

function getIdentifier(item, index, path) {
	var identitfier = index;
	if (isPlainObject(item) && item.properties) {
		var key = Object.keys(item.properties).filter(function(k) {
			return "enum" in item.properties[k];
		})[0];

		// subschema can be identified by enum value
		if (key) {
			if (!Array.isArray(item.properties[key].enum)) {
				throw new Error(`Enum must be an array: ${path}.${index}.${key}`);
			}
			identitfier = `${key}=${item.properties[key].enum.join(",")}`;	
		}
	}
	return identitfier;
}
