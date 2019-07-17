"use strict";

const commonConfig = require("./webpack.config.common");
const merge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const variables = require("./variables");

const packagePath = variables.package.packagePath.replace(/\./g, "\/");
const widgetName = variables.package.widgetName;
const name = widgetName.toLowerCase();

const prodConfig = {
    mode: "production",
    devtool: "source-map",
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
    module: {
        rules: [
            {
                test: /\.s?css$/, use: [
                    { loader: "raw-loader" },
                    { loader: "sass-loader" }
                ]
            }
        ]
    }
};

module.exports = [ merge(commonConfig[0], prodConfig), merge(commonConfig[1], previewProdConfig) ];
