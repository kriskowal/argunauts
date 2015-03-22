'use strict';

module.exports = ArrayParser;

function ArrayParser(of, key) {
    this.of = of;
    this.key = key;
}

ArrayParser.prototype.createInitialState = function (handler, key) {
    return new ArrayState(handler, this.of, key || this.key);
};

function ArrayState(handler, of, key) {
    this.handler = handler;
    this.of = of;
    this.key = key;
    this.array = [];
}

ArrayState.prototype.parse = function (argument) {
    if (argument === null) {
        return this.handler.handleValue(this.array, this.key);
    } else {
        return this.of.createInitialState(this).parse(argument);
    }
};

ArrayState.prototype.handleValue = function (value) {
    this.array.push(value);
    return this;
};
