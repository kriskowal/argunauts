#!/usr/bin/env node
'use strict';

var Parser = require('../parser');
var CommandParser = require('../command');
var NamedParser = require('../named');
var ArgonParser = require('../argon');
var UIntParser = require('../uint');
var OptionParser = require('../option');
var OptionalParser = require('../optional');

module.exports = main;

var tab = new NamedParser('tab', new OptionParser(new UIntParser()));
main.parser = new CommandParser({
    minus: {t: tab},
    minusMinus: {tab: tab},
    argument: new ArgonParser()
});

if (require.main == module) {
    main();
}

function main() {
    var parser = new Parser(main.parser);
    parser.throwError = function (message) {
        console.log('Error:', message);
        process.exit(-1);
    };
    var command = parser.parse(process.argv.slice(2));
    command.arguments.forEach(function (argument) {
        console.log(JSON.stringify(
            argument,
            null,
            command.tab
        ));
    });
}

