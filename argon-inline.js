
var ArgonParser = require('./argon');

module.exports = ArgonInlineParser;

function ArgonInlineParser() {
}

ArgonInlineParser.prototype.createInitialState = function (handler) {
    return new ArgonInlineState(handler);
};

function ArgonInlineState(handler) {
    this.handler = handler;
    this.object = {};
}

ArgonInlineState.prototype.parse = function (argument) {
    if (argument === null) {
        return this.handler.handleValue(this.object).parse(null);
    } else if (argument === '--') {
        return this.handler.handleValue(this.object);
    } else if (argument.lastIndexOf('--', 0) === 0) {
        var index = argument.indexOf('=');
        if (index >= 0) {
            return this.parse(argument.slice(0, index)).parse(argument.slice(index + 1));
        } else {
            return new ArgonParser(argument.slice(2)).createInitialState(this);
        }
    } else {
        return this.handler.handleError('Expected a --key value entry or -- or end of arguments');
    }
}

ArgonInlineState.prototype.handleValue = function (value, key) {
    this.object[key] = value;
    return this;
};

ArgonInlineState.prototype.handleError = function (message) {
    return this.handler.handleError(message);
};

