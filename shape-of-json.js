'use strict';

module.exports = ValueShape;

function ValueShape(handler, key) {
    this.handler = handler;
    this.key = key;
}

ValueShape.prototype.parse = function (argument) {
    if (argument === null) {
        return this.handler.handleError('Expected a value, got end of arguments');
    } else if (argument === '[') {
        return new ArrayOrObjectShape(this.handler, this.key);
    } else if (argument === ']') {
        return this.handler.handleError('Expected a value, got closing bracket ]');
    } else if (argument === '[]') {
        return this.handler.handleValue([]);
    } else if (argument === '-') {
        return this.handler.handleValue(null, this.key);
    } else if (argument === '--') {
        return this.handler.handleError('Expected a value, got parsable arguments terminator --');
    } else if (argument.lastIndexOf('--', 0) === 0) {
        return this.handler.handleError('');
    } else if (
        argument.lastIndexOf('-', 0) === 0 ||
        argument.lastIndexOf('+', 0) === 0
    ) {
        if (+argument === +argument) {
            return this.handler.handleValue(+argument, this.key);
        } else if (argument.length !== 2) {
            return this.handler.handleError('Expected a value or single flag, got multiple flags');
        } else if (argument === '-t') {
            return this.handler.handleValue(true, this.key);
        } else if (argument === '-f') {
            return this.handler.handleValue(false, this.key);
        } else {
            return this.handler.handleError('Expected a value, got unrecognized flag');
        }
    } else {
        return this.handler.handleValue(argument, this.key);
    }
};

function ArrayOrObjectShape(handler, key) {
    this.handler = handler;
    this.key = key;
}

ArrayOrObjectShape.prototype.parse = function (argument) {
    if (argument === null) {
        return this.handler.handleError(
            'Expected first value for array, --key=value pair for object, ' +
            '-- for empty object, or closing bracket ], got end of arguments'
        );
    } else if (argument === ']') {
        return this.handler.handleValue([]);
    } else if (argument === '--') {
        return new ObjectShape(this.handler, this.key);
    } else if (argument.lastIndexOf('-', 0) === 0) {
        return new ObjectShape(this.handler).parse(argument);
    } else {
        return new ArrayShape(this.handler).parse(argument);
    }
};

function ArrayShape(handler, key) {
    this.handler = handler;
    this.key = key;
    this.array = [];
}

ArrayShape.prototype.parse = function (argument) {
    if (argument === null) {
        return this.handler.handleError(
            'Expected array value or closing backet ], got end of arguments'
        );
    } else if (argument === ']') {
        return this.handler.handleValue(this.array, this.key);
    } else if (argument.lastIndexOf('--', 0) === 0) {
        throw new Error(
            'Expected array value or closing backet ], ' +
            'got -- prefixed argument'
        );
    } else {
        return new ValueShape(this).parse(argument);
    }
};

ArrayShape.prototype.handleValue = function (value) {
    this.array.push(value);
    return this;
};

ArrayShape.prototype.handleError = function (message) {
    return this.handler.handleError(message);
};

function ObjectShape(handler) {
    this.handler = handler;
    this.object = {};
}

ObjectShape.prototype.parse = function (argument) {
    if (argument === null) {
        return this.handler.handleError(
            'Expected --key=value pair or closing backet for object, ' +
            'got end of arguments'
        );
    } else if (argument === ']') {
        return this.handler.handleValue(this.object, this.key);
    } else if (argument.lastIndexOf('--', 0) === 0) {
        var key = argument.slice(2);
        var index = key.indexOf('=');
        if (index >= 0) {
            return new ValueShape(this, key.slice(0, index)).parse(key.slice(index + 1));
        } else {
            return new ValueShape(this, key);
        }
    } else {
        return new ValueShape(this, key).parse(argument);
    }
};

ObjectShape.prototype.handleValue = function (value, key) {
    this.object[key] = value;
    return this;
};

ObjectShape.prototype.handleError = function (message) {
    return this.handler.handleError(message);
};
