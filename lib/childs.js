'use strict';

var childs = {};
module.exports = {
    set: function(child) {
        childs[child.id] = child;
    },
    get: function(id) {
        return childs[id];
    },
    all: function() {
        return childs;
    }
};
