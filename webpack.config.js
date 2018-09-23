/* tslint:disable */

"use strict";

const path = require("path");

const CheckerPlugin = require("awesome-typescript-loader").CheckerPlugin;
const TsConfigPathsPlugin = require("awesome-typescript-loader").TsConfigPathsPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

// Webpack Configuraion
const config = {
    target: "web",
    stats: true,
    entry: ["./src/index.tsx"],

    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx"],
    },

    output: {
        path: path.resolve(process.cwd(), "./build/"),
        publicPath: "/",
        filename: "[name].[chunkhash].js",
        sourceMapFilename: "[name].[chunkhash].map",
    },

    module: {
        rules: [
            // {
            //     test: /\.tsx?$/,
            //     enforce: "pre",
            //     loader: "tslint-loader",
            //     options: {
            //         emitErrors: true,
            //         failOnHint: true,
            //     },
            // },
            {
                test: /\.tsx?$/,
                use: ["awesome-typescript-loader"],
                exclude: /(\.spec.ts$|node_modules)/,
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png)$/,
                use: ["url-loader?limit=100000"],
            },
        ],
    },

    plugins: [
        new TsConfigPathsPlugin(),

        new HtmlWebpackPlugin({
            template: "./src/index.html",
            inject: "body",
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || "").toLowerCase(),
            },
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                tslint: {
                    failOnHint: true,
                },
            },
        }),
    ],
};

//
// Production Configuration
//
if (process.env.NODE_ENV === "production") {
    config.mode = "production";
    config.bail = true;

    //
    // Development Configuration
    //
} else {
    // Include an alternative client for WebpackDevServer (for better error handling)
    config.mode = "development";
    config.output.filename = "[name].js";
    config.devtool = "cheap-module-source-map";

    // Awesome-Typescript-Loader requires this to detect watch mode
    config.plugins.push(new CheckerPlugin());

    // Dev Server
    config.devServer = {
        contentBase: "./dev",
        hot: true,
        inline: true,
        historyApiFallback: true,
        host: "0.0.0.0",
        port: 8080,
    };
}

module.exports = config;
