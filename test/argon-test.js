"use strict";

var Parser = require("../parser");
var ArgonParser = require("../argon");
var argonTests = require("./argon");
var tape = require("tape");

argonTests.forEach(function (test) {
    if (!test.error) {
        tape(test.input.join(" "), function t(assert) {
            var parser = new Parser(new ArgonParser());
            var expected = test.output;
            var actual = parser.parse(test.input);
            assert.deepEquals(actual, expected);
            assert.end();
        });
    } else {
        tape(test.input.join(" "), function t(assert) {
            var erred = false;
            var parser = new Parser(new ArgonParser());
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
