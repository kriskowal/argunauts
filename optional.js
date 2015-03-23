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
        // TODO consider a better way to do one or the other branches
        return this.handler.parse(null);
    } else {
        return this.of.createInitialState(this.handler, this.key).parse(argument);
    }
};
