'use strict';

module.exports = FlagParser;

function FlagParser(flag, value, key) {
    this.flag = flag;
    this.value = value === undefined ? true : value;
    this.key = key;
}

FlagParser.prototype.createInitialState = function (handler) {
    return new FlagState(handler, this.flag, this.value, this.key);
};

function FlagState(handler, flag, value, key) {
    this.handler = handler;
    this.flag = flag;
    this.key = key;
    this.value = value;
}

FlagState.prototype.parse = function (argument) {
    if (argument === null || argument !== this.flag) {
        return this.handler.handleError('Expected flag ' + this.flag);
    } else {
        return this.handler.handleValue(this.value, this.key);
    }
};
