const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const uglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
    entry: ["react-hot-loader/patch", "./src/index.js"],
    output: {
        path: path.resolve(__dirname, "/public"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                include: [path.resolve(__dirname, "src")],
                exclude: /node_modules/,
                query: {
                    presets: ['env', 'react'],
                    plugins: ["transform-runtime", "transform-class-properties",
                        "transform-object-rest-spread", "react-hot-loader/babel"]
                }
            }, {
                test: /\.html$/,
                use: [{
                    loader: "html-loader"
                }]
            }
        ]
    },
    plugins: [
        // new HardSourceWebpackPlugin(),
        new htmlWebpackPlugin({
            template: "./public/index.html",
            filename: "./index.html"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new CompressionPlugin()
    ],
    optimization: {
        minimizer: [
            new uglifyJSPlugin({
                uglifyOptions: {
                    compress: {
                        drop_console: true
                    },
                    output: {
                        comments: false
                    }
                }
            })
        ]
    },
    devServer: {
        contentBase: './public',
        hot: true
    }
}