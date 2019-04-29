const fs = require('fs')
const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const args = process.argv.slice(2);
const indexOf = args.indexOf("--subprojectPath");
let pathToJoin = "";
if(indexOf > -1 && args.length > indexOf+1){
    pathToJoin = args[indexOf+1];
}

const newPath = path.join(process.cwd(), "../../../../", pathToJoin);

const pkg = require(path.join(newPath, "package.json"));

const packagePath = pkg.packagePath.replace(/\./g, "\/");
const widgetName = pkg.widgetName;
const name = widgetName.toLowerCase();
let extension = "tsx";

try {
    if(!fs.existsSync(path.join(newPath, `/src/${widgetName}.${extension}`))){
        extension = "jsx";
    }
} catch(err) {
    extension = "jsx";
}

const widgetConfig = {
    entry: path.join(newPath, `/src/${widgetName}.${extension}`),
    output: {
        path: path.join(newPath, "/dist/tmp"),
        filename: `widgets/${packagePath}/${name}/${widgetName}.js`,
        libraryTarget: "commonjs2"
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        alias: {
            "tests": `${newPath}/tests`
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
    devtool: false,
    bail: true,
    externals: [
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
        function(context, request, callback) {
            if (/^@mendix\/pluggable-widgets-api\/components\//.test(request)){
                let correctPath = request.replace("@mendix/pluggable-widgets-api/components/native", "mendix/components"); //WORKAROUND for RC b1
                return callback(null, correctPath.replace("@mendix/pluggable-widgets-api/components", "mendix/components"));
            }
            callback();
        }
    ],
    plugins: [
        new CopyWebpackPlugin([
            { from: `${newPath}/src/**/*.xml`, toType: "template", to: `widgets/[name].[ext]` }
        ], {
            copyUnmodified: true
        }),
        new webpack.LoaderOptionsPlugin({ debug: true })
    ]
};

module.exports = [widgetConfig];
