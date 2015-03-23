'use strict';

var StringParser = require('../string');
var ArrayParser = require('../array');
var ArgonParser = require("../argon");
var OptionalParser = require('../optional');
var CommandParser = require('../command');
var FlagParser = require('../flag');
var NamedParser = require('../named');
var binArgonParser = require('../bin/argon').parser;

module.exports = {

    'string': {
        parser: new StringParser(),
        input: ['hello'],
        output: 'hello'
    },

    'missing string': {
        parser: new StringParser(),
        input: [],
        error: 'Expected string but got end of arguments',
        index: 0
    },

    'optional string (with)': {
        parser: new OptionalParser(new StringParser()),
        input: ['hello'],
        output: 'hello'
    },

    'optional string (without)': {
        parser: new OptionalParser(new StringParser()),
        input: [],
        output: null
    },

    'array of string': {
        parser: new ArrayParser(new StringParser()),
        input: ['hello', 'world'],
        output: ['hello', 'world']
    },

    'argon parser': {
        parser: binArgonParser,
        input: ['[', '--a', '10', ']', '-t', '2'],
        output: {
            arguments: [{a: 10}],
            tab: 2
        }
    },

    'argon parser --tab': {
        parser: binArgonParser,
        input: ['[', '--a', '10', ']', '--tab', '2'],
        output: {
            arguments: [{a: 10}],
            tab: 2
        }
    },

    'argon parser --tab=': {
        parser: binArgonParser,
        input: ['[', '--a', '10', ']', '--tab=2'],
        output: {
            arguments: [{a: 10}],
            tab: 2
        }
    },

    'argon parser --tab= invalid': {
        parser: binArgonParser,
        input: ['[', '--a', '10', ']', '--tab='],
        error: 'Expected integer',
        index: 4
    },

};
