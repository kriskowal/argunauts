'use strict';

module.exports = ChainParser;

function ChainParser(parsers) {
    this.parsers = parsers;
}

ChainParser.prototype.createInitialState = function (handler) {
    return new ChainState(handler, this.parsers);
};

function ChainState(handler, parsers) {
    this.handler = handler;
    this.parsers = parsers;
    this.index = 0;
    this.options = {};
    this.arguments = [];
}

ChainState.prototype.parse = function (argument) {
    if (argument === null) {
        return this.handler.handleValue({
            options: this.options,
            arguments: this.arguments
        });
    } else if (this.index >= this.parsers.length) {
        return this.handler.handleError('Unexpected value');
    } else {
        var parser = this.parsers[this.index++];
        return parser.createInitialState(this).parse(argument);
    }
};

ChainState.prototype.handleValue = function (value, key) {
    if (key === undefined) {
        this.arguments.push(value);
    } else {
        this.options[key] = value;
    }
    return this;
};

ChainState.prototype.handleError = function (message) {
    return this.handler.handleError(message);
};
