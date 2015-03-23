'use strict';

module.exports = OptionParser;

function OptionParser(of) {
    this.of = of;
}

OptionParser.prototype.createInitialState = function (handler) {
    return new OptionState(handler, this.of);
};

function OptionState(handler, of) {
    this.handler = handler;
    this.of = of;
}

OptionState.prototype.parse = function (argument) {
    if (argument === null) {
        return this.handler;
    } else {
        return this.of.createInitialState(this.handler).parse(argument);
    }
};
