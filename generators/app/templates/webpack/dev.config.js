const path = require("path");
const merge = require("webpack-merge");
const common = require("./common.config.js");

module.exports = merge(common, {
    devtool: "inline",
    devServer: {
        contentBase: path.resolve(__dirname, "../dist"),
        headers: { "Access-Control-Allow-Origin": "*" },
        historyApiFallback: true,
        https: true,
        port: 5000,
        publicPath: "/",
    }
});
    