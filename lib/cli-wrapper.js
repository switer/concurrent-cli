#!/usr/bin/env node
var path = require("path")
  , fs = require("fs")
  , args = process.argv.slice(1)

var arg, base;
do arg = args.shift();
while ( fs.realpathSync(arg) !== __filename
  && (base = path.basename(arg)) !== "concurrent-cli"
  && base !== "concurrent-cli.js"
)
var argStr = args.join(' '),
    strs = [],
    index = 0;
// String holder replacement
argStr = argStr.replace(/"([^]*?)"/g, function ($matched, $1) {
    strs.push($1);
    return '__${@}__'.replace('@', index ++);
}).replace(/'([^]*?)'/g, function ($matched, $1) {
    strs.push($1);
    return '__${@}__'.replace('@', index ++);
});
args = argStr.split(/\s+/);

args = args.map(function (item) {
    var holder = item.match(/__\${(\d+)}__/);
    if (holder) {
        return strs[holder[1]];
    } else {
        return item;
    }
});
require("./concurrent-cli").run(args)
