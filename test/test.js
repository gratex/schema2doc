var assert = require("assert");
var fs = require("fs");


var toCommon = require('../lib/toCommon'); // contains processing of schema
var toCsv = require('../lib/toCsv');
var toHtml = require('../lib/toHtml');
var toRaw = require('../lib/toRaw');

var simpleSchema = fs.readFileSync("./test/input/in.schema.json", "UTF-8");
var csvSimpleOut = fs.readFileSync("./test/input/out.csv", "UTF-8");
var htmlSimpleOut = fs.readFileSync("./test/input/out.html", "UTF-8");;
var rawSimpleOut = fs.readFileSync("./test/input/out.raw", "UTF-8");;

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
