"use strict";

const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const variables = require("./variables");

const packagePath = variables.package.packagePath.replace(/\./g, "\/");
const widgetName = variables.package.widgetName;
const name = widgetName.toLowerCase();

const widgetConfig = {
    entry: path.join(variables.path, `/src/${widgetName}.${variables.extension}`),
    output: {
        path: path.join(variables.path, "/dist/tmp"),
        filename: `widgets/${packagePath}/${name}/${widgetName}.js`,
        libraryTarget: "commonjs2"
    },
    resolve: {
        extensions: [".native.js", ".js", ".jsx", ".ts", ".tsx"],
        alias: {
            "tests": `${variables.path}/tests`
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        plugins: [
                            ["@babel/plugin-proposal-class-properties", { "loose": true }],
                            ["@babel/plugin-transform-react-jsx", { "pragma": "createElement" }]
                        ]
                    }
                }
            },
            {
                test: /\.jsx?$/,
                include: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        plugins: [
                            ["@babel/plugin-proposal-class-properties", { "loose": true }],
                            "@babel/plugin-transform-react-jsx"
                        ]
                    }
                }
            }
        ]
    },
    mode: "development",
    devtool: "source-map",
    bail: true,
    externals: [
        /^mendix\//,
        "big.js",
        "react",
        "react-dom",
        "react-native",
        "react-native-camera",
        "react-native-firebase",
        "react-native-geocoder",
        "react-native-maps",
        "react-native-svg",
        "react-native-vector-icons",
        "react-native-video",
        "react-native-view-shot",
        "react-native-webview",
        /react-native-gesture-handler\/*/,
        "react-navigation"
    ],
    plugins: [
        new CopyWebpackPlugin([
            {
                from: `${variables.path}/src/**/*.xml`,
                toType: "template",
                to: `widgets/[name].[ext]`
            }
        ], {
            copyUnmodified: true
        }),
        new webpack.LoaderOptionsPlugin({ debug: true })
    ]
};

const editorConfig = variables.editorConfig ? {
    entry: path.join(variables.path, `/src/${widgetName}.editorConfig.${variables.extension}`),
    output: {
        path: path.join(variables.path, "/dist/tmp"),
        filename: `widgets/${widgetName}.editorConfig.js`,
        libraryTarget: "commonjs"
    },
    resolve: {
        extensions: [".ts", ".js", ".tsx", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    compilerOptions: {
                        "module": "CommonJS",
                    }
                }
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                        plugins: [
                            ["@babel/plugin-proposal-class-properties", { "loose": true }],
                            ["@babel/plugin-transform-react-jsx", { "pragma": "createElement" }],
                            "react-hot-loader/babel"
                        ]
                    }
                }
            }
        ]
    }
} : undefined;

module.exports = [widgetConfig, editorConfig];
