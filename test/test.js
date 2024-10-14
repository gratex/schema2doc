/* jshint esversion: 6 */
const assert = require("assert");
const { globSync } = require("glob");
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

	it ("generic test", function() {
		
	})
});

describe("Load test files - check if not failing", function() {

    function unrollDataAsyncTask(done) {
        // fs, request whatever async here, callback or promise
        //glob("../../../15**/**/index.js", {
        const files = globSync("./input/*.json", {
            cwd: __dirname,
			dotRelative: true
        });

		done(null, files);
    }
    before(function(done) {
        this.timeout(2000);
        var addTest = this.test.parent.addTest.bind(this.test.parent);
        // call asynct task and generate tests
        unrollDataAsyncTask(function(err, datas) {
            datas.map(_it_test).forEach(addTest);
            done();
        });
    });
    // make at least on emethod, so before gets called
    it("Unroll Data shall exist", function(done) {
        unrollDataAsyncTask(function(err, datas) {
            assert(datas.length > 0);
            done();
        });
    });
    // then this will become many it() registered in before();
    function _it_test(mid) {
        return it(`schema: ${mid}`, function() {
            var schema = require(mid);
            
			assert.ok(toRaw(schema), 'raw transform should not fail');
			assert.ok(toCsv(schema), 'cvs transform should not fail')
			assert.ok(toHtml(schema), 'html transform should not fail')
        });
    }
});
