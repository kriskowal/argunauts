'use strict';

module.exports = IntParser;

function IntParser() {
}

IntParser.prototype.createInitialState = function (handler) {
    return new IntState(handler);
};

function IntState(handler) {
    this.handler = handler;
}

IntState.prototype.parse = function (argument) {
    if (argument === null) {
        return this.handler.handleError('Expected integer');
    } else {
        var value = parseInt(argument, 10);
        if (value !== value) {
            return this.handler.handleError('Expected integer');
        } else {
            return this.handler.handleValue(value);
        }
    }
};
