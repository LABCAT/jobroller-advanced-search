const path = require("path")
const glob = require("glob")

// include the js minification plugin
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

// include the css extraction and minification plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


const devMode = (process.argv.slice().pop() !== 'production');

module.exports = {
    entry: {
        "bundle.js": glob.sync("build/static/?(js|css)/*.?(js|css)").map(f => path.resolve(__dirname, f)),
    },
    output: {
        path: path.resolve(__dirname),
        filename: "../../assets/js/jobs-archive.min.js",
    },
    module: {
        rules: [
            {
                test: /\.css?$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.(sass|scss)$/,
                use: [
                        {
                            loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                ]
            }
        ],
    },
    plugins: [
        new UglifyJsPlugin(),
        // extract css into dedicated file
        new MiniCssExtractPlugin(
            {
                filename: "../../assets/css/jobs-archive.min.css",
            }
        ),
    ],
}
