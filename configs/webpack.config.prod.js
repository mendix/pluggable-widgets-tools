"use strict";

const path = require("path");
const commonConfig = require("./webpack.config.common");
const merge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const args = process.argv.slice(2);
const indexOf = args.indexOf("--subprojectPath");
let pathToJoin = "";
if(indexOf > -1 && args.length > indexOf+1){
    pathToJoin = args[indexOf+1];
}

const newPath = path.join(__dirname, "../../../../", pathToJoin);

const pkg = require(path.join(newPath, "package.json"));

const packagePath = pkg.packagePath.replace(/\./g, "\/");
const widgetName = pkg.widgetName;
const name = widgetName.toLowerCase();

const prodConfig = {
    mode: "production",
    devtool: false,
    plugins: [
        new ExtractTextPlugin({
            filename: `./widgets/${packagePath}/${name}/ui/${widgetName}.css`
        })
    ],
    module: {
        rules: [
            {
                test: /\.s?css$/, loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "sass-loader"]
                })
            }
        ]
    }
};

const previewProdConfig = {
    mode: "production",
    devtool: false,
    plugins: [
        new ExtractTextPlugin({
            filename: `./widgets/${packagePath}/${name}/ui/${widgetName}.css`
        })
    ],
    module: {
        rules: [
            {
                test: /\.s?css$/, loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "sass-loader"]
                })
            }
        ]
    }
};

module.exports = [ merge(commonConfig[0], prodConfig), merge(commonConfig[1], previewProdConfig) ];
