"use strict";

const fs = require('fs');
const path = require("path");
const zip = require("gulp-zip");
const gulp = require("gulp");
const webpack = require("webpack");
const del = require("del");
const gulpSlash = require("gulp-slash");
const typingGenerator = require("@mendix/pluggable-widgets-typing-generator");

const cwd = process.cwd();
const args = process.argv.slice(2);
const indexOf = args.indexOf("--subprojectPath");
let pathToJoin = "";
if(indexOf > -1 && args.length > indexOf+1){
    pathToJoin = args[indexOf+1];
}

const newPath = path.join(__dirname, "../../../../", pathToJoin);

const pkg = require(path.join(newPath, "package.json"));

const projectPath = pkg.config.projectPath ? fixSlashes(checkPath(pkg.config.projectPath)) : fixSlashes(path.join(__dirname, `${newPath}/dist/MxTestProject`));

const widgetsFolder = fixSlashes(path.join(projectPath, "/widgets/"));

function fixSlashes(tmpPath) {
    tmpPath = gulpSlash(tmpPath);
    tmpPath = tmpPath.replace(/\/+/g, "/")
    tmpPath = tmpPath.replace(/\\\\/g, "\\");
    return gulpSlash(tmpPath);
}

function checkPath(newProjectPath) {
    if (newProjectPath.indexOf('../') !== -1 || newProjectPath.indexOf('./') !== -1) {
        return path.join(newPath, newProjectPath);
    }
    return newProjectPath;
}

function clean() {
    return del([
        fixSlashes(`${newPath}/dist/${pkg.version}/*.*`),
        fixSlashes(`${newPath}/dist/tmp/**/*.*`),
        fixSlashes(`${newPath}/dist/tsc/**/*.*`),
        fixSlashes(`${newPath}/dist/testresults/**/*.*`),
        fixSlashes(`${projectPath}/deployment/web/widgets/*.*`),
        fixSlashes(`${widgetsFolder}/${pkg.packagePath}.${pkg.widgetName}.mpk`)
    ], { force: true });
}

function createMpkFile() {
    return gulp
        .src(fixSlashes(`${newPath}/dist/tmp/widgets/**/*`))
        .pipe(zip(`${pkg.packagePath}.${pkg.widgetName}.mpk`))
        .pipe(gulp.dest(widgetsFolder))
        .pipe(gulp.dest(fixSlashes(`${newPath}/dist/${pkg.version}`)))
        .on("error", handleError);
}

function copyToDeployment() {
    console.log(`Files generated in dist and ${projectPath} folder`);
    return gulp
        .src(fixSlashes(`${newPath}/dist/tmp/widgets/**/*`))
        .pipe(gulp.dest(fixSlashes(`${projectPath}/deployment/web/widgets`)))
        .on("error", handleError);
}

function runWebpack(config, cb) {
    webpack(config, (err, stats) => {
        if (err) {
            handleError(err)
            cb(new Error(`Webpack: ${err}`));
        }
        const output = stats.toString({ colors: true, modules: false });
        console.log(`Webpack output:\n${output}`);
        cb();
    });
}

function bundle(cb) {
    let config = require(path.join(cwd, "../configs/webpack.config.dev"));
    try {
        const pathWebpack = path.join(newPath, "webpack.config.dev.js");
        if(!fs.existsSync(pathWebpack)){
            config = pathWebpack;
            console.log(`Using custom webpack configuration from ${pathWebpack}`);
        }
    } catch(err) {
    }
    runWebpack(config, cb);
}

function productionBundle(cb) {
    let config = require(path.join(cwd, "../configs/webpack.config.prod"));
    try {
        const pathWebpack = path.join(newPath, "webpack.config.prod.js");
        if(!fs.existsSync(pathWebpack)){
            config = pathWebpack;
            console.log(`Using custom webpack configuration from ${pathWebpack}`);
        }
    } catch(err) {
    }
    runWebpack(config, cb);
}

function checkDependencies(cb) {
    require("check-dependencies").sync({
        packageDir: path.join(newPath, "package.json"),
        scopeList: ["devDependencies"],
        install: true
    });
    cb();
}

function generateTypings() {
    return gulp
        .src(fixSlashes(path.join(newPath, `/src/${pkg.widgetName}.xml`)))
        .pipe(typingGenerator({ widgetName: pkg.widgetName }))
        .pipe(gulp.dest(fixSlashes(path.join(newPath, "/typings"))))
        .on("error", handleError);
}

function handleError(err) {
    console.log(err.toString())
    process.exit(-1)
}

const build = gulp.series(clean, checkDependencies, bundle, createMpkFile, copyToDeployment);

const productionBuild = gulp.series(clean, checkDependencies, productionBundle, createMpkFile, copyToDeployment);

const buildTs = gulp.series(clean, generateTypings, checkDependencies, bundle, createMpkFile, copyToDeployment);

const productionBuildTs = gulp.series(clean, generateTypings, checkDependencies, productionBundle, createMpkFile, copyToDeployment);

function watch() {
    const watchPath = fixSlashes(`${newPath}/src/**/*`);
    console.log("Watching files in: ", watchPath);
    return gulp.watch(watchPath, { ignoreInitial: false }, build);
}

function watchTs() {
    const watchPath = fixSlashes(`${newPath}/src/**/*`);
    console.log("Watching files in: ", watchPath);
    return gulp.watch(watchPath, { ignoreInitial: false }, buildTs);
}

exports.watch = watch;
exports.watchTs = watchTs;
exports.build = build;
exports.release = productionBuild;
exports.buildTs = buildTs;
exports.releaseTs = productionBuildTs;
