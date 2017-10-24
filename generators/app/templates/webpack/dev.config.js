const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const common = require("./common.config.js");

const extractCSS = new ExtractTextPlugin({
    allChunks: true,
    disable: true,
    filename: "app.css",
});

module.exports = merge(common(extractCSS), {
    devtool: "inline",

    devServer: {
        contentBase: path.resolve(__dirname, "../dist"),
        headers: { "Access-Control-Allow-Origin": "*" },
        historyApiFallback: true,
        https: true,
        port: 5000,
        publicPath: "/",
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("development"),
            },

            // The key used to store our temporary OAuth token in localStorage
            AUTH_TOKEN_KEY: JSON.stringify("authToken"),

            // The base URL for our API endpoint
            BASE_API_URL: JSON.stringify("<%= graphqlApiUrl %>"),

            // Set to true to enable an embedded app or false to disable it
            ENABLED_EMBEDDED: JSON.stringify(true),

            // The key used to store the shop domain in localStorage
            SHOP_KEY: JSON.stringify("shop"),

            // Your Shopify API Key
            SHOPIFY_API_KEY: JSON.stringify("<%= shopifyApiKey %>"),

            // The key used to store our API authorization token in localStorage
            TOKEN_KEY: JSON.stringify("token")
        }),
        new CopyWebpackPlugin([
            { from: "node_modules/react/umd/react.development.js", to: "js/react.js" },
            { from: "node_modules/react-dom/umd/react-dom.development.js", to: "js/react-dom.js" },
        ], {}),
    ],
});
