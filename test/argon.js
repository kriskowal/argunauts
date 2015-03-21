'use strict';

module.exports = [
    {
        input: ['+10'],
        output: 10
    },
    {
        input: ['-10'],
        output: -10
    },
    {
        input: ['10'],
        output: 10
    },
    {
        input: ['--', '10'],
        output: '10'
    },
    {
        input: ['a'],
        output: 'a'
    },
    {
        input: ['-t'],
        output: true
    },
    {
        input: ['--true'],
        output: true
    },
    {
        input: ['-f'],
        output: false
    },
    {
        input: ['--false'],
        output: false
    },
    {
        input: ['-n'],
        output: null
    },
    {
        input: ['--null'],
        output: null
    },
    {
        input: ['-u'],
        output: undefined
    },
    {
        input: ['--undefined'],
        output: undefined
    },
    {
        input: ['[', ']'],
        output: []
    },
    {
        input: ['[]'],
        output: []
    },
    {
        input: ['[', '[]', ']'],
        output: [[]]
    },
    {
        input: ['[', '--', ']'],
        output: {}
    },
    {
        input: ['[', '--', '--', ']'],
        error: 'Expected a key value entry or closing bracket ] for object, got --',
        index: 2
    },
    {
        input: ['[', '+10', ']'],
        output: [10]
    },
    {
        input: ['[', '--a', '+10', ']'],
        output: {a: 10}
    },
    {
        input: ['[', '--foo', '+10', '--bar', '20', ']'],
        output: {foo: 10, bar: 20}
    },
    {
        input: ['[', '--foo=+10', '--bar=20', ']'],
        output: {foo: 10, bar: 20}
    },
    {
        input: ['[', '--foo=+10', '--bar=--', '20', ']'],
        output: {foo: 10, bar: '20'}
    },
    {
        input: ['[', '--foo=+10', '--bar', '--', '20', ']'],
        output: {foo: 10, bar: '20'}
    },
    {
        input: ['[', '[', 'hi', ']', ']'],
        output: [['hi']]
    },
    {
        input: ['--', '['],
        output: '['
    },
    {
        input: ['--', ']'],
        output: ']'
    },
    {
        input: ['--', '[a'],
        output: '[a'
    },
    {
        input: ['--' , ']b'],
        output: ']b'
    },
    {
        input: ['[', '-a', '+10', ']'],
        error: 'Expected a value, got unrecognized flag',
        index: 1
    },
    {
        input: ['[', '--a', '10', '--', ']'],
        error: 'Expected a key value entry or closing bracket ] for object, got --',
        index: 3
    },
];
