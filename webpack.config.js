const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
    entry: ["react-hot-loader/patch", "babel-polyfill", "./src/index.js"],
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
                        "transform-object-rest-spread",
                        "react-hot-loader/babel"]
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
        new HardSourceWebpackPlugin(),
        new htmlWebpackPlugin({
            template: "./public/index.html",
            filename: "./index.html"
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './public',
        hot: true
    }
}