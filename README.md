# Pluggable Widgets Tools
 ![npm version](https://badge.fury.io/js/%40mendix%2Fpluggable-widgets-tools.svg) ![Mendix 8](https://img.shields.io/badge/mendix-8.0.0-brightgreen.svg)

![NPM](https://nodei.co/npm/@mendix/pluggable-widgets-tools.svg?downloads=true&stars=true)

## About
Library to build, test, format, run, release and lint your Pluggable Widget

## How to install
Install from npm using `npm install @mendix/pluggable-widgets-tools`

## How to use
In your `package.json` include the task:
`
"mx-script": "cd ./node_modules/@mendix/pluggable-widgets-tools && node bin/mx-scripts.js",
`
In your tasks, use the following replacing task with the desired task:
`
npm run mx-script task
`

## Available tasks
* `start:server` Used to start webpack-dev-server and run your WEB project. Accepts `--open` option to auto open your browser
* `start:js` Used to build and watch the changes of your JavaScript ES6 Web project
* `start:ts` Used to build and watch the changes of your TypeScript Web project
* `start:js:native` Used to build and watch the changes of your JavaScript ES6 Native project
* `start:ts:native` Used to build and watch the changes of your Typescript Native project
* `build:js` Used to build your JavaScript ES6 Web project
* `build:ts` Used to build your TypeScript Web project
* `build:js:native` Used to build your JavaScript ES6 Native project
* `build:ts:native` Used to build your TypeScript Web project
* `release:js` Used to build your JavaScript ES6 Web project for production
* `release:ts` Used to build your TypeScript Web project for production
* `release:js:native` Used to build your JavaScript ES6 Native project for production
* `release:ts:native` Used to build your TypeScript Web project for production
* `lint` Used to lint your project using ESLint
* `lint:fix` Used to fix lint problems/warning using ESLint
* `format` Used to format your code using Prettier
* `test:unit` Used to execute unit tests using Jest for your Web Project. Accepts option `--u` to update, `--no-cache` ro remove previous snapshots, `--ci` assumes use of a CI environment, `--coverage` to support coverage test. the snapshots. Files should be inside `src/components/__tests__`
* `test:unit:native` Used to execute unit tests using Jest for your Native Project. Accepts option `--u` to update, `--no-cache` ro remove previous snapshots, `--ci` assumes use of a CI environment, `--coverage` to support coverage test.. Files should be inside `src/components/__tests__`
* `test:e2e:js` Used to execute End-to-end tests using Wdio in your JavaScript Web Project
* `test:e2e:ts` Used to execute End-to-end tests using Wdio in your TypeScript Web Project

## Examples
`"start": "npm run mx-script start:server -- --open"` 

`"build": "npm run mx-script build:js"`

`"lint": "npm run mx-script lint"`

`"lint:fix": "npm run mx-script lint:fix"`

`"test:unit": "npm run mx-script test:unit -- --coverage"`

## Notes
If you are using mono repositories and need to build multiples widgets using Lerna or some other tool, you can provide the option `--subprojectPath` for the tasks `build`, `start` and `release`.
* Example `"buildSubProject": "npm run mx-script build:ts -- --subProjectPath \"/packages/mysubproject\"`


## Webpack extensibility
To extend the current webpack configurations and add your own custom features, you can create a file inside the root of your project with the files `webpack.config.dev.js` or `webpack.config.prod.js` according to your
necessity.
To extend the current files you can add inside your custom file the following lines:

Please note we have different configurations for web/hybrid and native mobile apps because native mobile doesn't have a preview mode in Mendix Studio Pro. Your preview configuration is related to the file Widget.webmodeler.tsx or .jsx.

For web and hybrid mobile apps
```javascript 1.6
const merge = require("webpack-merge");
const baseConfig = require("./node_modules/@mendix/pluggable-widgets-tools/configs/webpack.config.dev.js"); //Can also be webpack.config.prod.js

const customConfig = {
    // Custom configuration goes here
    devtool: "source-map"
};
const previewConfig = {
    // Custom configuration goes here
    devtool: "source-map"
};

module.exports = [merge(baseConfig[0], customConfig), merge(baseConfig[1], previewConfig)];
```
For native mobile apps
```javascript 1.6
const merge = require("webpack-merge");
const baseConfig = require("./node_modules/@mendix/pluggable-widgets-tools/configs/webpack.native.config.js");

const customConfig = {
    // Custom configuration goes here
    devtool: "source-map"
};

module.exports = [merge(baseConfig, customConfig)];
```
