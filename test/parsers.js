'use strict';

var StringParser = require('../string');
var ArrayParser = require('../array');
var ArgonInlineParser = require("../argon-inline");
var OptionalParser = require('../optional');
var CommandParser = require('../command');
var FlagParser = require('../flag');
var NamedParser = require('../named');
var ChainParser = require('../chain');
var IntParser = require('../int');
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

    'argon inline object': {
        parser: new ArgonInlineParser(),
        input: ['--a', '10', '--b', '[', '20', '30', '40', ']'],
        output: {a: 10, b: [20, 30, 40]}
    },

    'array of one argon inline object': {
        parser: new ArrayParser(new ArgonInlineParser()),
        input: ['--a', '10', '--b', '[', '20', '30', '40', ']'],
        output: [{a: 10, b: [20, 30, 40]}]
    },

    'array of two argon inline objects': {
        parser: new ArrayParser(new ArgonInlineParser()),
        input: ['--a', '10', '--b', '[', '20', '30', '40', ']', '--', '--a', '10'],
        output: [{a: 10, b: [20, 30, 40]}, {a: 10}]
    },

    'empty array of argon inline objects': {
        parser: new ArrayParser(new ArgonInlineParser()),
        input: [],
        output: []
    },

    'array of argon single empty argon object': {
        parser: new ArrayParser(new ArgonInlineParser()),
        input: ['--'],
        output: [{}]
    },

    'chain parser': {
        parser: new ChainParser([
            new NamedParser('a', new IntParser()),
            new NamedParser('b', new IntParser()),
            new NamedParser('c', new IntParser()),
        ]),
        input: ['10', '20', '30'],
        output: {
            options: {
                a: 10,
                b: 20,
                c: 30
            },
            arguments: []
        }
    },

};
