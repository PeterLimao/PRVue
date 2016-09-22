var Path = require('path');
var Webpack = require('webpack');

module.exports = {
    entry: {
        PRVue: ['./src/index.js']
    },
    output: {
        path: Path.join(__dirname, './dist'),
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['', '.js'],
    },
    babel: {
        presets: ['es2015', 'stage-0'],
        plugins: ['transform-runtime']
    },
    plugins: [
        new Webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new Webpack.optimize.OccurenceOrderPlugin()
    ]
};