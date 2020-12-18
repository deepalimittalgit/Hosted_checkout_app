const path = require('path');
const webpack = require('webpack');

const ROOT = path.resolve( __dirname, 'sdk' );
const DESTINATION = path.resolve( __dirname, 'dist' );

module.exports = {
    context: ROOT,

    entry: {
        'main': './dummy.js'
    },

    output: {
        path: DESTINATION,
        filename: 'sdk.js',
        // library: 'Clover',
        // libraryTarget: 'var',
    },

    resolve: {
        extensions: ['.ts', '.js'],
        modules: [
            ROOT
        ]
    },

    module: {
        rules: [

        ]
    },

    devtool: 'cheap-module-source-map',
    devServer: {}
};