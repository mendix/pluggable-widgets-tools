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
        libraryTarget: "umd",
    },
    resolve: {
        extensions: [".ts", ".js", ".tsx", ".jsx"],
        alias: {
            "tests":`${variables.path}/tests`
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [{
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true
                    }
                }]
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
            },
        ]
    },
    externals: [
        "react",
        "react-dom",
        function(context, request, callback) {
            if (/^@mendix\/pluggable-widget-api\/components\//.test(request)){
                let correctPath = request.replace("@mendix/pluggable-widgets-api/components/web", "mendix/components"); //WORKAROUND for RC b1
                return callback(null, correctPath.replace("@mendix/pluggable-widgets-api/components", "mendix/components"));
            }
            callback();
        }
    ],
    plugins: [
        new CopyWebpackPlugin(
            [{
                from: `${variables.path}/src/**/*.xml`,
                toType: "template",
                to: `widgets/[name].[ext]`
            }],
            { copyUnmodified: true }
        )
    ]
};

const previewConfig = {
    entry: path.join(variables.path, `/src/${widgetName}.webmodeler.${variables.extension}`),
    output: {
        path: path.join(variables.path, "/dist/tmp"),
        filename: `widgets/${widgetName}.webmodeler.js`,
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
    },
    externals: [
        "react",
        "react-dom",
        function(context, request, callback) {
            if (/^@mendix\/pluggable-widgets-api\/components\//.test(request)){
                return callback(null, request.replace("@mendix/pluggable-widgets-api/components", "mendix/components"));
            }
            callback();
        }
    ]
};

module.exports = [widgetConfig, previewConfig];
