'use strict';

var StringParser = require('../string');
var ArrayParser = require('../array');
var ArgonParser = require("../argon");
var OptionalParser = require('../optional');
var CommandParser = require('../command');
var FlagParser = require('../flag');

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

    'command parser with just arguments': {
        parser: new CommandParser({
            arguments: new ArrayParser(new StringParser())
        }),
        input: ['hello', 'world'],
        output: {arguments: ['hello', 'world']}
    },

    'command parser with POJO arguments': {
        parser: new CommandParser({
            arguments: new ArrayParser(new ArgonParser())
        }),
        input: ['[', '10', '--', '20', '30', ']', 'world'],
        output: {arguments: [[10, '20', 30], 'world']}
    },

    'command parser with flag': {
        parser: new CommandParser({
            minus: {
                f: new FlagParser('-f', true, 'flag')
            },
            arguments: new ArrayParser(new StringParser())
        }),
        input: ['a', '-f', 'b'],
        output: {arguments: ['a', 'b'], flag: true}
    },

    'command parser with flag elided': {
        parser: new CommandParser({
            minus: {
                f: new FlagParser('-f', true, 'flag')
            },
            arguments: new ArrayParser(new StringParser())
        }),
        input: ['a', 'b'],
        error: 'Expected flag -f',
        index: 2
    },

    'command parser with optional flag': {
        parser: new CommandParser({
            minus: {
                f: new OptionalParser(new FlagParser('-f', true, 'flag'), 'flag')
            },
            arguments: new ArrayParser(new StringParser())
        }),
        input: ['a', '-f', 'b'],
        output: {arguments: ['a', 'b'], flag: true}
    },

    'command parser with optional flag elided': {
        parser: new CommandParser({
            minus: {
                f: new OptionalParser(new FlagParser('-f', true, 'flag'), 'flag')
            },
            arguments: new ArrayParser(new StringParser())
        }),
        input: ['a', 'b'],
        output: {arguments: ['a', 'b'], flag: null}
    },

    'command parser with option': {
        parser: new CommandParser({
            options: {
                flag: new FlagParser('--flag', true, 'flag')
            },
            arguments: new ArrayParser(new StringParser())
        }),
        input: ['a', '--flag', 'b'],
        output: {arguments: ['a', 'b'], flag: true}
    },

    'command parser with option flag accepting no value': {
        parser: new CommandParser({
            options: {
                flag: new FlagParser('--flag', true, 'flag')
            },
            arguments: new ArrayParser(new StringParser())
        }),
        input: ['a', '--flag=b'],
        error: 'Unexpected value for flag',
        index: 1
    },

    'command parser with optional option': {
        parser: new CommandParser({
            options: {
                flag: new OptionalParser(new FlagParser('--flag', true, 'flag'), 'flag')
            },
            arguments: new ArrayParser(new StringParser())
        }),
        input: ['a', '--flag', 'b'],
        output: {arguments: ['a', 'b'], flag: true}
    },

    'command parser with option elided': {
        parser: new CommandParser({
            options: {
                flag: new FlagParser('--flag', true, 'flag')
            },
            arguments: new ArrayParser(new StringParser())
        }),
        input: ['a', 'b'],
        error: 'Expected flag --flag',
        index: 2
    },

    'command parser with optional option elided': {
        parser: new CommandParser({
            options: {
                flag: new OptionalParser(new FlagParser('--flag', true, 'flag'), 'flag')
            },
            arguments: new ArrayParser(new StringParser())
        }),
        input: ['a', 'b'],
        output: {arguments: ['a', 'b'], flag: null}
    },

};
