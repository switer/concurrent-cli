'use strict';

function StillAlive (timeout, callback) {
    this._timeout = timeout;
    this._callback = callback;
    this.timer();
}

StillAlive.prototype.pluse = function () {
    this.timer();
}

StillAlive.prototype.timer = function () {
    if (this._isDead) return;

    clearTimeout(this._thimer);
    this._thimer = setTimeout(function () {
        this._isDead = true;
        this._callback && this._callback();
    }.bind(this), this._timeout);
}

StillAlive.prototype.die = function () {
    if (this._isDead) return;
    clearTimeout(this._thimer);
    this._isDead = true;
    this._callback && this._callback();
}

module.exports = StillAlive;