'use strict';

module.exports = CommandParser;

function CommandParser(parsers) {
    this.parsers = parsers;
}

CommandParser.prototype.createInitialState = function (handler) {
    return new CommandState(handler, this.parsers);
};

function CommandState(handler, parsers) {
    this.handler = handler;
    this.parsers = parsers;
    this.options = {};
    this.arguments = [];
    this.parsing = true;
}

CommandState.prototype.parse = function (argument) {
    if (argument === null) {
        this.options.arguments = this.arguments;
        return this.handler.handleValue(this.options);
    } else if (!this.parsing) {
        this.arguments.push(argument);
        return this;
    } else if (argument === '--') {
        this.parsing = false;
        return this;
    } else if (argument.lastIndexOf('--', 0) === 0) {
        return this.parseMinusMinus(argument);
    } else if (argument.lastIndexOf('-', 0) === 0 && argument.length > 1) {
        return this.parseMinus(argument);
    } else {
        return this.parsers.argument.createInitialState(this).parse(argument);
    }
};

CommandState.prototype.parseMinusMinus = function (argument) {
    var index = argument.indexOf('=');
    if (index >= 0) {
        var next = this.parse(argument.slice(0, index));
        if (next === this) {
            return this.handler.handleError('Unexpected value for flag');
        } else {
            return next.parse(argument.slice(index + 1));
        }
    } else {
        var option = argument.slice(2);
        var minusMinus = this.parsers.minusMinus;
        if (minusMinus[option]) {
            return minusMinus[option].createInitialState(this);
        } else {
            return this.handler.handleError('Unexpected option, ' + option);
        }
    }
};

CommandState.prototype.parseMinus = function (argument) {
    if (argument.length > 2) {
        var next = this.parse(argument.slice(0, 2));
        if (next === this) {
            return this.handler.handleError('Unexpected value for flag');
        } else {
            return next.parse(argument.slice(2));
        }
    } else {
        var flag = argument[1];
        var parsers = argument[0] === '-' ? this.parsers.minus : this.parsers.plus;
        if (parsers[flag]) {
            return parsers[flag].createInitialState(this);
        } else {
            return this.handler.handleError('Unexpected flag, ' + flag);
        }
    }
};

CommandState.prototype.handleValue = function (value, key) {
    if (key) {
        this.options[key] = value;
    } else {
        this.arguments.push(value);
    }
    return this;
};

CommandState.prototype.handleError = function (message) {
    return this.handler.handleError(message);
};
