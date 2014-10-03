var colors = require('colors'),
    LABEL_COLORS = ['blue.grey', 'green.grey', 'yellow.grey', 'white.grey', 'blue', 'green', 'yellow', 'grey'],
    colorCorsor = 0,
    allots = {};

var slience = false;
module.exports = {
    quiet: function (value) {
        slience = !!value;
    },
    create: function (label, isStdout) {
        return function() {
            // globale slience, no log
            if (slience) return;

            var args = Array.prototype.slice.call(arguments);
            if (args.length && args.join('').trim()) {
                args.unshift(label)
            }
            if (isStdout && process.stdout.write) {
                process.stdout.write(args.join(' '))
            } else {
                console.log.apply(console, args);
            }
        }
    },
    allotColor: function(text, id) {
        var color;
        if (id && allots[id]) {
            color = allots[id];
        } else {
            color = LABEL_COLORS[(colorCorsor++) % LABEL_COLORS.length];
            if (id) allots[id] = color;
        }
        
        var colorKeys = color.split('.');
        colorKeys.forEach(function(c) {
            text = text[c];
        });
        return text;
    }
};