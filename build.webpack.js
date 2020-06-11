const path = require('path');

const projectRoot = process.cwd();

module.exports = {
    mode: "development",
    entry: {
        'examples': path.resolve(projectRoot, 'src/ts/index.ts'),
    },
    output: {
        filename: "[name].js",
        path: path.resolve(projectRoot, 'dist'),
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.css', '.scss'],
        modules: [
            path.resolve(projectRoot, "src"),
            path.resolve(projectRoot, "node_modules"),
        ]
    },
    devtool: "source-map",
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: /node_modules/,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.module\.s(a|c)ss$/,
                loader: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                includePaths: [
                                    path.resolve(projectRoot, "src"),
                                    path.resolve(projectRoot, "node_modules"),
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.s(a|c)ss$/,
                exclude: /\.module.(s(a|c)ss)$/,
                loader: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                includePaths: [
                                    path.resolve(projectRoot, "src"),
                                    path.resolve(projectRoot, "node_modules"),
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                loader: [
                    'style-loader',
                ]
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
                use: 'url-loader',
            }
        ],
    },
};
