'use strict';

module.exports = ArrayParser;

function ArrayParser(of) {
    this.of = of;
}

ArrayParser.prototype.createInitialState = function (handler) {
    return new ArrayState(handler, this.of);
};

function ArrayState(handler, of) {
    this.handler = handler;
    this.of = of;
    this.array = [];
}

ArrayState.prototype.parse = function (argument) {
    if (argument === null) {
        return this.handler.handleValue(this.array);
    } else {
        return this.of.createInitialState(this).parse(argument);
    }
};

ArrayState.prototype.handleValue = function (value) {
    this.array.push(value);
    return this;
};

ArrayState.prototype.handleError = function (message) {
    return this.handler.handleError(message);
};
