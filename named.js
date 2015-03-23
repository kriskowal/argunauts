'use strict';

module.exports = NamedParser;

function NamedParser(name, of) {
    if (!of) {
        throw new Error('NamedParser needs child parser to name');
    }
    if (!of.createInitialState) {
        throw new Error('NamedParser needs child parser that implements createInitialState');
    }
    this.name = name;
    this.of = of;
}

NamedParser.prototype.createInitialState = function (handler) {
    return new NamedState(handler, this.name, this.of);
};

function NamedState(handler, name, of) {
    this.handler = handler;
    this.name = name;
    return of.createInitialState(this);
}

NamedState.prototype.handleValue = function (value) {
    return this.handler.handleValue(value, this.name);
};

NamedState.prototype.handleError = function (message) {
    return this.handler.handleError(message, this.name);
};
