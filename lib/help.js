function NOOP () {/*
Concurrent-Cli tool use for concurrent command running.

Usage:
    concurrent-cli [options] <program>
    concurrent-cli [options] -- <program> [args ...]

Required:
    <program>
        The program to run.

Options:

    -h|--help|-?
        Display these usage instructions.

    -q|--quiet
        Suppress DEBUG messages

Examples:
    concurrent-cli \"npm start !! npm list\"
    concurrent-cli -- npm start !! npm list
;
*/}
var fs = require('fs');
module.exports = NOOP.toString().match(/\/\*([\s\S]+?)\*\//)[1];