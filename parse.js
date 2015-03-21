'use strict';

var Parser = require('./parser');
var JsonShape = require('./shape-of-json');

module.exports = parse;

function parse(args, start, end) {
    var parser = new Parser(JsonShape);
    return parser.parse(args, start, end);
}
