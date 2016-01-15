var assert = require("assert");
var fs = require("fs");

var options = {
	columns : {
		rqnn: "RQ/NN",
		field: "Field",
		type: "Type",
		format: "Format",
		description:  "Desc",
	}
}

var toCommon = require('../lib/toCommon'); // contains processing of schema
var toCsv = require('../lib/toCsv')(options);
var toHtml = require('../lib/toHtml')(options);
var toRaw = require('../lib/toRaw')(options);

var simpleSchema = fs.readFileSync("./test/input/in.schema.json", "utf8");
var csvSimpleOut = fs.readFileSync("./test/input/out.csv", "utf8");
var htmlSimpleOut = fs.readFileSync("./test/input/out.html", "utf8");;
var rawSimpleOut = fs.readFileSync("./test/input/out.raw", "utf8");;

describe("schema2doc", function() {
	it("to csv format", function() {
		assert.equal(toCsv(simpleSchema, toCommon).trim(), csvSimpleOut.trim(), "Csv format doesnt match with expected format");
	});

	it("to html format", function() {
		assert.equal(toHtml(simpleSchema, toCommon).trim(), htmlSimpleOut.trim(), "Html format doesnt match with expected format");
	});

	it("to raw format", function() {
		assert.equal(toRaw(simpleSchema, toCommon).trim(), rawSimpleOut.trim(), "Raw format doesnt match with expected format");
	});
});
