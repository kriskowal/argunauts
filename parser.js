'use strict';

var chalk = require('chalk');
var End = require('./end');

module.exports = Parser;

function Parser(parser) {
    this.state = parser.createInitialState(this);
    this.index = null;
    this.value = null;
    if (!this.state || !this.state.parse) {
        throw new Error('Language did not return initial state with parse method: ' + parser.constructor.name);
    }
}

Parser.prototype.parse = function (args, start, end) {
    if (args === null) {
        return this;
    }
    start = start || 0;
    end = end || args.length;
    this.args = args;
    while (start < end) {
        this.index = start;
        var previousState = this.state;
        this.state = this.state.parse(args[start]);
        if (!this.state) {
            this.state = this.handleError(
                'Prior state returned an undefined next state ' +
                previousState.constructor.name
            );
        }
        if (!this.state || this.state.stop) {
            break;
        }
        start++;
    }
    if (this.state && this.state.parse) {
        this.index = start;
        this.state = this.state.parse(null);
    }
    return this.value;
};

Parser.prototype.handleValue = function (value) {
    this.value = value;
    return new End(this);
};

Parser.prototype.handleError = function (message) {
    var args = this.args.slice();
    args.splice(this.index, 1, chalk.red('^') + (args[this.index] || ''));
    return this.throwError(message + ' at ' + args.join(' '));
};

Parser.prototype.throwError = function (message) {
    var error = new Error(message);
    error.index = this.index;
    throw error;
};

