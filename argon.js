'use strict';

module.exports = ArgonParser;

// TODO configurable options, plus, minus parsers

function ArgonParser(key) {
    this.key = key;
}

ArgonParser.prototype.createInitialState = function (handler) {
    return new ValueState(handler, this.key);
};

function ValueState(handler, key) {
    this.handler = handler;
    this.key = key;
}

ValueState.prototype.parse = function (argument) {
    if (argument === null) {
        return this.handler.handleError('Expected a value, got end of arguments');
    } else if (argument === '[') {
        return new ArrayOrObjectState(this.handler, this.key);
    } else if (argument === ']') {
        return this.handler.handleError('Expected a value, got closing bracket ]');
    } else if (argument === '[]') {
        return this.handler.handleValue([], this.key);
    } else if (argument === '--true') {
        return this.handler.handleValue(true, this.key);
    } else if (argument === '--false') {
        return this.handler.handleValue(false, this.key);
    } else if (argument === '--null') {
        return this.handler.handleValue(null, this.key);
    } else if (argument === '--undefined') {
        return this.handler.handleValue(undefined, this.key);
    } else if (argument === '--') {
        return new StringState(this.handler, this.key);
    } else if (argument.lastIndexOf('--', 0) === 0) {
        return this.handler.handleError('Expected a value, got unexpected flag ' + argument);
    } else if (+argument === +argument) {
        return this.handler.handleValue(+argument, this.key);
    } else if (argument.lastIndexOf('-', 0) === 0) {
        if (argument === '-t') {
            return this.handler.handleValue(true, this.key);
        } else if (argument === '-f') {
            return this.handler.handleValue(false, this.key);
        } else if (argument === '-n') {
            return this.handler.handleValue(null, this.key);
        } else if (argument === '-u') {
            return this.handler.handleValue(undefined, this.key);
        } else {
            return this.handler.handleError('Expected a value, got unrecognized flag');
        }
    } else {
        return this.handler.handleValue(argument, this.key);
    }
};

function ArrayOrObjectState(handler, key) {
    this.handler = handler;
    this.key = key;
}

ArrayOrObjectState.prototype.parse = function (argument) {
    if (argument === null) {
        return this.handler.handleError(
            'Expected first value for array, --key=value pair for object, ' +
            '-- for empty object, or closing bracket ], got end of arguments'
        );
    } else if (argument === ']') {
        return this.handler.handleValue([]);
    } else if (argument === '--') {
        return new ObjectState(this.handler, this.key);
    } else if (argument.lastIndexOf('-', 0) === 0) {
        return new ObjectState(this.handler).parse(argument);
    } else {
        return new ArrayState(this.handler).parse(argument);
    }
};

function ArrayState(handler, key) {
    this.handler = handler;
    this.key = key;
    this.array = [];
}

ArrayState.prototype.parse = function (argument) {
    if (argument === null) {
        return this.handler.handleError(
            'Expected array value or closing backet ], got end of arguments'
        );
    } else if (argument === ']') {
        return this.handler.handleValue(this.array, this.key);
    } else {
        return new ValueState(this).parse(argument);
    }
};

ArrayState.prototype.handleValue = function (value) {
    this.array.push(value);
    return this;
};

ArrayState.prototype.handleError = function (message) {
    return this.handler.handleError(message);
};

function ObjectState(handler) {
    this.handler = handler;
    this.object = {};
}

ObjectState.prototype.parse = function (argument) {
    if (argument === null) {
        return this.handler.handleError(
            'Expected key value entry or closing backet ] for object, ' +
            'got end of arguments'
        );
    } else if (argument === ']') {
        return this.handler.handleValue(this.object, this.key);
    } else if (argument === '--') {
        return this.handler.handleError(
            'Expected a key value entry or closing bracket ] for object, got --'
        );
    } else if (argument.lastIndexOf('--', 0) === 0) {
        var index = argument.indexOf('=');
        if (index >= 0) {
            return this.parse(argument.slice(0, index)).parse(argument.slice(index + 1));
        } else {
            return new ValueState(this, argument.slice(2));
        }
    } else {
        return new ValueState(this, this.key).parse(argument);
    }
};

ObjectState.prototype.handleValue = function (value, key) {
    this.object[key] = value;
    return this;
};

ObjectState.prototype.handleError = function (message) {
    return this.handler.handleError(message);
};

function StringState(handler, key) {
    this.handler = handler;
    this.key = key;
}

StringState.prototype.parse = function (argument) {
    if (argument === null) {
        return this.handler.handleError('Expected string literal, got end of arguments');
    } else {
        return this.handler.handleValue(argument, this.key);
    }
};

