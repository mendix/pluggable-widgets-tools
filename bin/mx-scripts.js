#!/usr/bin/env node
'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err;
});

const spawn = require('child_process').spawnSync;
const args = process.argv.slice(2);
const script = args[0];
const argsFiltered = args.length > 1 ? args.slice(1) : [];

switch (script) {
    case "build:js":
    case "build:ts":
    case "build:js:native":
    case "build:ts:native":
    case "dev:js":
    case "dev:ts":
    case "dev:js:native":
    case "dev:ts:native":
    case "format":
    case "lint":
    case "lint:fix":
    case "start:server":
    case "start:js":
    case "start:ts":
    case "start:js:native":
    case "start:ts:native":
    case "test:unit":
    case "test:unit:native":
    case "test:e2e:js":
    case "test:e2e:ts":
    case "release:js":
    case "release:ts":
    case "release:js:native":
    case "release:ts:native":
    {
        console.log(`Running MX Widget Tools script: "${script}" ${argsFiltered.length > 0 ? `with options "${argsFiltered.join(" ")}"`:""}`);
        executeScript(script)
        break;
    }
    default:
        console.log('Unknown script "' + script + '".');
        break;
}

function executeScript(script){
    let args = ["run", script];
    if(argsFiltered.length > 0){
        args.push("--");
        args = args.concat(argsFiltered);
    }
    const result = spawn(
        /^win/.test(process.platform) ? 'npm.cmd' : 'npm', args,
        { stdio: 'inherit' }
    );
    if (result.signal) {
        if (result.signal === 'SIGKILL') {
            console.log(
                'The build failed because the process exited too early. ' +
                'This probably means the system ran out of memory or someone called ' +
                '`kill -9` on the process.'
            );
        } else if (result.signal === 'SIGTERM') {
            console.log(
                'The build failed because the process exited too early. ' +
                'Someone might have called `kill` or `killall`, or the system could ' +
                'be shutting down.'
            );
        }
        process.exit(1);
    }
    process.exit(result.status);
}
