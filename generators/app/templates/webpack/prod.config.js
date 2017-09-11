const webpack = require("webpack");
const merge = require("webpack-merge");

const common = require("./common.config.js");

module.exports = merge(common, {
    devtool: "source-map",

    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production"),
            },

            // The key used to store our temporary OAuth token in localStorage
            AUTH_TOKEN_KEY: JSON.stringify("authToken"),

            // The base URL for our API endpoint
            BASE_API_URL: JSON.stringify("<%= graphqlApiUrl %>"),

            // Set to true to enable an embedded app or false to disable it
            ENABLED_EMBEDDED: true,

            // The key used to store the shop domain in localStorage
            SHOP_KEY: JSON.stringify("shop"),

            // Your Shopify API Key
            SHOPIFY_API_KEY: JSON.stringify("<%= shopifyApiKey %>"),

            // The key used to store our API authorization token in localStorage
            TOKEN_KEY: JSON.stringify("token")
        }),
    ],
});
