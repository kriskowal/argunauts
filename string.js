'use strict';

module.exports = StringParser;

function StringParser(key) {
    this.key = key;
}

StringParser.prototype.createInitialState = function (handler, key) {
    return new StringState(handler, key || this.key);
};

function StringState(handler, key) {
    this.handler = handler;
    this.key = key;
}

StringState.prototype.parse = function (argument) {
    if (argument === null) {
        return this.handler.handleError('Expected string but got end of arguments');
    } else {
        return this.handler.handleValue(argument, this.key);
    }
};
