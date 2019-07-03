/* jshint esversion: 6 */
const assert = require("assert");
const fs = require("fs");
const endOfLine = require('os').EOL;

const { toCsv, toHtml, toRaw} = require('../lib/index');

const simpleSchema = fs.readFileSync("./test/input/in.schema.json", "utf8");
const csvSimpleOut = fs.readFileSync("./test/input/out.csv", "utf8");
const htmlSimpleOut = fs.readFileSync("./test/input/out.html", "utf8");
const rawSimpleOut = fs.readFileSync("./test/input/out.raw", "utf8");

describe("schema2doc", function() {
	it("to csv format", function() {
		assert.equal(toCsv(simpleSchema).trim().replace(/\r\n/g,endOfLine), csvSimpleOut.trim(), "Csv format doesnt match with expected format");
	});

	it("to html format", function() {
		assert.equal(toHtml(simpleSchema).trim().replace(/\r\n/g,endOfLine), htmlSimpleOut.trim(), "Html format doesnt match with expected format");
	});

	it("to raw format", function() {
		assert.equal(toRaw(simpleSchema).trim().replace(/\r\n/g,endOfLine), rawSimpleOut.trim(), "Raw format doesnt match with expected format");
	});
});
