'use strict';

var chalk = require('chalk');
var End = require('./end');

module.exports = Parser;

function Parser(language) {
    this.state = language.createInitialState(this);
    this.index = null;
    this.value = null;
    if (!this.state || !this.state.parse) {
        throw new Error('Language did not return initial state with parse method: ' + language.constructor.name);
    }
}

Parser.prototype.parse = function (args, start, end) {
    start = start || 0;
    end = end || args.length;
    this.args = args;
    while (start < end) {
        this.index = start;
        var previousShape = this.state;
        this.state = this.state.parse(args[start]);
        if (!this.state) {
            this.state = this.handleError(
                'Prior state returned an undefined next state ' +
                previousShape.constructor.name
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
    args.splice(this.index, 1, chalk.red('^') + args[this.index]);
    var error = new Error(message + ' at ' + args.join(' '));
    error.index = this.index;
    throw error;
};

