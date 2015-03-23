'use strict';

module.exports = FlagParser;

function FlagParser(value) {
    this.value = value === undefined ? true : value;
}

FlagParser.prototype.createInitialState = function (handler) {
    return new FlagState(handler, this.value);
};

function FlagState(handler, value) {
    this.handler = handler;
    this.value = value;
}

FlagState.prototype.parse = function (argument) {
    if (argument === null) {
        return this.handler;
    } else { // argument should be '-'
        return this.handler.handleValue(this.value);
    }
};
