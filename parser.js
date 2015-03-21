'use strict';

var chalk = require('chalk');

module.exports = Parser;

function Parser(Shape) {
    this.shape = new Shape(this);
    this.index = null;
    this.value = null;
}

Parser.prototype.parse = function (args, start, end) {
    start = start || 0;
    end = end || args.length;
    this.args = args;
    while (start < end) {
        this.index = start;
        var previousShape = this.shape;
        this.shape = this.shape.parse(args[start]);
        if (!this.shape) {
            this.handleError(
                'Prior shape returned an undefined next shape ' +
                previousShape.constructor.name
            );
        }
        if (this.shape.stop) {
            break;
        }
        start++;
    }
    this.shape = this.shape.parse(null);
    return this.value;
};

Parser.prototype.handleValue = function (value) {
    this.value = value;
    return new End(this);
};

Parser.prototype.handleError = function (message) {
    var args = this.args.slice();
    args.splice(this.index, 1, chalk.red("^") + args[this.index]);
    var error = new Error(message + " at " + args.join(" "));
    error.index = this.index;
    throw error;
};

function End(handler) {
    this.handler = handler;
}

End.prototype.parse = function (argument) {
    if (argument === null) {
        return new Beyond(this.handler);
    } else {
        return this.handler.handleError("Unexpected " + argument);
    }
};

function Beyond(handler) {
    this.handler = handler;
}

Beyond.prototype.parse = function (argument) {
    return this.handler.handleError("Got " + argument + " beyond EOF");
};

