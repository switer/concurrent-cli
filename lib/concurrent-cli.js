var util = require("util");
var fs = require("fs");
var childProcess = require('child_process');
var path = require("path");
var startChildProcess;
var version = false;
var colors = require('colors');
var util = require('./util');
var helpText = require('./help');
var logger = require('./logger');
var log = logger.create('[Concurrent Cli]'.yellow);
var childs = require('./childs');
var StillAlive = require('./stillalive');
var meta = require('../package.json');


exports.run = run;

function run(args) {
    var arg, program;
    while (arg = args.shift()) {
        if (arg === "--help" || arg === "-h" || arg === "-?") {
            return help();
        } else if (arg === "--quiet" || arg === "-q") {
            logger.quiet(true);
        } else if (arg === "--version") {
            version = true;
        } else if (arg === "--") {
            program = args.join(' ');
            break;
        } else if (arg[0] != "-" && !args.length) {
            // Assume last arg is the program
            program = arg;
        }
    }
    if (version) {
        return console.log(meta.version);
    }
    if (!program) {
        return help();
    }

    try {
        // Pass kill signals through to child
        ["SIGTERM", "SIGINT", "SIGHUP", "SIGQUIT"].forEach(function(signal) {
            process.on(signal, function() {
                var child = exports.child;
                if (child) {
                    log("Sending " + signal + " to child...");
                    child.kill(signal);
                }
                process.exit();
            });
        });
    } catch (e) {
        // Windows doesn't support signals yet, so they simply don't get this handling.
        // https://github.com/joyent/node/issues/1553
    }

    // store the call to startProgramm in startChildProcess
    // in order to call it later
    startChildProcess = function() {
        var programs = program.split(' & '),
            delay = 0;
        util.chaining(programs, function (program, index, next) {
            program = program.trim();
            program = program.replace(/^(\d+)\s/, function (matches, $1) {
                delay += parseInt($1);
                return '';
            });
            startProgram(program, index, {
                delay: delay,
                callback: function () {
                    next();
                }
            });
        }, function () {
            // Done
        });
    };

    // if we have a program, then run it, and restart when it crashes.
    startChildProcess();
};

function help() {
    console.log(helpText);
};

function startProgram(prog, id, options) {
    options = options || {};

    var processLog = logger.create( logger.allotColor('[' + id + ']', id), true),
        noLabelLog = logger.create('', true),
        isNewLine = true,
        stillAlive = new StillAlive(options.delay || 0, options.callback);


    log("Run \"" + prog + "\"");
    var child = childProcess.exec(prog, {});
    childs.set({
        id: id,
        process: child,
        program: prog,
        options: options
    });
    if (child.stdout) {
        child.stdout.on("data", function(chunk) {
            if (!chunk) return;
            if (isNewLine) {
                processLog(chunk);
            } else {
                noLabelLog(chunk)
            }
            if (chunk.match(/\n/)) isNewLine = true;
            else isNewLine = false;
            stillAlive.pluse();
        });
        child.stderr.on("data", function(chunk) {
            if (!chunk) return;
            if (isNewLine) {
                processLog(chunk);
            } else {
                noLabelLog(chunk)
            }
            stillAlive.pluse();
            if (chunk.match(/\n/)) isNewLine = true;
            else isNewLine = false;
        });
    }
    child.on("exit", function(code) {
        log("Program \"" + prog + "\" " + (code === 0 ? 'run success' : ('exited with code ' + code) ) + "\n");
        stillAlive.die();
    });
}

