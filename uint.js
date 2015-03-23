'use strict';

module.exports = UIntParser;

function UIntParser() {
}

UIntParser.prototype.createInitialState = function (handler) {
    return new UIntState(handler);
};

function UIntState(handler) {
    this.handler = handler;
}

UIntState.prototype.parse = function (argument) {
    if (argument === null) {
        return this.handler.handleError('Expected integer');
    } else {
        var value = parseInt(argument, 10);
        if (value !== value) {
            return this.handler.handleError('Expected integer');
        } else if (value < 0) {
            return this.handler.handleError('Expected integer, got negative value');
        } else {
            return this.handler.handleValue(value);
        }
    }
};
