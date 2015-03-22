"use strict";

var Parser = require("../parser");
var tests = require("./parsers");
var tape = require("tape");

Object.keys(tests).forEach(function (name) {
    var test = tests[name];
    if (!test.error) {
        tape(name, function t(assert) {
            var parser = new Parser(test.parser);
            var expected = test.output;
            var actual = parser.parse(test.input);
            assert.deepEquals(actual, expected);
            assert.end();
        });
    } else {
        tape(name, function t(assert) {
            var erred = false;
            var parser = new Parser(test.parser);
            parser.handleError = function (message) {
                assert.equals(message, test.error, 'error message');
                assert.equals(this.index, test.index, 'error at expected index');
                erred = true;
                return {parse: function () {return this;}};
            };
            parser.parse(test.input);
            assert.ok(erred, 'should be an error');
            assert.end();
        });
    }
});
