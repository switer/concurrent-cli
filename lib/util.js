'use strict';

module.exports = {
    removeQuotes: function (str) {
        return str.replace(/^'/, '').replace(/'$/, '');
    },
    chaining: function (clt, fn, callback) {
        var isArray = Object.prototype.toString(clt) == '[object Array]',
            asyncClt = isArray ? clt.slice(0) : {},
            count = isArray ? clt.length : Object.keys(clt).length,
            nodes = [];

        function chain (item, index, result) {
            count --;
            asyncClt[index] = result;
            if (!count) {
                callback && callback(asyncClt);
                return;
            }
            // call the next
            fn.apply(null, nodes.shift());
        }
        if (isArray) {
            clt.forEach(function (item, index) {
                nodes.push([item, index, chain.bind(null, item, index)])
            });
        } else {
            for (var key in clt) {
                if (clt.hasOwnProperty(key)) {
                    nodes.push([clt[key], key, chain.bind(null, clt[key], key)]);
                }
            }
        }
        // starting
        fn.apply(null, nodes.shift());
    }
}