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
    resolve: {
        extensions: ['', '.js'],
    },
    babel: {
        presets: ['es2015', 'stage-0'],
        plugins: ['transform-runtime']
    },
    debug: true,
    devtool: 'cheap-source-map'
};
