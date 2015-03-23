'use strict';

module.exports = End;

function End(handler) {
    if (!handler) {
        throw new Error('Must provide handler');
    }
    if (!handler.handleError) {
        throw new Error('Handler must implement handleError');
    }
    this.handler = handler;
}

End.prototype.parse = function (argument) {
    if (argument === null) {
        return new Beyond(this.handler);
    } else {
        return this.handler.handleError('Expected end of arguments but got ' + argument);
    }
};

function Beyond(handler) {
    this.handler = handler;
}

Beyond.prototype.parse = function (argument) {
    if (argument === null) {
        return this;
    } else {
        return this.handler.handleError('Got ' + argument + ' beyond EOF');
    }
};

