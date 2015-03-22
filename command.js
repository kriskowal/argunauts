'use strict';

var End = require('./end');

module.exports = CommandParser;

function CommandParser(parsers) {
    this.parsers = parsers;
}

CommandParser.prototype.createInitialState = function (handler, key) {
    return new CommandState(handler, this.parsers, key);
};

function CommandState(handler, parsers, key) {
    this.handler = handler;
    this.value = {};
    this.key = key;
    this.argumentsState = parsers.arguments.createInitialState(this, 'arguments');
    this.optionStates = map(parsers.options || {}, createInitialState, this);
    this.minusStates = map(parsers.minus || {}, createInitialState, this);
    this.plusStates = map(parsers.plus || {}, createInitialState, this);
}

function map(object, callback, thisp) {
    var keys = Object.keys(object);
    var result = {};
    for (var index = 0; index < keys.length; index++) {
        var key = keys[index];
        result[key] = callback.call(thisp, object[key], key, object);
    }
    return result;
}

function createInitialState(parser, key) {
    return parser.createInitialState(this, key);
}

// cut -d: -f1
// tar xvf -
// tar -xvf -

CommandState.prototype.parse = function (argument) {
    if (argument === null) {
        return this.finalize();
    } else if (argument === '--') {
        // TODO literal mode
        this.argumentsState = this.argumentsState.parse(argument);
        return this;
    } else if (argument.lastIndexOf('--', 0) === 0) {
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
            var states = this.optionStates;
            if (states[option]) {
                states[option] = states[option].parse(argument);
                return this;
            } else {
                return this.handler.handleError('Unexpected option, ' + flag);
            }
        }
    } else if (argument.lastIndexOf('-', 0) === 0 && argument.length > 1) {
        if (argument.length > 2) {
            return this.parse(argument.slice(0, 2)).parse(argument.slice(2));
        } else {
            var flag = argument[1];
            var states = this.minusStates;
            if (states[flag]) {
                states[flag] = states[flag].parse(argument);
                return this;
            } else {
                return this.handler.handleError('Unexpected flag, ' + flag);
            }
        }
        return this.parsers.minus.createInitialState(this);
    } else if (argument.lastIndexOf('+', 0) === 0 && argument.length > 1) {
        if (argument.length > 2) {
            return this.parse(argument.slice(0, 2)).parse(argument.slice(2));
        } else {
            var flag = argument[1];
            var states = this.minusStates;
            if (states[flag]) {
                states[flag] = states[flag].parse(argument);
                return this;
            } else {
                return this.handler.handleError('Unexpected flag, ' + flag);
            }
        }
        return this.parsers.minus.createInitialState(this);
    } else {
        this.argumentsState = this.argumentsState.parse(argument);
        return this;
    }
};

CommandState.prototype.finalize = function () {
    this.argumentsState = this.argumentsState.parse(null);
    this.optionStates = map(this.optionStates, function (state) {
        return state.parse(null);
    });
    this.minusStates = map(this.minusStates, function (state) {
        return state.parse(null);
    });
    this.plusStates = map(this.plusStates, function (state) {
        return state.parse(null);
    });
    return this.handler.handleValue(this.value, this.key);
};

CommandState.prototype.handleValue = function (value, key) {
    this.value[key] = value;
    return new End(this);
};

CommandState.prototype.handleError = function (message) {
    return this.handler.handleError(message);
};
