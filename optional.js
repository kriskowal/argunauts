'use strict';

module.exports = OptionalParser;

function OptionalParser(of, key) {
    this.of = of;
    this.key = key;
}

OptionalParser.prototype.createInitialState = function (handler) {
    return new OptionalState(handler, this.of, this.key);
};

function OptionalState(handler, of, key) {
    this.handler = handler;
    this.of = of;
    this.key = key;
}

OptionalState.prototype.parse = function (argument) {
    if (argument === null) {
        return this.handler.handleValue(null, this.key);
    } else {
        return this.of.createInitialState(this.handler, this.key).parse(argument);
    }
};
