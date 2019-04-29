const fs = require('fs')
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

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
        libraryTarget: "umd",
    },
    resolve: {
        extensions: [".ts", ".js", ".tsx", ".jsx"],
        alias: {
            "tests":`${newPath}/tests`
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
                from: `${newPath}/src/**/*.xml`,
                toType: "template",
                to: `widgets/[name].[ext]`
            }],
            { copyUnmodified: true }
        )
    ]
};

const previewConfig = {
    entry: path.join(newPath, `/src/${widgetName}.webmodeler.${extension}`),
    output: {
        path: path.join(newPath, "/dist/tmp"),
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
                let correctPath = request.replace("@mendix/pluggable-widgets-api/components/web", "mendix/components"); //WORKAROUND for RC b1
                return callback(null, correctPath.replace("@mendix/pluggable-widgets-api/components", "mendix/components"));
            }
            callback();
        }
    ]
};

module.exports = [widgetConfig, previewConfig];
