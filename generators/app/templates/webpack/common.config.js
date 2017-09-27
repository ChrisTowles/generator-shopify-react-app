const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (extractCSS) => {
    return {
        entry: ["./src/index.tsx"],

        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, "../dist"),
            publicPath: "/",
        },

        plugins: [
            new HtmlWebpackPlugin({
                title: "Shopify-React-App",
                template: "src/index.ejs",
            }),
            new FaviconsWebpackPlugin({
                logo: path.resolve(__dirname, "../src/favicon.png"),
                prefix: "favicons/",
                inject: true,
                background: "#ffffff",
            }),
            new CopyWebpackPlugin([
                { from: "static" },
                { from: "node_modules/react/dist/react.js", to: "js" },
                { from: "node_modules/react-dom/dist/react-dom.js", to: "js" },
            ], {}),
            extractCSS,
        ],

        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: [".tsx", ".ts", ".js"]
        },

        module: {
            rules: [
                {
                    test: /^(?!.*\.global\.css$).*\.css$/,
                    use: extractCSS.extract({
                        fallback: "style-loader",
                        use: [{
                            loader: "typings-for-css-modules-loader",
                            options: {
                                camelCase: true,
                                modules: true,
                                namedExport: true,
                                sourceMap: true,
                            },
                        }],
                    }),
                },
                {
                    test: /^(?!.*\.global\.less$).*\.less$/,
                    use: extractCSS.extract({
                        fallback: "style-loader",
                        use: [{
                            loader: "typings-for-css-modules-loader",
                            options: {
                                camelCase: true,
                                modules: true,
                                namedExport: true,
                                sourceMap: true,
                            },
                        }, {
                            loader: "less-loader",
                            options: {
                                sourceMap: true,
                            },
                        }],
                    }),
                },
                {
                    test: /^(?!.*\.global\.s(c|a)ss$).*\.s(c|a)ss$/,
                    use: extractCSS.extract({
                        fallback: "style-loader",
                        use: [{
                            loader: "typings-for-css-modules-loader",
                            options: {
                                camelCase: true,
                                modules: true,
                                namedExport: true,
                                sourceMap: true,
                            },
                        }, {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                            },
                        }],
                    }),
                },
                {
                    test: /\.global\.css$/,
                    use: extractCSS.extract({
                        fallback: "style-loader",
                        use: [{
                            loader: "typings-for-css-modules-loader",
                            options: {
                                camelCase: true,
                                modules: false,
                                namedExport: true,
                                sourceMap: true,
                            },
                        }],
                    }),
                },
                {
                    test: /\.global\.less$/,
                    use: extractCSS.extract({
                        fallback: "style-loader",
                        use: [{
                            loader: "typings-for-css-modules-loader",
                            options: {
                                camelCase: true,
                                modules: false,
                                namedExport: true,
                                sourceMap: true,
                            },
                        }, {
                            loader: "less-loader",
                            options: {
                                sourceMap: true,
                            },
                        }],
                    }),
                },
                {
                    test: /\.global\.s(c|a)ss$/,
                    use: extractCSS.extract({
                        fallback: "style-loader",
                        use: [{
                            loader: "typings-for-css-modules-loader",
                            options: {
                                camelCase: true,
                                modules: false,
                                namedExport: true,
                                sourceMap: true,
                            },
                        }, {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                            },
                        }],
                    }),
                },
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
};
