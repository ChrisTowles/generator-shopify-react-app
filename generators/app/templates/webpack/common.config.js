const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: ["./src/index.tsx"],

    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "../dist"),
        publicPath: "/",
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: "<%= appname %>",
            template: "src/index.ejs",
        }),
        new CopyWebpackPlugin([
            { from: "static" },
            { from: "node_modules/react/dist/react.js", to: "js" },
            { from: "node_modules/react-dom/dist/react-dom.js", to: "js" },
        ], {}),
    ],
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".tsx", ".ts", ".js"]
    },

    module: {
        rules: [
            { test: /\.(graphql|gql)$/, loader: "graphql-tag/loader", exclude: /node_modules/ },
            { test: /\.js$/, loader: "source-map-loader", enforce: "pre", exclude: /node_modules/ },
            { test: /\.tsx$/, loader: "source-map-loader", enforce: "pre", exclude: /node_modules/ },
            { test: /\.tsx?$/, loader: "awesome-typescript-loader", exclude: /node_modules/ }
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
};