var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

var BABEL_QUERY = {
    presets: ['react', 'es2015'],
    plugins: [
        ['transform-object-rest-spread'],
        ['transform-class-properties'],
        ['transform-decorators-legacy']
    ]
};

module.exports = {
    entry: [
        './client'
    ],
    resolve: {
        modulesDirectories: ['node_modules', 'shared'],
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: BABEL_QUERY
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract("style", "css!sass")
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style", "css")
        }, {
            test: /\.gif$/,
            loader: "url-loader?limit=10000&mimetype=image/gif"
        }, {
            test: /\.jpg$/,
            loader: "url-loader?limit=10000&mimetype=image/jpg"
        }, {
            test: /\.png$/,
            loader: "url-loader?limit=10000&mimetype=image/png"
        }, {
            test: /\.svg/,
            loader: "url-loader?limit=26000&mimetype=image/svg+xml"
        }, {
            test: /\.(woff|woff2|ttf|eot)/,
            loader: "url-loader?limit=100000"
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                BROWSER: JSON.stringify(true),
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
            }
        }),
        new ExtractTextPlugin("style.css", {
            allChunks: false
        })
    ]
};

