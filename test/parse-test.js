"use strict";

var parse = require("../parse");
var Parser = require("../parser");
var JsonShape = require("../shape-of-json");
var language = require("./language");
var tape = require("tape");

language.forEach(function (test) {
    if (!test.error) {
        tape(test.input.join(" "), function t(assert) {
            var expected = test.output;
            var actual = parse(test.input);
            assert.deepEquals(actual, expected);
            assert.end();
        });
    } else {
        tape(test.input.join(" "), function t(assert) {
            var parser = new Parser(JsonShape);
            var erred = false;
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
